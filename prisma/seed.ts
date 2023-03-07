import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedDB = async () => {
  const types = [
    {
      type: 'grass',
      grass: 'nve',
      water: 'super',
      fire: 'nve',
      rock: 'super',
      ground: 'super',
      bug: 'nve',
      poison: 'nve',
      flying: 'nve',
      dragon: 'nve',
      steel: 'nve',
    },
    {
      type: 'water',
      grass: 'nve',
      water: 'nve',
      fire: 'super',
      rock: 'super',
      ground: 'super',
      dragon: 'nve',
    },
    {
      type: 'fire',
      grass: 'super',
      water: 'nve',
      fire: 'nve',
      rock: 'nve',
      bug: 'super',
      ice: 'super',
      dragon: 'nve',
      steel: 'super',
    },
    {
      type: 'electric',
      grass: 'nve',
      water: 'super',
      electric: 'nve',
      ground: 'zero',
      flying: 'super',
      dragon: 'nve',
    },
    {
      type: 'rock',
      fire: 'super',
      ground: 'nve',
      bug: 'super',
      flying: 'super',
      fighting: 'nve',
      ice: 'super',
      steel: 'nve',
    },
    {
      type: 'ground',
      grass: 'nve',
      fire: 'super',
      electric: 'super',
      rock: 'super',
      bug: 'nve',
      poison: 'super',
      flying: 'zero',
      steel: 'super',
    },
    {
      type: 'bug',
      grass: 'super',
      fire: 'nve',
      poison: 'nve',
      flying: 'nve',
      fighting: 'nve',
      psychic: 'super',
      ghost: 'nve',
      dark: 'super',
      steel: 'nve',
      fairy: 'nve',
    },
    {
      type: 'poison',
      grass: 'super',
      rock: 'nve',
      ground: 'nve',
      poison: 'nve',
      ghost: 'nve',
      steel: 'zero',
      fairy: 'super',
    },
    {
      type: 'flying',
      grass: 'super',
      electric: 'nve',
      rock: 'nve',
      bug: 'super',
      fighting: 'super',
      steel: 'nve',
    },
    {
      type: 'normal',
      rock: 'nve',
      ghost: 'zero',
      steel: 'nve',
    },
    {
      type: 'fighting',
      rock: 'super',
      bug: 'nve',
      poison: 'nve',
      flying: 'nve',
      normal: 'super',
      psychic: 'nve',

      ice: 'super',
      dark: 'super',
      steel: 'super',
      fairy: 'nve',
    },
    {
      type: 'psychic',
      poison: 'super',
      fighting: 'super',
      psychic: 'nve',
      dark: 'zero',
      steel: 'nve',
    },
    {
      type: 'ghost',
      normal: 'zero',
      psychic: 'super',
      ghost: 'super',
      dark: 'nve',
    },
    {
      type: 'ice',
      grass: 'super',
      water: 'nve',
      fire: 'nve',
      ground: 'super',
      flying: 'super',
      ice: 'nve',
      dragon: 'super',
      steel: 'nve',
    },
    {
      type: 'dragon',
      dragon: 'super',
      steel: 'nve',
      fairy: 'zero',
    },
    {
      type: 'dark',
      fighting: 'nve',
      psychic: 'super',
      ghost: 'super',
      dark: 'nve',
      fairy: 'nve',
    },
    {
      type: 'steel',
      water: 'nve',
      fire: 'nve',
      electric: 'nve',
      rock: 'super',
      ice: 'super',
      steel: 'nve',
      fairy: 'super',
    },
    {
      type: 'fairy',
      fire: 'nve',
      poison: 'nve',
      fighting: 'super',
      dragon: 'super',
      dark: 'super',
      steel: 'nve',
    },
  ];

  let responses: any[] = [];
  for(let i = 0; i < types.length; i++) {
    const response = await prisma.types.create({
        data: types[i]
    })

    if(response) {
        responses.push(response.type);
    }
  }

  console.log('These types not added: ', types.filter(type => responses.includes(type.type)).map(type => type.type))
  // const forms = ['Galar','Alola','Paldea','Hisui', 'Hisuian', 'Galarian']
  // const uniqueList: {natlDex: number, name: string, type1: string, type2?: string | null, region: string | null}[] = [];
  // data.forEach(pokemon => {
  //     const exists = uniqueList.filter(p => p.name === pokemon.name)[0];

  //     // if(!uniqueList.length || (!exists && !forms.includes(pokemon.form))) {
  //     //     uniqueList.push({
  //     //         name: pokemon.name,
  //     //         natlDex: pokemon.natlDex,
  //     //         type1: pokemon.type[0] ? pokemon.type[0] : null,
  //     //         type2: pokemon.type[1] ? pokemon.type[1] : null,
  //     //         form: forms.includes(pokemon.form) ? pokemon.form : null,
  //     //     })
  //     // } else
  //     if (!exists || (!!exists && forms.includes(pokemon.form)) || (exists?.region && forms.includes(exists.region))) {
  //         uniqueList.push({
  //             name: pokemon.name,
  //             natlDex: pokemon.natlDex,
  //             type1: pokemon.type[0]!,
  //             type2: pokemon.type[1] ? pokemon.type[1] : null,
  //             region: forms.includes(pokemon.form) ? pokemon.form : null,
  //         })
  //     }
  // })

  // const allResponses: any[] = [];

  // for(let i = 0; i < uniqueList.length; i++) {
  //     if(uniqueList[i]) {
  //         const response = await prisma.pokedex.create({
  //             data: uniqueList[i]!,
  //         })

  //         allResponses.push(response);
  //     }

  // }
};

seedDB()
  .then(() => {
    prisma.$disconnect;
  })
  .catch((e: any) => {
    console.log(e);
    prisma.$disconnect;
    process.exit(1);
  });

export {};
