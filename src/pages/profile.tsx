import type { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from 'next-auth';
import { useSession } from "next-auth/react";
import React from "react";
import PokedexCard from '../components/elements/PokedexCard';
import TopNav from "../components/navigation/TopNav";
import { authOptions } from './api/auth/[...nextauth]';

const pokemon = [
    {
        name: 'Pikachu',
        number: 25,
        type: ['electric'],
        resists: ['electric','flying','steel'],
        weaknesses: ['ground'],
    },
    {
        name: 'Steelix',
        number: 208,
        type: ['steel','ground'],
        resists: ['normal','flying','psychic','bug','rock','dragon','steel','fairy'],
        weaknesses: ['fire','water','fighting','ground'],
    }
]

const Profile: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#c6f2ff] to-[#ffffff]">
      <TopNav />
      <main className="container relative mx-auto mt-10 max-w-5xl min-h-screen">
        <h1 className="mb-10 text-4xl font-bold text-teal-600">
          {session?.user.name ?? session?.user.email?.split("@")[0]}&apos;s
          Pokédex
        </h1>
        <div className="flex flex-row items-stretch">
            {pokemon.map(poke => {
                return (
                    <PokedexCard pokemon={poke} key={poke.number} />
                )
            })}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

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
        },
      }
}

export default Profile;
