import { formatDistanceToNowStrict, formatISO } from "date-fns";
import { convert } from "html-to-text";
import pluralize from "pluralize";

const truncate = (str = "", length = 160, ending = "…") => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  return str;
};

interface HNItem {
  id: number;
  title?: string;
  text?: string;
  type: string;
  by?: string;
  time: number;
  score?: number;
  descendants?: number;
}

export const getHNLinkInfo = async (
  id: string,
  truncateSnippetLength = 160,
) => {
  const res = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
  );
  const data = (await res.json()) as HNItem;

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
    ? truncate(convert(text || "", { wordwrap: false }), truncateSnippetLength)
    : [
        pluralize("vote", data.score || 0, true),
        pluralize("comment", data.descendants || 0, true),
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
