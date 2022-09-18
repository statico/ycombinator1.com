import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const path = req.url === "/" ? "/item?id=30181167" : req.url
  res
    .status(302)
    .setHeader("Location", `https://news.ycombinator.com${path}`)
    .end()
}
