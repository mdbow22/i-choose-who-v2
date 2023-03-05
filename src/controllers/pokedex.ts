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
  });

  let pokeAPIInfo: any[] = [];
  for (let i = 0; i < response.length; i++) {
    let name = response[i].pokemon.name.replace(/['‘’"“”]/g, '').toLowerCase();
    
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
              .concat(getRegion(pokemon))
      )?.sprites?.front_default,
    };
  });

  return pokemon;
};

const post = async (req: NextApiRequest, Session: Session) => {
  const newPokemon = req.body;

  if (Array.isArray(newPokemon)) {
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

const pokedex = {
  get,
  post,
};

export default pokedex;
