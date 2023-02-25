import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res
    .status(302)
    .setHeader("Location", `https://news.ycombinator.com${req.url}`)
    .end();
};
