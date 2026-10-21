export const pageHead = (title: string, description: string) => () => ({
  meta: [
    { title: `${title} — SiteGuard OS` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — SiteGuard OS` },
    { property: "og:description", content: description },
  ],
});
