# news.ycombinator1.com

This site is not affiliated with YCombinator or Hacker News.

This service lets you add a single character to [Hacker News](https://news.ycombinator.com) links to add social media and OpenGraph previews for sharing on things like Slack or Discord or Twitter or Teams. [Read more about it in the Hacker News announcement here.](https://news.ycombinator.com/item?id=30181167)

## Slack App

Install the Slack application to automatically get previews (unfurls) for `news.ycombinator.com` links.

[![Add to Slack](https://platform.slack-edge.com/img/add_to_slack.png)](https://slack.com/oauth/v2/authorize?client_id=124731001364.4852465343846&scope=links:read,links:write&user_scope=)

It looks like this:

<img src="https://user-images.githubusercontent.com/137158/221394895-7a6a29a3-3685-4784-bf27-0746e79e19b5.png" width="500" height="267" alt="screenshot of Slack integration"/>

## Discord / Twitter / Manual Usage

Simply add a `1` to your Hacker News link, such as `https://news.ycombinator1.com/item?id=30167605`, and you'll see a rich preview instead of a plain URL.

On Slack you'll see:

![Slack preview of story](https://user-images.githubusercontent.com/137158/152107529-4aef2e19-3761-4021-9530-e7830373a4b6.png)

...or for a comment:

![Slack preview of comment](https://user-images.githubusercontent.com/137158/152107576-c8090184-93cc-4ccf-a5ec-81877081408f.png)

On Discord you'll see:

![Discord preview](https://user-images.githubusercontent.com/137158/152107677-16301c32-bee1-41b0-8247-5d2bfbdf896b.png)

On Twitter you'll see:

![Twitter preview](https://user-images.githubusercontent.com/137158/152107766-42a4f926-ee66-4d85-b48a-af14c1fb1c44.png)

Powered by [Vercel](https://vercel.com/) and the [Hacker News API](https://github.com/HackerNews/API).

[Source on GitHub](https://github.com/statico/ycombinator1.com)
