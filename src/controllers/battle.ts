import { NextApiRequest } from "next";
import { prisma } from "@/server/db";
import { Session } from "next-auth";
import { PokemonClient } from "pokenode-ts";
import axios from "axios";
import { getRegion } from "./pokedex";

export type EligiblePoke = {
  pokemon: {
    name: string;
    natlDex: number;
    type1: string;
    type2: string | null;
    best?: boolean;
    better?: boolean;
    good?: boolean;
  };
  sprite?: string;
};

export type EnemyPoke = {
  weakTo: string[];
  immuneTo: string[];
  resists: string[];
  super: string[];
  winners?: {
    best?: EligiblePoke[];
    better?: EligiblePoke[];
    good?: EligiblePoke[];
  };
  id: number;
  name: string;
  natlDex: number;
  type1: string;
  type2: string | null;
  region: string | null;
};

const get = async (req: NextApiRequest, Session: Session) => {
  const pokeAPI = new PokemonClient();
  const user = Session.user.id;
  const pokemon =
    typeof req.query.selected === "string" && req.query.selected.includes(",")
      ? req.query.selected.split(",")
      : Array.isArray(req.query.selected)
      ? req.query.selected
      : req.query.selected
      ? [req.query.selected]
      : undefined;
  console.log(req.query);
  if (!req.query.selected || !pokemon) {
    return [];
  }
  const pokeInfo = await prisma.pokedex.findMany({
    where: {
      id: { in: pokemon.map((id) => parseInt(id)) },
    },
  });

  const allTypes = [
    ...new Set([
      ...pokeInfo.map((poke) => poke.type1),
      ...pokeInfo.map((poke) => poke.type2),
    ]),
  ].filter((type) => type !== null);

  let typeInfo: {
    [x: string]: {
      immuneTo: string[];
      weakTo: string[];
      resists: string[];
      super: string[];
    };
  } = {};
  for (let i = 0; i < allTypes.length; i++) {
    if (allTypes[i] !== null) {
      const info = await pokeAPI.getTypeByName(allTypes[i]!.toLowerCase());
      typeInfo = {
        ...typeInfo,
        [allTypes[i]!]: {
          weakTo: info.damage_relations.double_damage_from.map(
            (type) => type.name
          ),
          resists: info.damage_relations.half_damage_from.map(
            (type) => type.name
          ),
          immuneTo: info.damage_relations.no_damage_from.map(
            (type) => type.name
          ),
          super: info.damage_relations.double_damage_to.map(
            (type) => type.name
          ),
        },
      };
    }
  }

  const enemyWithTypeInfo: EnemyPoke[] = pokeInfo.map((poke) => {
    const type1 = typeInfo[poke.type1];
    let weakTo: string[];
    let resists: string[];
    let immuneTo: string[];
    let sup: string[];

    let type2: {
      immuneTo: any[];
      weakTo: any[];
      resists: any[];
      super: any[];
    };
    if (poke.type2) {
      type2 = typeInfo[poke.type2];
      weakTo = [
        ...new Set(
          type1.weakTo
            .filter(
              (type) =>
                !type2.resists.includes(type) && !type2.immuneTo.includes(type)
            )
            .concat(
              type2.weakTo.filter(
                (type) =>
                  !type1.resists.includes(type) &&
                  !type1.immuneTo.includes(type)
              )
            )
        ),
      ];
      resists = [
        ...new Set(
          type1.resists
            .filter(
              (type) =>
                !type2.weakTo.includes(type) && !type2.immuneTo.includes(type)
            )
            .concat(
              type2.resists.filter(
                (type) =>
                  !type1.weakTo.includes(type) && !type1.immuneTo.includes(type)
              )
            )
        ),
      ];
      (immuneTo = [...new Set(type1.immuneTo.concat(type2.immuneTo))]),
        (sup = [...new Set(type1.super.concat(type2.super))]);
    } else {
      weakTo = type1.weakTo;
      resists = type1.resists;
      immuneTo = type1.immuneTo;
      sup = type1.super;
    }

    return {
      ...poke,
      weakTo,
      immuneTo,
      resists,
      super: sup,
    };
  });

  for (let i = 0; i < enemyWithTypeInfo.length; i++) {
    let eligiblePokes = await prisma.usersPokemon.findMany({
      where: {
        userId: user,
        pokemon: {
          OR: [
            {
              type1: {
                in: enemyWithTypeInfo[i].weakTo.map(
                  (type) => type.split("")[0].toUpperCase() + type.substring(1)
                ),
              },
            },
            {
              type2: {
                in: enemyWithTypeInfo[i].weakTo.map(
                  (type) => type.split("")[0].toUpperCase() + type.substring(1)
                ),
              },
            },
          ],
        },
      },
      select: {
        pokemon: {
          select: {
            name: true,
            natlDex: true,
            type1: true,
            type2: true,
            region: true,
          },
        },
      },
    });

    let pokeAPIInfo: any[] = [];

    for (let i = 0; i < eligiblePokes.length; i++) {
      let name = eligiblePokes[i].pokemon.name
        .replace(/['‘’"“”]/g, "")
        .toLowerCase();

      switch (name) {
        case "pumpkaboo":
        case "gourgeist": {
          name = name + "-average";
          break;
        }
        case "mr. mime": {
          name = "mr-mime";
          break;
        }
        default: {
          break;
        }
      }

      const info = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}${getRegion(eligiblePokes[i])}`
      );
      //console.log(info.data);
      pokeAPIInfo.push(info.data);
    }

    const pokesWithSprite = eligiblePokes.map(pokemon => ({
      ...pokemon,
      sprite: pokeAPIInfo.find(
        (poke: any) =>
          poke.name ===
            pokemon.pokemon.name.replace(/['‘’"“”]/g, "").toLowerCase() ||
          poke.name ===
            pokemon.pokemon.name
              .replace(/['‘’"“”]/g, "")
              .toLowerCase()
              .concat(getRegion(pokemon)) ||
          poke.name === `${pokemon.pokemon.name.toLowerCase()}-average` ||
          (poke.name === `mr-mime` && pokemon.pokemon.name === "Mr. Mime")
      )?.sprites?.front_default,
    }))

    enemyWithTypeInfo[i].winners = selectTier(
      pokesWithSprite,
      enemyWithTypeInfo[i]
    );
  }

  return enemyWithTypeInfo;
};

const selectTier = (pokemon: EligiblePoke[], enemy: EnemyPoke) => {
  let winners: any = {
    best: [],
    better: [],
    good: [],
  };

  winners.best = pokemon.filter((poke) => {
    if (poke.pokemon.type2) {
      return (
        enemy.weakTo.includes(poke.pokemon.type1.toLowerCase()) &&
        enemy.weakTo.includes(poke.pokemon.type2.toLowerCase())
      );
    }

    return enemy.weakTo.includes(poke.pokemon.type1.toLowerCase());
  });

  winners.better = pokemon.filter(
    (poke) =>
      !winners?.best
        ?.map((poke: EligiblePoke) => poke.pokemon.name)
        ?.includes(poke.pokemon.name) &&
      (enemy.weakTo.includes(poke.pokemon.type1.toLowerCase()) ||
        (poke.pokemon.type2 &&
          enemy.weakTo.includes(poke.pokemon.type2.toLowerCase())))
  );

  winners.good = pokemon
    .filter((poke) => {
      if (poke.pokemon.type2) {
        return (
          !enemy.super.includes(poke.pokemon.type1.toLowerCase()) &&
          !enemy.super.includes(poke.pokemon.type2.toLowerCase())
        );
      }
      return !enemy.super.includes(poke.pokemon.type1.toLowerCase());
    })
    .filter(
      (poke) =>
        !winners.best
          .map((pokemon: EligiblePoke) => pokemon.pokemon.name)
          .includes(poke.pokemon.name) &&
        !winners.better
          .map((pokemon: EligiblePoke) => pokemon.pokemon.name)
          .includes(poke.pokemon.name)
    );

  return winners;
};

const battle = {
  get,
};

export default battle;
