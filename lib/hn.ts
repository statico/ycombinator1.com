import { formatDistanceToNowStrict, formatISO } from "date-fns";
import fetch from "node-fetch";
import pluralize from "pluralize";

const truncate = (str = "", length = 160, ending = "…") => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  return str;
};

export const getHNLinkInfo = async (id: string) => {
  const data: any = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  ).then((res) => res.json());

  const url = `https://news.ycombinator.com/item?id=${id}`;
  const { text, type, by: author } = data;
  const time = new Date(data.time * 1000);
  const isoTime = formatISO(time);
  const relativeTime = formatDistanceToNowStrict(time, { addSuffix: true });
  const isComment = type === "comment";
  const title =
    (isComment ? `Comment by ${author} ${relativeTime}` : data.title) +
    " | Hacker News";
  const snippet = isComment
    ? truncate(text)
    : [
        pluralize("vote", data.score, true),
        pluralize("comment", data.descendants, true),
        "posted " + relativeTime,
      ].join(" - ");

  return {
    url,
    text,
    type,
    author,
    time,
    isoTime,
    relativeTime,
    isComment,
    title,
    snippet,
  };
};
