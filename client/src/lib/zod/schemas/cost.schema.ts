import z from "zod";

export const costSchema = z.object({

    title: z.string({error: "Campo obbligatorio"})
        .min(1, {error: "Campo obbligatorio"})
        .max(100, {error: "Limite numero caratteri consentiti superato (max. 100)"}),

    date: z.string({error: "Campo obbligatorio"})
        .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {error: "Formato data non valido"}),

    amount: z.string({error: "Campo obbligatorio"})
        .regex(/^\d*[.]{1}\d{2}$/, {error: "Formato non valido"}),

    note: z.string()        
        .max(255, {error: "Limite numero caratteri consentiti superato (max. 255)"})
        .nullable()
})