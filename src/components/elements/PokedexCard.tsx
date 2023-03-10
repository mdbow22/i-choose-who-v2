import { useAPI } from '@/utils/api';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import {
  faStar as faStarFilled,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

export interface Pokemon {
  favorite: boolean;
  name: string;
  natlDex: number;
  pokeId: number;
  region: string | null;
  sprite?: string;
  type: string[];
}

const PokedexCard: React.FC<{
  pokemon: Pokemon;
  remove: (val: number) => void;
}> = ({ pokemon, remove }) => {
  const API = useAPI();
  const [isFavorite, setIsFavorite] = useState(pokemon.favorite);

  const favoriteStatus = async () => {
    const response = await API.put('/api/pokedex/userPokemon', {
      task: 'favorite',
      pokeId: pokemon.pokeId,
      favorite: !pokemon.favorite,
    });

    if (response.status === 200) {
      setIsFavorite((prev) => !prev);
    }
  };

  return (
    <div className='card w-1/2 md:w-1/4 px-4 py-2'>
      <div className='card-body relative h-full w-full bg-zinc-50 rounded-md border-t border-l border-zinc-400/25 px-2 py-1 shadow shadow-zinc-500/25'>
        <h4 className='text-xl font-bold text-teal-600'>
          #{pokemon.natlDex} {pokemon.name}{' '}
          {pokemon.region ? ' - ' + pokemon.region : ''}
        </h4>
        <div className='relative flex flex-nowrap gap-1 clear-both'>
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
        <img
          src={pokemon.sprite}
          alt={`Sprite of ${pokemon.name}`}
          className='mb-6 float-right -mt-4'
        />
        {/* <ul className="pt-5 pb-2 text-xs mb-7">
          <li>Weak to: {pokemon.weaknesses.join(', ')}</li>
          <li>Resists: {pokemon.resists.join(', ')}</li>
        </ul> */}
        <div className='flex w-full flex-nowrap justify-between border-t absolute bottom-0 h-7 -ml-2'>
          <button
            type='button'
            className='w-1/2 border-r text-center'
            onClick={favoriteStatus}
          >
            <FontAwesomeIcon
              icon={isFavorite ? faStarFilled : faStar}
              className='text-yellow-500'
            />
          </button>
          <button
            type='button'
            className='w-1/2 text-center text-red-500 hover:bg-red-500 hover:text-zinc-50 rounded-br-md'
            onClick={() => remove(pokemon.pokeId)}
          >
            <FontAwesomeIcon icon={faXmark} size='lg' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokedexCard;
