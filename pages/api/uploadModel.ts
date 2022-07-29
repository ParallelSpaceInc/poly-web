import prismaClient from 'lib/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const params = req.body.params;

    const data = await prismaClient.model.create({
      data: {
        name: params.name,
        user_id: params.user_id,
        src: params.src,
        id: params.id,
      },
    });

    res.status(200).json({
      success: false,
      data,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: '모델 업로드 실패' });
  }
}
