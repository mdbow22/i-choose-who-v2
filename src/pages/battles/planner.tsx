import DropDown from "@/components/elements/inputs/DropDown";
import TopNav from "@/components/navigation/TopNav";
import { GetServerSidePropsContext, NextPage } from "next";
import React, { useEffect, useState } from "react";
import { PokemonDropDown } from "../profile";
import { Pokemon } from "@/components/elements/PokedexCard";
import { useAPI } from "@/utils/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { prisma } from "@/server/db";
import { EnemyPoke } from "@/controllers/battle";

const planner: NextPage<{ allPokemon: PokemonDropDown }> = ({ allPokemon }) => {
  const pokemonDD = allPokemon.map((poke) => ({
    value: poke,
    label: poke.region
      ? `#${poke.natlDex} ${poke.name} - ${poke.region}`
      : `#${poke.natlDex} ${poke.name}`,
  }));
  const [selectedPokes, setSelectedPokes] = useState<any[]>([]);
  const [results, setResults] = useState<EnemyPoke[]>([]);

  const API = useAPI();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedPokes.length) {
      e.stopPropagation();
      return;
    }

    const info = await API.get(
      `/api/battle/choosePokemon?selected=${selectedPokes
        .map((poke) => poke.value.id)
        .join(",")}`
    );

    setResults(info.data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#c6f2ff] to-[#ffffff]">
      <TopNav />
      <main className="container relative mx-auto mt-10 max-w-5xl min-h-screen">
        <h1 className="mb-5 text-4xl font-bold text-teal-600">
          Battle Planner
        </h1>
        <p>
          Plan our your next battle: pick the enemy pokemon and figure out which
          of yours you should use.
        </p>
        <h2 className="my-5 text-2xl font-bold text-teal-600">The Enemy</h2>
        <form onSubmit={handleSubmit}>
          <DropDown
            placeholder="select up to 6 Pokemon"
            listItems={pokemonDD}
            multiple={true}
            value={selectedPokes}
            onChange={(e) => {
              if (e.length < 7) {
                return setSelectedPokes(e);
              }
              return;
            }}
            closeOnSelect={false}
          />
          <button type="submit" className="btn btn-sm btn-primary mt-3">
            Battle
          </button>
        </form>
          {results?.map((enemy) => {
            return (
              <section className="mt-5">
                <h2 className="text-2xl text-teal-600 font-bold mb-1">
                  {enemy.name}
                </h2>
                <div className="mb-2">
                <p>
                  Weak to:{" "}
                  {enemy.weakTo.map((type, i) => {
                    return (
                      <>
                      {i === enemy.weakTo.length - 1 ? type : `${type}, `}
                      </>
                    )
                  })}
                </p>
                <p>
                  Resists:{" "}
                  {enemy.resists.map((type, i) => {
                    return (
                      <>
                      {i === enemy.resists.length - 1 ? type : `${type}, `}
                      </>
                    )
                  })}
                </p>
                </div>
                <div>
                  <h3 className="font-bold">Who you should use: </h3>
                  <div className="flex gap-5">
                  {!!enemy.winners?.best?.length ? enemy.winners.best.map(poke => {
                    return (
                      <div className="flex">
                        <img src={poke.sprite} />
                        <div className="flex flex-col">
                          <span>{poke.pokemon.name}</span>
                          <div>
                            <span className={`${poke.pokemon.type1} tag rounded-full py-1 px-2 text-xs`}>{poke.pokemon.type1}</span>&nbsp;&nbsp;
                            {poke.pokemon.type2 && <span className={`tag rounded-full py-1 px-2 text-xs ${poke.pokemon.type2}`}>{poke.pokemon.type2}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  }) : !!enemy.winners?.better?.length ? enemy.winners.better.map(poke => {
                    return (
                      <div className="flex">
                        <img src={poke.sprite} />
                        <div className="flex flex-col">
                          <span>{poke.pokemon.name}</span>
                          <div>
                            <span className={`${poke.pokemon.type1} tag rounded-full py-1 px-2 text-xs`}>{poke.pokemon.type1}</span>&nbsp;&nbsp;
                            {poke.pokemon.type2 && <span className={`tag rounded-full py-1 px-2 text-xs ${poke.pokemon.type2}`}>{poke.pokemon.type2}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  }) : !!enemy.winners?.good?.length ? enemy.winners.good.map(poke => {
                    return (
                      <div className="flex">
                        <img src={poke.sprite} />
                        <div className="flex flex-col">
                          <span>{poke.pokemon.name}</span>
                          <div>
                            <span className={`${poke.pokemon.type1} tag rounded-full py-1 px-2 text-xs`}>{poke.pokemon.type1}</span>&nbsp;&nbsp;
                            {poke.pokemon.type2 && <span className={`tag rounded-full py-1 px-2 text-xs ${poke.pokemon.type2}`}>{poke.pokemon.type2}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  }) : 'No one! You need to find some pokemon, because none of yours is strong here.'}
                  </div>
                </div>
              </section>
            );
          })}
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
    },
  });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      allPokemon,
    },
  };
}

export default planner;
