import type { CollectionEntry } from "astro:content";
import getGitModifiedDate from "./getGitModifiedDate";

type EntryMap = import("astro:content").DataEntryMap;

export const enrichPost = async <T extends keyof EntryMap>(
  post: CollectionEntry<T>
): Promise<CollectionEntry<T>> => {
  type PostLike = { filePath?: string; data?: Record<string, unknown> };
  const p = post as unknown as PostLike;

  const gitDate = getGitModifiedDate(p.filePath);
  const rawModDatetime = p.data?.modDatetime ?? gitDate ?? null;

  function parseDateZeroUTC(value: unknown): Date | null {
    if (value === null || value === undefined) return null;
    let d: Date;
    if (value instanceof Date) d = new Date(value.getTime());
    else d = new Date(String(value));
    if (Number.isNaN(d.getTime())) return null;
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  const parsedDate = parseDateZeroUTC(rawModDatetime);
  const modDatetime = parsedDate;
  const modDate = parsedDate ? parsedDate.toISOString().slice(0, 10) : null;

  const newPost = {
    ...(post as unknown as Record<string, unknown>),
    data: {
      ...((post as unknown as { data?: Record<string, unknown> }).data ?? {}),
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
