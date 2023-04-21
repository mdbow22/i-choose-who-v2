import { NextApiRequest } from "next";
import { prisma } from "@/server/db";
import { Session } from "next-auth";
import { PokemonClient } from "pokenode-ts";

const get = async (req: NextApiRequest, Session: Session) => {
    const pokeAPI = new PokemonClient;
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

  let typeInfo = {};
  for(let i = 0; i < allTypes.length; i++) {
    if(allTypes[i] !== null) {
        const info = await pokeAPI.getTypeByName(allTypes[i]!.toLowerCase())
        typeInfo = {
            ...typeInfo,
            [allTypes[i]!]: info.damage_relations,
        }
    }
    
  }

  return typeInfo;
};

const battle = {
  get,
};

export default battle;
