import prismaClient from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const params = req.body.userParams;
  const user = await prismaClient.user.findUnique({
    where: {
      id: params.user_id,
    },
  });

  if (!user) {
    const user = await prismaClient.user.create({
      data: {
        id: params.user_id,
        email: params.email,
        name: params.name,
        class: '',
      },
    });

    return res.status(200).json({ success: true, user });
  }

  res.status(200).json({ success: true, user });
}
