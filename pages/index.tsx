import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const Alert = ({ color, children }: { color: string; children: ReactNode }) => (
  <p className={`rounded p-5 bg-${color}-200 dark:bg-${color}-800`}>
    {children}
  </p>
);

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="text-blue-500 dark:text-blue-300">
    {children}
  </a>
);

export default function Page() {
  const router = useRouter();

  const url = "https://news.ycombinator1.com";
  const image =
    "https://user-images.githubusercontent.com/137158/221394895-7a6a29a3-3685-4784-bf27-0746e79e19b5.png";
  const title = "news.ycombinator1.com";
  const description =
    "Hacker News link preview service for Slack, Discord, Twitter, etc.";

  return (
    <div className="space-y-4">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="canonical" href={url} />
        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta itemProp="name" content={title} />
        <meta itemProp="description" content={description} />
      </Head>

      <h1 className="text-3xl">news.ycombinator1.com</h1>

      <Alert color="red">
        This site is not affiliated with YCombinator or Hacker News.
      </Alert>

      {router.query?.installed && (
        <Alert color="green">
          The HN Previews Slack App has been installed to your Slack workspace.
          Enjoy! 🎉
        </Alert>
      )}

      <p>
        This service lets you add a single character to{" "}
        <Link href="https://news.ycombinator.com">Hacker News</Link> links to
        add social media and OpenGraph previews for sharing on things like Slack
        or Discord or Twitter or Teams.{" "}
        <Link href="https://news.ycombinator.com/item?id=30181167">
          Read more about it in the Hacker News announcement here.
        </Link>
      </p>

      <h2 className="text-xl pt-5">Slack App</h2>
      <p>
        Install the Slack application to automatically get previews (unfurls)
        for <code>news.ycombinator.com</code> links.
      </p>
      <p className="flex justify-center">
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

      <h2 className="text-xl pt-5">Discord / Twitter / Manual Usage</h2>
      <p>
        Simply add a <code>1</code> to your Hacker News link, such as{" "}
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
          src="https://user-images.githubusercontent.com/137158/152107576-c8090184-93cc-4ccf-a5ec-81877081408f.png"
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

      <h2 className="text-xl pt-5">Miscellaneous</h2>
      <p>
        Powered by <Link href="https://vercel.com/">Vercel</Link> and the{" "}
        <Link href="https://github.com/HackerNews/API">Hacker News API</Link>.
        <Link href="https://github.com/statico/ycombinator1.com">
          Source on GitHub
        </Link>
      </p>

      <h2 className="text-xl pt-5">Privacy</h2>
      <p>
        For the redirect service, I don't store logs of requested links other
        than keeping some basic site usage statistics using my lightweight
        <Link href="https://github.com/statico/femtostats">
          Femtostats
        </Link>{" "}
        analytics project. For the Slack app, I may occasionally view the Vercel
        function logs to debug something, but those aren't stored permanently
        and must be viewed live. Other than that, I only store Slack API bot
        tokens on S3.
      </p>
    </div>
  );
}
