import { NextApiRequest } from 'next';
import { prisma } from '@/server/db';
import { Session } from 'next-auth';
import axios from 'axios';

const getRegion = (pokemon: any) => {
        switch (pokemon.pokemon.region) {
          case 'Alola': {
            return '-alola';
          }
          case 'Galarian': {
            return '-galar';
          }
          case 'Hisuian': {
            return '-hisui';
          }
          default:
            return '';
        }
}

const get = async (req: NextApiRequest, Session: Session) => {
  const user = (req.query.userId as string) ?? Session.user.id;

  const response = await prisma.usersPokemon.findMany({
    where: {
      userId: user,
    },
    include: {
      pokemon: true,
    },
    orderBy: {
        pokemon: {
            natlDex: 'asc',
        }
    }
  });

  let pokeAPIInfo: any[] = [];
  for (let i = 0; i < response.length; i++) {
    let name = response[i].pokemon.name.replace(/['‘’"“”]/g, '').toLowerCase();

    if(name === 'pumpkaboo' || name == 'gourgeist') {
        name = name + '-average';
    }
    
    const info = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}${getRegion(response[i])}`
    );
    //console.log(info.data);
    pokeAPIInfo.push(info.data);
  }

  const pokemon = response?.map((pokemon) => {
    return {
      pokeId: pokemon.pokeId,
      natlDex: pokemon.pokemon.natlDex,
      name: pokemon.pokemon.name,
      favorite: pokemon.favorite,
      region: pokemon.pokemon.region,
      type: [pokemon.pokemon.type1, pokemon.pokemon.type2],
      sprite: pokeAPIInfo.find(
        (poke: any) =>
          poke.name === pokemon.pokemon.name.replace(/['‘’"“”]/g, '').toLowerCase() ||
          poke.name ===
            pokemon.pokemon.name.replace(/['‘’"“”]/g, '')
              .toLowerCase()
              .concat(getRegion(pokemon)) ||
            poke.name === `${pokemon.pokemon.name.toLowerCase()}-average`
      )?.sprites?.front_default,
    };
  });

  return pokemon;
};

const post = async (req: NextApiRequest, Session: Session) => {
  const newPokemon = req.body;
    console.log(newPokemon.pokeId);
  if (Array.isArray(newPokemon.pokeId)) {
    let responses = [];
    for(let i = 0; i < newPokemon.pokeId.length; i++) {
        const response = await prisma.usersPokemon.create({
            data: {
                userId: Session.user.id,
                pokeId: newPokemon.pokeId[i],
            }
        })

        responses.push(response);   
    }
    return responses;
  } else {
    const response = await prisma.usersPokemon.create({
      data: {
        userId: Session.user.id,
        pokeId: newPokemon.pokeId,
      },
    });

    return response;
  }
};

const put = async (req: NextApiRequest, Session: Session) => {
    if(req.body.task === 'delete') {
        const response = await prisma.usersPokemon.deleteMany({
            where: {
                userId: Session.user.id,
                pokeId: {
                    in: req.body.pokeIds,
                }
            }
        });

        return response;
    }

    if(req.body.task === 'favorite') {
        const response = await prisma.usersPokemon.update({
            where: {
                userId_pokeId: {
                    userId: Session.user.id,
                    pokeId: req.body.pokeId,
                }
            },
            data: {
                favorite: req.body.favorite,
            }
        });

        return response;
    }
}

const pokedex = {
  get,
  post,
  put,
};

export default pokedex;
