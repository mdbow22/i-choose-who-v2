import DropDown from '@/components/elements/inputs/DropDown';
import TopNav from '@/components/navigation/TopNav';
import { GetServerSidePropsContext, NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { PokemonDropDown } from '../profile';
import { Pokemon } from '@/components/elements/PokedexCard';
import { useAPI } from '@/utils/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { prisma } from '@/server/db';

const planner: NextPage<{ allPokemon: PokemonDropDown }> = ({ allPokemon }) => {

  const [pokemonDD, setPokemonDD] = useState<any[]>([]);
  const [selectedPokes, setSelectedPokes] = useState<any[]>([]);
  const [userPokemon, setUserPokemon] = useState<Pokemon[]>([]);

  const API = useAPI();

  useEffect(() => {
    let initialized = false;

    if(!initialized) {
      API.get('/api/pokedex/userPokemon').then((res: any) => {
        setUserPokemon(res.data);

        setPokemonDD(allPokemon.filter(poke => !res.data.map((poke: any) => poke.pokeId).includes(poke.id)).map(poke => ({
          value: poke,
          label: poke.region ? `#${poke.natlDex} ${poke.name} - ${poke.region}` : `#${poke.natlDex} ${poke.name}`,
        })))
      }).catch((err: any) => {
        console.error(err);
      })
    }

    return () => { initialized = true; }
  }, [API, allPokemon])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!selectedPokes.length) {
      e.stopPropagation();
      return;
    }

    const info = await API.get(`/api/battle/choosePokemon?selected=${selectedPokes.map(poke => poke.value.id).join(',')}`)

    console.log(info);
  }
  
  return (
    <div className='min-h-screen bg-gradient-to-t from-[#c6f2ff] to-[#ffffff]'>
      <TopNav />
      <main className='container relative mx-auto mt-10 max-w-5xl min-h-screen'>
        <h1 className="mb-5 text-4xl font-bold text-teal-600">
          Battle Planner
        </h1>
        <p>Plan our your next battle: pick the enemy pokemon and figure out which of yours you should use.</p>
        <h2 className='my-5 text-2xl font-bold text-teal-600'>The Enemy</h2>
        <form onSubmit={handleSubmit}>
          <DropDown
            placeholder='select up to 6 Pokemon'
            listItems={pokemonDD}
            multiple={true}
            value={selectedPokes}
            onChange={(e) => {
              if(e.length < 7) {
                return setSelectedPokes(e);
              }
              return;
            }}
            closeOnSelect={false}
          />
          <button type='submit' className='btn btn-sm btn-primary mt-3'>Battle</button>
        </form>
      </main>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const allPokemon = await prisma.pokedex.findMany({
    select: {
      id: true,
      natlDex: true,
      name: true,
      region: true,
    }
  })

  if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    return {
      props: {
        session,
        allPokemon,
      },
    }
}

export default planner;
