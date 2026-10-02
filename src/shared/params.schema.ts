import { z } from "zod";

export const paramsSchema = z.object({
  m3terId: z.coerce.number().int().positive(),
});
