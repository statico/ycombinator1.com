import { FastifyPluginAsync } from "fastify";
import { decode, encode } from "html-entities";
import { getHNLinkInfo } from "../lib/hacker-news.js";

const e = (str: string) => encode(decode(str));

const itemRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: { id: string } }>(
    "/item",
    async (request, reply) => {
      const { id } = request.query;

      if (!id || !/^\d+$/.test(id)) {
        return reply.status(400).send("Invalid ID");
      }

      const { url, author, isoTime, title, snippet } = await getHNLinkInfo(id);

      const html = `
<!doctype html>
<html lang="en-us">
  <head>
    <meta charset="utf-8" />

    <title>${e(title)}</title>

    <meta name="description" content="${e(snippet)}" />
    <link rel="apple-touch-icon" href="https://news.ycombinator1.com/favicon.png" />
    <link rel="shortcut icon" href="https://news.ycombinator1.com/favicon.png" />
    <link rel="canonical" href="${e(url)}" />

    <meta property="og:site_name" content="Hacker News" />
    <meta property="og:title" content="${e(title)}" />
    <meta property="og:url" content="${e(url)}" />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content="${e(isoTime)}" />
    <meta property="og:description" content="${e(snippet)}" />

    <meta itemprop="name" content="${e(title)}" />
    <meta itemprop="description" content="${e(snippet)}" />
    <meta itemprop="datePublished" content="${e(isoTime)}" />
    <meta itemprop="author" content="${e(author || "")}" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@HackerNews" />
    <meta name="twitter:title" content="${e(title)}" />
    <meta name="twitter:url" content="${e(url)}" />
    <meta name="twitter:description" content="${e(snippet)}" />
    <meta name="twitter:image" content="https://news.ycombinator1.com/favicon.png" />

    <meta http-equiv="refresh" content="0;url=${e(url)}" />
  </head>
  <body style="font-family:system-ui,sans-serif">
    Redirecting you to <a href="${e(url)}">${e(url)}</a>...
    <script>
      document.location.href = "${e(url)}";
    </script>
  </body>
</html>
    `
        .trim()
        .replace(/^\s+/gm, "");

      return reply.type("text/html").send(html);
    },
  );
};

export default itemRoute;
