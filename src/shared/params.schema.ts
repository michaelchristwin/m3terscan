import { z } from "zod";

export const paramsSchema = z.object({
  m3terId: z.coerce.number().int().positive(),
});

export const appSearchParamsSchema = z.object({
  thm: z.coerce.number().int().positive().optional(),
});
