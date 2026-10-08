// Сгенерировано из apps/web/content.schema.ts продукта; вручную не редактировать.
import { property } from "@nuxt/content";
import {
  defineOgImageSchema,
  defineRobotsSchema,
  defineSchemaOrgSchema,
  defineSitemapSchema,
} from "@nuxtjs/seo/content";
import { z } from "zod/v4";

const nuxtSeoFields = {
  robots: defineRobotsSchema({ z }),
  sitemap: defineSitemapSchema({ z }),
  ogImage: defineOgImageSchema({ z }),
  schemaOrg: defineSchemaOrgSchema({ z }),
};

const documentationSchema = z.object({
  ...nuxtSeoFields,
  title: property(z.string().min(1).max(120)).editor({
    label: "Заголовок",
    description: "Короткий заголовок страницы в навигации и поиске.",
  }),
  description: property(z.string().min(1).max(240)).editor({
    input: "textarea",
    label: "Описание",
    description: "Самодостаточное описание для поиска и SEO.",
  }),
  category: property(
    z.enum(["overview", "getting-started", "clients", "security", "troubleshooting", "reference"]),
  ).editor({ label: "Раздел" }),
  order: property(z.number().int().min(0).max(10_000)).editor({ label: "Порядок" }),
  audience: property(z.enum(["developer", "administrator"]).default("developer")).editor({ label: "Аудитория" }),
  generated: property(z.boolean().default(false)).editor({
    label: "Сгенерировано",
    description: "Generated-страницы изменяются только через typed registry.",
  }),
  landing: property(
    z
      .object({
        heading: z.string().min(1),
        actions: z
          .array(
            z.object({
              title: z.string().min(1),
              description: z.string().min(1),
              outcome: z.string().min(1),
              to: z.string().startsWith("/"),
            }),
          )
          .length(3),
      })
      .optional(),
  ).editor({ label: "Стартовый экран" }),
  rawbody: z.string(),
});

const publicPageSchema = z.object({
  ...nuxtSeoFields,
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(240),
  category: property(z.enum(["landing", "pricing", "legal"])).editor({ label: "Тип страницы" }),
  socialImageAlt: property(z.string().max(180).optional()).editor({
    label: "Alt для social image",
    description: "Описание общей OG-картинки для accessibility.",
  }),
  rawbody: z.string(),
});

const marketingCopySchema = z.object({
  navModels: z.string(),
  navApi: z.string(),
  earlyAccess: z.string(),
  badge: z.string(),
  title: z.string(),
  description: property(z.string()).editor({ input: "textarea" }),
  composerPlaceholder: z.string(),
  composerSubmit: z.string(),
  composerAfterLogin: z.string(),
  composerHint: z.string(),
  examplesLabel: z.string(),
  examples: z.array(z.string()).min(1),
  pillarsTitle: z.string(),
  pillarsDescription: z.string(),
  directTitle: z.string(),
  directBody: property(z.string()).editor({ input: "textarea" }),
  valueTitle: z.string(),
  valueBody: property(z.string()).editor({ input: "textarea" }),
  accessTitle: z.string(),
  accessBody: property(z.string()).editor({ input: "textarea" }),
  modelsTitle: z.string(),
  modelsDescription: property(z.string()).editor({ input: "textarea" }),
  modelsColumnModel: z.string(),
  modelsColumnRate: z.string(),
  modelsJailbreak: z.string(),
  modelsWebSearch: z.string(),
  modelsEmpty: z.string(),
  apiTitle: z.string(),
  apiDescription: property(z.string()).editor({ input: "textarea" }),
  apiCta: z.string(),
  apiCopy: z.string(),
  apiCopied: z.string(),
  finalTitle: z.string(),
  finalDescription: z.string(),
  newChat: z.string(),
  privacy: z.string(),
  terms: z.string(),
  contact: z.string(),
  copyright: z.string(),
});

const faqCopySchema = z.object({
  title: z.string(),
  items: z
    .array(
      z.object({
        question: z.string(),
        answer: property(z.string()).editor({ input: "textarea" }),
      }),
    )
    .min(1),
});

const pricingCopySchema = z.object({
  badge: z.string(),
  heading: z.string(),
  description: property(z.string()).editor({ input: "textarea" }),
  perMonth: z.string(),
  customVolume: z.string(),
  official: z.string(),
  limitsRefresh: z.string(),
  jailbreak: z.string(),
  jailbreakPrevious: z.string(),
  webSearch: z.string(),
  topUpDiscount: z.string(),
  limits: z.string(),
  recommended: z.string(),
  volume: z.string(),
  cta: z.string(),
  ctaCustom: z.string(),
  byContract: z.string(),
  featuresLabel: z.string(),
  plans: z.object({
    bachelor: z.object({ name: z.string(), description: z.string() }),
    master: z.object({ name: z.string(), description: z.string() }),
    professor: z.object({ name: z.string(), description: z.string() }),
  }),
  topUpDescription: property(z.string()).editor({ input: "textarea" }),
  empty: z.string(),
  earlyAccessNote: property(z.string()).editor({ input: "textarea" }),
  calcTitle: z.string(),
  calcDescription: z.string(),
  calcAmount: z.string(),
  calcPerMonth: z.string(),
  calcMarks: z.string(),
  calcMarkMultiplier: z.string(),
  calcMarkLabel: z.string(),
  calcSliderValue: z.string(),
  calcStatEquivalent: z.string(),
  calcStatEquivalentValue: z.string(),
  calcStatSavings: z.string(),
  calcStatSavingsValue: z.string(),
  calcVip: z.string(),
  calcVolumeLine: z.string(),
  calcCreditsLine: z.string(),
  calcNextTier: z.string(),
  calcTopLevel: z.string(),
  calcCondition: property(z.string()).editor({ input: "textarea" }),
  calcColumnModel: z.string(),
  calcColumnOfficial: z.string(),
  calcColumnOurs: z.string(),
  calcColumnVolume: z.string(),
  calcDiscount: z.string(),
  calcDiscountLabel: z.string(),
  calcTokens: z.string(),
  calcNote: property(z.string()).editor({ input: "textarea" }),
});

const siteCopySchema = z.object({
  marketing: marketingCopySchema,
  faq: faqCopySchema,
  pricing: pricingCopySchema,
});

export const contentSchemas = {
  documentation: documentationSchema,
  marketing: publicPageSchema,
  site: siteCopySchema,
};
