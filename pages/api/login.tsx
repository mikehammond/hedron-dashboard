import auth0 from '../../utils/auth0';
import { NextApiResponse, NextApiRequest } from 'next'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth0.handleLogin(req, res, {});
  } catch(error) {
    res.status(error.status || 500).end(error.message)
  }
}