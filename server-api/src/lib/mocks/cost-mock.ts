import { CreateCostDto, UpdateCostDto } from "src/costs/costs.dto";
import { Cost } from "src/entities/cost.entity";

export const mockCost: Cost = {
    id: 1,
    title: "Item 1",
    date: new Date(),
    month: 8,
    year: 2025,
    amount: 80.00,
    note: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    localizeAmount: function (): void {
        throw new Error("Function not implemented.");
    },
    amount_it: "80,00"
}

export const mockCreateCostDto: CreateCostDto = {
    title: "Item 2",
    amount: 15.00,
    date: new Date().toLocaleDateString('lt-LT')    
}

export const mockUpdateCostDto: UpdateCostDto = {
    id: mockCost.id,
    title: "Item 2",
    amount: 25.00,
    date: new Date().toLocaleDateString('lt-LT'),
    note: "Some note"
}