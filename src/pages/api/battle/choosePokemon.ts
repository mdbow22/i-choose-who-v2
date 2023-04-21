import { type NextApiRequest, type NextApiResponse } from 'next';
import { getServerAuthSession } from '../auth/[...nextauth]';
import battle from '@/controllers/battle';

const choosePokemon = async (req: NextApiRequest, res: NextApiResponse) => {
    const Session = await getServerAuthSession({ req, res });

    if(!Session) {
        return res.status(403).json({message: 'Unauthenticated User'})
    }

    switch(req.method) {
        case 'GET': {
            const response = await battle.get(req, Session);
            return res.status(200).json(response);
        }
    }
}

export default choosePokemon;