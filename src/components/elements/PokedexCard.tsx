import React from 'react';

export interface Pokemon {
  favorite: boolean;
  name: string;
  natlDex: number;
  pokeId: number;
  region: string | null;
  sprite?: string;
  type: string[];
}

const PokedexCard: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
  return (
    <div className='card md:w-1/4 px-2 py-2'>
      <div className='card-body relative h-full w-full bg-zinc-50 rounded-md border-b border-r border-gray-100 px-2 py-1 shadow-inner shadow-zinc-500/25'>
        <h4 className='text-xl font-bold text-teal-600'>
          #{pokemon.natlDex} {pokemon.name}
        </h4>
        <div className='relative flex flex-nowrap gap-2 clear-both'>
        {pokemon.type.map((type) => {
          return (
            <div
              className={`tag rounded-full py-1 px-2 text-xs ${type}`}
              key={`${type}-${pokemon.pokeId}`}
            >
              {type}
            </div>
          );
        })}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pokemon.sprite} alt={`Sprite of ${pokemon.name}`} className='mb-6 float-right -mt-4' />
        {/* <ul className="pt-5 pb-2 text-xs mb-7">
          <li>Weak to: {pokemon.weaknesses.join(', ')}</li>
          <li>Resists: {pokemon.resists.join(', ')}</li>
        </ul> */}
        <div className='flex w-full flex-nowrap justify-between border-t absolute bottom-0 h-7 -ml-2'>
          <div className='w-1/2 border-r text-center'>⭐</div>
          <div className='w-1/2 text-center'>X</div>
        </div>
      </div>
    </div>
  );
};

export default PokedexCard;
