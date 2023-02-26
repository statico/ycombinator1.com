import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  return (
    <div className="content">
      <h1>news.ycombinator1.com</h1>
      <p className="notice">
        This site is not affiliated with YCombinator or Hacker News.
      </p>
      {router.query?.installed && (
        <p className="alert">
          The HN Previews Slack App has been installed to your Slack workspace.
          Enjoy!
        </p>
      )}
      <p>
        This site lets you add a single character to{" "}
        <a href="https://news.ycombinator.com">Hacker News</a> links to add
        social media and OpenGraph previews for sharing on things like Slack or
        Discord or Twitter or Teams.
      </p>

      <h2>Slack App</h2>
      <p>
        Install the Slack application to automatically get previews (unfurls)
        for <code>news.ycombinator.com</code> links.
      </p>
      <p>
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

      <h2>Discord / Twitter / Manual Usage</h2>
      <p>
        Simply add a <code>1</code> to your Hacker News link, such as{" "}
        <code>https://news.ycombinator1.com/item?id=30167605</code>, and you'll
        see a rich preview instead of a plain URL.
      </p>
      <p>
        <a href="https://news.ycombinator.com/item?id=30181167">
          Read more about it in the Hacker News announcement here.
        </a>
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
      <p>
        Powered by <a href="https://vercel.com/">Vercel</a> and the{" "}
        <a href="https://github.com/HackerNews/API">Hacker News API</a>.
      </p>
      <p>
        <a href="https://github.com/statico/ycombinator1.com">
          Source on GitHub
        </a>
      </p>
    </div>
  );
}
