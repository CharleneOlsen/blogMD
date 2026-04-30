import type { CollectionEntry } from "astro:content";
import getGitModifiedDate from "./getGitModifiedDate";

type EntryMap = import("astro:content").DataEntryMap;

export const enrichPost = async <T extends keyof EntryMap>(
  post: CollectionEntry<T>
): Promise<CollectionEntry<T>> => {
  const gitDate = getGitModifiedDate((post as any).filePath);
  const rawModDatetime = (post as any).data?.modDatetime ?? gitDate ?? null;

  function parseDateZeroUTC(value: unknown): Date | null {
    if (value === null || value === undefined) return null;
    const d = new Date(value as any);
    if (Number.isNaN(d.getTime())) return null;
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  const parsedDate = parseDateZeroUTC(rawModDatetime);
  const modDatetime = parsedDate;
  const modDate = parsedDate ? parsedDate.toISOString().slice(0, 10) : null;

  const newPost = {
    ...(post as any),
      data: {
      ...(post as any).data,
      modDatetime,
      modDate,
    },
  } as CollectionEntry<T>;

  return newPost;
};

export function enrichPosts(posts: CollectionEntry<"blog">[]): Promise<CollectionEntry<"blog">[]>;
export function enrichPosts<T extends keyof EntryMap>(
  posts: CollectionEntry<T>[]
): Promise<CollectionEntry<T>[]>;
export async function enrichPosts<T extends keyof EntryMap>(
  posts: CollectionEntry<T>[]
): Promise<CollectionEntry<T>[]> {
  return Promise.all(posts.map(p => enrichPost<T>(p)));
}

export default enrichPosts;
