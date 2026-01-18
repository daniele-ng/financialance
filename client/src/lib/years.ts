export const currentYear = new Date().getFullYear()

export const years: { [key: string]: string }[] = []

for (let index = 2025; index <= currentYear; index++) {
    
    const value: string = index.toString()

    years.push({ key: value, label: value })
}