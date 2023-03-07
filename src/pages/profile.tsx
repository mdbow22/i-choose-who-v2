import type { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from 'next-auth';
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import PokedexCard, { Pokemon } from '../components/elements/PokedexCard';
import TopNav from "../components/navigation/TopNav";
import { authOptions } from './api/auth/[...nextauth]';
import { prisma } from '@/server/db';
import DropDown from '@/components/elements/inputs/DropDown';
import { useAPI } from '@/utils/api';
import Loader from '@/components/elements/Loader';

export type PokemonDropDown = {
    id: number;
    name: string;
    natlDex: number;
    region: string | null;
}[]

const Profile: NextPage<{ allPokemon: PokemonDropDown }> = ({ allPokemon }) => {
  const { data: session } = useSession();
  const [pokemonDD, setPokemonDD] = useState<any[]>([]);
  const [selectedPokes, setSelectedPokes] = useState<any[]>([]);
  const [userPokemon, setUserPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const API = useAPI();

  // useEffect(() => {
  //   setPokemonDD(allPokemon.map(poke => ({
  //     value: poke,
  //     label: poke.region ? `#${poke.natlDex} ${poke.name} - ${poke.region}` : `#${poke.natlDex} ${poke.name}`,
  //   })))
  // }, [allPokemon])

  useEffect(() => {
    let initialized = false;

    if(!initialized) {
      API.get('/api/pokedex/userPokemon').then((res: any) => {
        setUserPokemon(res.data);

        setPokemonDD(allPokemon.filter(poke => !res.data.map((poke: any) => poke.pokeId).includes(poke.id)).map(poke => ({
          value: poke,
          label: poke.region ? `#${poke.natlDex} ${poke.name} - ${poke.region}` : `#${poke.natlDex} ${poke.name}`,
        })))

        setLoading(false);
      }).catch((err: any) => {
        setLoading(false);
        console.error(err);
      })
    }

    return () => { initialized = true; }
  }, [API, allPokemon])

  useEffect(() => {
    if(userPokemon.length) {
      setPokemonDD(allPokemon.filter(poke => !userPokemon.map((poke: any) => poke.pokeId).includes(poke.id)).map(poke => ({
        value: poke,
        label: poke.region ? `#${poke.natlDex} ${poke.name} - ${poke.region}` : `#${poke.natlDex} ${poke.name}`,
      })))
    } else {
      setPokemonDD(allPokemon.map(poke => ({
        value: poke,
        label: poke.region ? `#${poke.natlDex} ${poke.name} - ${poke.region}` : `#${poke.natlDex} ${poke.name}`,
      })))
    }
  }, [userPokemon, allPokemon])

  const submit = async () => {
    if(selectedPokes.length) {
      const ids = selectedPokes.length === 1 ? selectedPokes[0].value.id : selectedPokes.map(poke => poke.value.id);
      const post = await API.post('/api/pokedex/userPokemon', {
        pokeId: ids,
      })

      if(post.status === 201) {
        API.get('/api/pokedex/userPokemon').then((res: any) => {
          setUserPokemon(res.data);
        })
      }

      setSelectedPokes([]);
    }
  }

  const remove = async (pokeId: number) => {
    const removal = await API.put('/api/pokedex/userPokemon', {
      task: 'delete',
      pokeIds: [pokeId],
    })

    if(removal.status === 200) {
      setUserPokemon(prev => prev.filter(poke => ![pokeId].includes(poke.pokeId)));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#c6f2ff] to-[#ffffff]">
      <TopNav />
      <main className="container relative mx-auto mt-10 max-w-5xl min-h-screen">
        <h1 className="mb-5 text-4xl font-bold text-teal-600">
          {session?.user.name ?? session?.user.email?.split("@")[0]}&apos;s
          Pokédex
        </h1>
        <div className='mb-5 flex flex-nowrap w-full gap-5'>
          <DropDown
            placeholder='select...'
            listItems={pokemonDD}
            multiple={true}
            value={selectedPokes}
            onChange={setSelectedPokes}
            closeOnSelect={false}
          />
          <button type='button' className='btn' onClick={submit}>Add</button>
        </div>
        {loading &&
        <div className='w-full flex justify-center items-center mt-16'>
          <Loader />
        </div>
        }
        {!loading &&
          <div className="flex flex-row flex-wrap items-stretch">
            {userPokemon.length ? userPokemon.map(poke => {
                return (
                    <PokedexCard pokemon={poke} remove={remove} key={poke.pokeId} />
                )
            }) :
              <div className='text-center'>You have no Pokémon in your Pokédex</div>
            }
        </div>
        }
        
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

export default Profile;
