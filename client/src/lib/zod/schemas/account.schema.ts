import z from "zod";

export const accountSchema = z.object({

    first_name: z.string({error: "Campo obbligatorio"})
        .min(1, {error: "Campo obbligatorio"})
        .max(100, {error: "Limite numero caratteri consentiti superato (max. 100)"}),

    last_name: z.string({error: "Campo obbligatorio"})
        .min(1, {error: "Campo obbligatorio"})
        .max(150, {error: "Limite numero caratteri consentiti superato (max. 150)"}),

    email: z.email({error: "Formato e-mail non valido"}),

    vat_number: z.string({error: "Campo obbligatorio"})
        .regex(/^[0-9]{11}$/, {error: "Formato campo non valido"}),

    pin: z.string({error: "Campo obbligatorio"})
        .regex(/^[0-9]{6}$/, {error: "Il codice PIN deve essere composto da 6 numeri"})   
})