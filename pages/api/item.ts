import { formatISO } from "date-fns"
import { decode, encode } from "html-entities"
import { NextApiRequest, NextApiResponse } from "next"
import fetch from "node-fetch"

const truncate = (str: string, length = 140, ending = "…") => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending
  }
  return str
}

const e = (str: string) => encode(decode(str))

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = String(req.query.id)
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("Malformed id")
  }

  let data: any
  try {
    data = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    ).then((res) => res.json())
  } catch (err) {
    console.error(err)
    return res.status(500).send("Could not fetch item info")
  }

  const url = `https://news.ycombinator.com/item?id=${id}`
  const { text, type, by: author } = data
  const isComment = type === "comment"
  const title =
    (isComment ? `Comment by ${author}` : data.title) + " | Hacker News"
  const snippet =
    truncate(text ?? "", 160) || "View the discussion on Hacker News"
  const time = formatISO(new Date(data.time * 1000))

  res.status(200).send(
    `
		<!doctype html>
		<html>
			<head>

				<title>${e(title)}</title>

				<meta name="description" content="${e(snippet)}" />
				<link rel="apple-touch-icon" href="https://news.ycombinator1.com/favicon.png" />
				<link rel="shortcut icon" href="https://news.ycombinator1.com/favicon.png" />
				<link rel="canonical" href="${e(url)}" />

				<meta property="og:site_name" content="Hacker News" />
				<meta property="og:title" content="${e(title)}" />
				<meta property="og:url" content="${e(url)}" />
				<meta property="og:type" content="article" />
				<meta property="article:published_time" content="${e(time)}" />
				<meta property="og:description" content="${e(snippet)}" />

				<meta itemProp="name" content="${e(title)}" />
				<meta itemProp="description" content="${e(snippet)}" />
				<meta itemProp="datePublished" content="${e(time)}" />
				<meta itemProp="author" content="${e(author)}" />

				<meta name="twitter:card" content="summary" />
				<meta name="twitter:site" content="HackerNews" />
				<meta name="twitter:title" content="${e(title)}" />
				<meta name="twitter:url" content="${e(url)}" />
				<meta name="twitter:description" content="${e(snippet)}" />

			</head>
			<body>
				<script>
					document.location.href = "${e(url)}";
				</script>
			</body>
		</html>
	`
      .trim()
      .replace(/^\s+/gm, "")
  )
}
