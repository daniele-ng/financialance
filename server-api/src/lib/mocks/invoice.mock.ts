// Define mock invoices for tests

import { Invoice } from "src/entities/invoice.entity";
import mockUser from "./user-mock";
import { CreateInvoiceDto, UpdateInvoiceDto } from "src/invoices/invoices.dto";

export const mockInvoice1: Invoice = {
    id: 1,
    code: "1/2025",
    date: new Date(),
    month: 8,
    year: 2025,
    amount: 80.00,
    paid: 0,
    company: "test",
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
    localizeAmount: function (): void {
        throw new Error("Function not implemented.");
    },
    amount_it: "80,00"
}

export const mockInvoice2: Invoice = {
    id: 2,
    code: "2/2025",
    date: new Date(),
    month: 8,
    year: 2025,
    amount: 100.00,
    paid: 0,
    company: "test",
    user: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
    localizeAmount: function (): void {
        throw new Error("Function not implemented.");
    },
    amount_it: "100,00"
}

export const mockCreateInvoiceDto: CreateInvoiceDto = {
    code: "3/2025",
    amount: 60.00,
    date: new Date().toLocaleDateString('lt-LT'),
    company: "test",
    user: mockUser
}

export const mockUpdateInvoiceDto: UpdateInvoiceDto = {
    id: mockInvoice1.id,
    code: "3/2025",
    amount: 70.00,
    company: "test",
    date: new Date().toLocaleDateString('lt-LT'),
}