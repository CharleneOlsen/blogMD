export const SITE = {
  website: "https://alchemistsnotes.com/",
  author: "Charlene Olsen",
  profile: "https://charleneolsen.dev/",
  desc: "Alchemist's notes is a blog about the world, art, science and everything in between.",
  title: "Alchemist's notes",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 1000,
  postPerPage: 1000,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  listening: "If You Wait by London Grammar",
  reading: "Metro 2033 by Dmitry Glukhovsky",
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Europe/Prague", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
