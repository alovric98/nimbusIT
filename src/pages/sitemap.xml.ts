import type { APIRoute } from 'astro';
import { locales, pages, routes, site } from '../data/site';

// Legal drafts are omitted. Every page remains noindex during review.
export const GET: APIRoute = () => {
  const entries = locales.flatMap(lang => pages.filter(page => page !== 'imprint' && page !== 'privacy').map(page => {
    const alternates = [...locales.map(locale => `<xhtml:link rel="alternate" hreflang="${locale}" href="${site}${routes[locale][page]}"/>`), `<xhtml:link rel="alternate" hreflang="x-default" href="${site}${routes.de[page]}"/>`].join('');
    return `<url><loc>${site}${routes[lang][page]}</loc>${alternates}</url>`;
  })).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
