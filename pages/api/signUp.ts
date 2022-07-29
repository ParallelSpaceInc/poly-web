import prismaClient from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const params = req.body.userInfo;
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
          phone: params.phone,
          class: '',
        },
      });

      return res.status(200).json({ success: true, user });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: '로그인 실패' });
  }
}
