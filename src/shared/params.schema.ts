import { z } from "zod";

export const paramsSchema = z.object({
  m3terId: z.coerce.number().int().positive(),
});

export const appSearchParamsSchema = z.object({
  thm: z.coerce.number().int().positive().optional(),
});

export const IFRAME_SEARCH = {
  BarCharts: z.object({
    m3terId: z.coerce.number().int().positive(),
    colorHigh: z.string().optional(),
    colorLow: z.string().optional(),
    colorScheme: z.enum(["dark", "light"]).default("light"),
    dark: z.string().optional(),
  }),
  Activities: z.object({
    colorScheme: z.enum(["dark", "light"]).default("light"),
    m3terId: z.coerce.number().int().positive(),
    dark: z.string().optional(),
    even: z.string().optional(),
    odd: z.string().optional(),
  }),
};
