import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response("", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const now = new Date().toISOString();
  const pages = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/servicos/", changefreq: "weekly", priority: "0.9" },
    { path: "/servicos/lavagem-alcatifas/", changefreq: "monthly", priority: "0.8" },
    { path: "/servicos/higienizacao-cadeiras/", changefreq: "monthly", priority: "0.8" },
  ].map((page) => ({
    loc: new URL(page.path, site).toString(),
    lastmod: now,
    changefreq: page.changefreq,
    priority: page.priority,
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>\n    <loc>${page.loc}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
