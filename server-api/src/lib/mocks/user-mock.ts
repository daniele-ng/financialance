// Define a mock user for tests

import { User } from "src/entities/user.entity";
import { CreateUserDto, UpdateUserDto, UpdatePinUserDto } from "src/users/users.dto";

const mockUser: User = {
    id: 1,
    firstName: "Mock",
    lastName: "Mock",
    email: "mock@inv.inv",
    pin: "111111",
    address: null,
    city: "randomcity1",
    vatNumber: "12345678902",
    tokens: [],
    invoices: [],
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const mockUser2: User = {
    id: 2,
    firstName: "Mock2",
    lastName: "Mock2",
    email: "mock2@inv.inv",
    pin: "222222",
    address: "street random 20",
    city: "randomcity2",
    vatNumber: "12345678901",
    tokens: [],
    invoices: [],
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const mockCreateUserDto: CreateUserDto = {
    first_name: mockUser.firstName,
    last_name: mockUser.lastName,
    email: mockUser.email,
    pin: mockUser.pin,
    vat_number: mockUser.vatNumber
}

export const mockUpdateUserDto: UpdateUserDto = {
    id: mockUser.id,
    first_name: mockUser.firstName,
    last_name: mockUser.lastName,
    email: mockUser.email,
    vat_number: mockUser.vatNumber
}

export const mockUpdatePinUserDto: UpdatePinUserDto = {
    id: mockUser.id,
    pin: "333333"
}

export default mockUser