import { defineCollection, z } from 'astro:content';

const apps = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    author: z.string(),
    description: z.string().max(280),
    dateLaunched: z.string().transform((str) => new Date(str)),
    image: image(),
    platforms: z.array(
      z.object({
        name: z.enum(['Android', 'iOS', 'Web', 'macOS', 'Windows', 'Linux']),
        url: z.string().url(),
        downloads: z.number().optional(),
        views: z.number().optional(),
      })
    ).min(1),
  }),
});

export const collections = {
  apps,
};
