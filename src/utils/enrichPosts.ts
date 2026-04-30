import type { CollectionEntry } from "astro:content";
import getGitModifiedDate from "./getGitModifiedDate";

type EntryMap = import("astro:content").DataEntryMap;

export const enrichPost = async <T extends keyof EntryMap>(
  post: CollectionEntry<T>
): Promise<CollectionEntry<T>> => {
  const gitDate = getGitModifiedDate((post as any).filePath);
  const modDatetime = (post as any).data?.modDatetime ?? gitDate ?? null;

  const newPost = {
    ...(post as any),
    data: {
      ...(post as any).data,
      modDatetime,
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
