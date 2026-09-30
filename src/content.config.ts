import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const projectCategorySlugs = ['residential', 'cultural', 'interiors'] as const;

const localizedStringSchema = z.object({
  ru: z.string(),
  en: z.string(),
});

const imageSchema = z.object({
  src: z.string(),
  alt: localizedStringSchema,
});

const sectionSchema = z.object({
  label: localizedStringSchema,
  heading: localizedStringSchema,
  body: localizedStringSchema,
});

const settings = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/settings' }),
  schema: z.object({
    studioName: z.string(),
    logo: imageSchema,
    navigation: z.object({
      home: localizedStringSchema,
      projects: localizedStringSchema,
      about: localizedStringSchema,
      services: localizedStringSchema,
      contact: localizedStringSchema,
    }),
    footerText: localizedStringSchema,
    localeLabels: z.object({
      ru: localizedStringSchema,
      en: localizedStringSchema,
    }),
    defaultSeo: z.object({
      title: localizedStringSchema,
      description: localizedStringSchema,
    }),
    contact: z.object({
      email: z.string(),
      phone: z.string(),
      address: localizedStringSchema,
      mapUrl: z.string().url(),
    }),
    socialLinks: z.array(
      z.object({
        label: localizedStringSchema,
        url: z.string().url(),
      }),
    ),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/pages' }),
  schema: z.discriminatedUnion('id', [
    z.object({
      id: z.literal('home'),
      headline: localizedStringSchema,
      intro: localizedStringSchema,
      featuredProjectSlugs: z.array(z.string()).min(1),
      aboutPreview: localizedStringSchema.partial().optional(),
      servicesPreview: localizedStringSchema.partial().optional(),
      contactCta: z.object({
        heading: localizedStringSchema,
        body: localizedStringSchema,
        label: localizedStringSchema,
      }),
    }),
    z.object({
      id: z.literal('about'),
      title: localizedStringSchema,
      biography: localizedStringSchema,
      approach: localizedStringSchema,
      credentials: localizedStringSchema,
      portrait: imageSchema,
    }),
    z.object({
      id: z.literal('services'),
      title: localizedStringSchema,
      intro: localizedStringSchema,
      items: z.array(localizedStringSchema).min(1),
      cta: localizedStringSchema,
    }),
    z.object({
      id: z.literal('contact'),
      heading: localizedStringSchema,
      intro: localizedStringSchema,
      email: z.string(),
      phone: z.string(),
      address: localizedStringSchema,
      mapUrl: z.string().url(),
      socialLinks: z.array(
        z.object({
          label: localizedStringSchema,
          url: z.string().url(),
        }),
      ),
      formHelper: localizedStringSchema,
      formLabels: z.object({
        name: localizedStringSchema,
        email: localizedStringSchema,
        message: localizedStringSchema,
        submit: localizedStringSchema,
      }),
      formMessages: z.object({
        required: localizedStringSchema,
        invalidEmail: localizedStringSchema,
        success: localizedStringSchema,
        error: localizedStringSchema,
        sending: localizedStringSchema,
      }),
    }),
  ]),
});

const taxonomy = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/taxonomy' }),
  schema: z.object({
    categories: z.array(
      z.object({
        slug: z.string(),
        label: localizedStringSchema,
      }),
    ),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string(),
    category: z.enum(projectCategorySlugs),
    year: z.number().int().optional(),
    location: localizedStringSchema.optional(),
    status: localizedStringSchema.optional(),
    featured: z.boolean(),
    order: z.number().int(),
    title: localizedStringSchema,
    summary: localizedStringSchema,
    cover: imageSchema,
    gallery: z.array(imageSchema).min(1),
    sections: z.array(sectionSchema).min(1),
  }),
});

export const collections = {
  settings,
  pages,
  taxonomy,
  projects,
};
