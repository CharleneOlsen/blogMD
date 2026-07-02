import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import enrichPosts from "@/utils/enrichPosts";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function GET() {
  const rawPosts = await getCollection("blog");
  const posts = await enrichPosts(rawPosts);
  const poems = await getCollection("poetry");

  const blogItems = getSortedPosts(posts).map(({ data, id, filePath, rendered }) => {
    const link = getPath(id, filePath);
    const fullUrl = new URL(link, SITE.website).toString();

    return {
      link,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      content: `<p><em>Read the original at <a href="${fullUrl}">${fullUrl}</a></em></p>${rendered?.html ?? ""}`,
    };
  });

  const poetryItems = poems.map(({ data, id, rendered }) => {
    const slug = data.slug ?? id.replace(/\.md$/, "");
    const link = `/posts/scriptorium/poetry/${slug}`;
    const fullUrl = new URL(link, SITE.website).toString();

    return {
      link,
      title: data.title,
      description: data.description ?? "",
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      content: `<p><em>Read the original at <a href="${fullUrl}">${fullUrl}</a></em></p>${rendered?.html ?? ""}`,
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