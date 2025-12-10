import { FastifyPluginAsync } from "fastify";

const indexRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: { installed?: string } }>(
    "/",
    async (request, reply) => {
      const installed = request.query.installed === "1";

      const html = `
<!doctype html>
<html lang="en-us">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>news.ycombinator1.com</title>
    <meta name="description" content="Hacker News link preview service for Slack, Discord, Twitter, etc." />
    <link rel="apple-touch-icon" href="/favicon.png" />
    <link rel="shortcut icon" href="/favicon.png" />
    <link rel="canonical" href="https://news.ycombinator1.com" />
    <meta property="og:site_name" content="news.ycombinator1.com" />
    <meta property="og:title" content="news.ycombinator1.com" />
    <meta property="og:url" content="https://news.ycombinator1.com" />
    <meta property="og:type" content="website" />
    <meta property="og:description" content="Hacker News link preview service for Slack, Discord, Twitter, etc." />
    <meta property="og:image" content="https://user-images.githubusercontent.com/137158/221394895-7a6a29a3-3685-4784-bf27-0746e79e19b5.png" />
    <meta itemProp="name" content="news.ycombinator1.com" />
    <meta itemProp="description" content="Hacker News link preview service for Slack, Discord, Twitter, etc." />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
    <div class="container mx-auto md:max-w-2xl px-10 py-5 space-y-4">
      <h1 class="text-3xl">news.ycombinator1.com</h1>

      <p class="rounded p-5 bg-red-200 dark:bg-red-800">
        This site is not affiliated with YCombinator or Hacker News.
      </p>

      ${
        installed
          ? `
      <p class="rounded p-5 bg-green-200 dark:bg-green-800">
        The HN Previews Slack App has been installed to your Slack workspace.
        Enjoy! 🎉
      </p>
      `
          : ""
      }

      <p>
        This service lets you add a single character to
        <a href="https://news.ycombinator.com" class="text-blue-500 dark:text-blue-300">Hacker News</a> links to
        add social media and OpenGraph previews for sharing on things like Slack
        or Discord or Twitter or Teams.
        <a href="https://news.ycombinator.com/item?id=30181167" class="text-blue-500 dark:text-blue-300">
          Read more about it in the Hacker News announcement here.
        </a>
      </p>

      <h2 class="text-xl pt-5">Slack App</h2>
      <p>
        Install the Slack application to automatically get previews (unfurls)
        for <code>news.ycombinator.com</code> links.
      </p>
      <p class="flex justify-center">
        <a href="https://slack.com/oauth/v2/authorize?client_id=124731001364.4852465343846&scope=links:read,links:write&user_scope=">
          <img
            alt="Add to Slack"
            height="40"
            width="139"
            src="https://platform.slack-edge.com/img/add_to_slack.png"
            srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
      </p>
      <p>It looks like this:</p>
      <p>
        <img
          src="https://user-images.githubusercontent.com/137158/221394895-7a6a29a3-3685-4784-bf27-0746e79e19b5.png"
          height="500"
          alt="screenshot of Slack integration"
        />
      </p>

      <h2 class="text-xl pt-5">Discord / Twitter / Manual Usage</h2>
      <p>
        Simply add a <code>1</code> to your Hacker News link, such as
        <code>https://news.ycombinator1.com/item?id=30167605</code>, and you'll
        see a rich preview instead of a plain URL.
      </p>
      <p>On Slack you'll see:</p>
      <p>
        <img
          width="645"
          alt="CleanShot 2022-02-01 at 22 54 11@2x"
          src="https://user-images.githubusercontent.com/137158/152107529-4aef2e19-3761-4021-9530-e7830373a4b6.png"
        />
      </p>
      <p>...or for a comment:</p>
      <p>
        <img
          width="649"
          alt="CleanShot 2022-02-01 at 22 54 35@2x"
          src="https://user-images.githubusercontent.com/137158/152107576-c8090184-93cc-4ccf-a5ec-af14c1fb1c44.png"
        />
      </p>
      <p>On Discord you'll see:</p>
      <p>
        <img
          width="477"
          alt="CleanShot 2022-02-01 at 22 55 21@2x"
          src="https://user-images.githubusercontent.com/137158/152107677-16301c32-bee1-41b0-8247-5d2bfbdf896b.png"
        />
      </p>
      <p>On Twitter you'll see:</p>
      <p>
        <img
          width="586"
          alt="CleanShot 2022-02-01 at 22 56 06@2x"
          src="https://user-images.githubusercontent.com/137158/152107766-42a4f926-ee66-4d85-b48a-af14c1fb1c44.png"
        />
      </p>

      <h2 class="text-xl pt-5">Miscellaneous</h2>
      <p>
        Powered by <a href="https://vercel.com/" class="text-blue-500 dark:text-blue-300">Vercel</a> and the
        <a href="https://github.com/HackerNews/API" class="text-blue-500 dark:text-blue-300">Hacker News API</a>.
        <a href="https://github.com/statico/ycombinator1.com" class="text-blue-500 dark:text-blue-300">
          Source on GitHub
        </a>
      </p>

      <h2 class="text-xl pt-5">Privacy</h2>
      <p>
        For the redirect service, I don't store logs of requested links other
        than keeping some basic site usage statistics using my lightweight
        <a href="https://github.com/statico/femtostats" class="text-blue-500 dark:text-blue-300">Femtostats</a>
        analytics project. For the Slack app, I may occasionally view the server
        logs to debug something, but those aren't stored permanently
        and must be viewed live. Other than that, I only store Slack API bot
        tokens on S3.
      </p>
    </div>
  </body>
</html>
    `.trim();

      return reply.type("text/html").send(html);
    },
  );
};

export default indexRoute;
