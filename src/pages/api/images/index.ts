// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { loadImages } from '@/lib/api'

interface errorResponse {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<any>|errorResponse>
) {
  const {section = 'hot', sort = 'viral', window = 'day', page = '1'} = req.query;
  const images = await loadImages(section as string, sort as string, window as string, parseInt(page as string));
  res.status(200).json(images)
}
