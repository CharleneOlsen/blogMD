import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function GET() {
  const posts = await getCollection("blog");
  const poems = await getCollection("poetry");

  const blogItems = getSortedPosts(posts).map(({ data, id, filePath }) => ({
    link: getPath(id, filePath),
    title: data.title,
    description: data.description,
    pubDate: new Date(data.modDatetime ?? data.pubDatetime),
  }));

  const poetryItems = poems.map(({ data, id }) => {
    const slug = data.slug ?? id.replace(/\.md$/, "");
    return {
      link: `/poetry/${slug}`,
      title: data.title,
      description: data.description ?? "",
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    };
  });

  const items = [...blogItems, ...poetryItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
  );

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items,
  });
}
