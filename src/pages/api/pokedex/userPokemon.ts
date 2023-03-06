import { type NextApiRequest, type NextApiResponse } from 'next';
import { getServerAuthSession } from '../auth/[...nextauth]';
import pokedex from '@/controllers/pokedex';

const userPokemon = async (req: NextApiRequest, res: NextApiResponse) => {
    const Session = await getServerAuthSession({ req, res });

    if(!Session) {
        return res.status(403).json({message: 'Unauthenticated User'})
    }

    switch(req.method) {
        case 'GET': {
            const response = await pokedex.get(req, Session);
            return res.status(200).json(response);
        }
        case 'POST': {
            const response = await pokedex.post(req, Session);
            return res.status(201).json(response);
        }
        case 'PUT': {
            const response = await pokedex.put(req, Session);
            return res.status(200).json(response);
        }
    }
}

export default userPokemon;