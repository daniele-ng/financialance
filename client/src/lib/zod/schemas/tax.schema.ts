import z from "zod";

export const taxSchema = z.object({

    revenue: z.number({error: "Campo obbligatorio"})
        .gte(0, {error: "Il campo richiede un valore compreso tra lo 0 e 100"})
        .and(z.number().lte(100, {error: "Il campo richiede un valore compreso tra lo 0 e 100"})),

    tax: z.number({error: "Campo obbligatorio"})
        .gte(0, {error: "Il campo richiede un valore compreso tra lo 0 e 100"})
        .and(z.number().lte(100, {error: "Il campo richiede un valore compreso tra lo 0 e 100"})),

    inps: z.number({error: "Campo obbligatorio"})
        .gte(0, {error: "Il campo richiede un valore compreso tra lo 0 e 100"})
        .and(z.number().lte(100, {error: "Il campo richiede un valore compreso tra lo 0 e 100"})),

    advanceTaxPayment: z.number({error: "Campo obbligatorio"})
        .gte(0, {error: "Il campo richiede un valore compreso tra lo 0 e 100"})
        .and(z.number().lte(100, {error: "Il campo richiede un valore compreso tra lo 0 e 100"})),

    year: z.number({error: "Campo obbligatorio"})
        .gte(1900, {error: "Formato anno non valido"})
})