import z from "zod";

export const invoiceSchema = z.object({

    code: z.string({error: "Campo obbligatorio"})
        .min(1, {error: "Campo obbligatorio"})
        .max(20, {error: "Limite numero caratteri consentiti superato (max. 20)"}),

    date: z.string({error: "Campo obbligatorio"})
        .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {error: "Formato data non valido"}),

    amount: z.string({error: "Campo obbligatorio"})
        .regex(/^\d*[.]{1}\d{2}$/, {error: "Formato non valido"}),

    company: z.string({error: "Campo obbligatorio"})
        .min(1, {error: "Campo obbligatorio"})
        .max(50, {error: "Limite numero caratteri consentiti superato (max. 50)"})
})