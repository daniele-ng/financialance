import z from "zod";

export const loginSchema = z.object({

    pin: z.string({error: "Campo obbligatorio"})
        .min(1, {error: "Campo obbligatorio"})
        .max(6, {error: "Il codice può contere al max. 6 cifre"})        
})