import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto, UpdatePinUserDto, UpdateUserDto } from './users.dto';
import HashPassword from 'src/lib/bcrypt/hash-password';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    /**
     * Get the user details.
     * 
     * Multiusers enviroments is not supported yet.
     * 
     * @param showPin include the field "pin" in the results
     * @returns Promise<User | null>
     */
    async getUser(showPin: boolean = false): Promise<User | null> {

        const users: User[] = await this.userRepository.find({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                address: true,
                city: true,
                vatNumber: true,
                pin: showPin
            },
            order: { id: "DESC" },
            take: 1
        })

        if (users.length == 1) return users[0]

        return null
    }

    /**
     * Get user's details by email
     * 
     * @param email user's email
     * @param showPin include the field "pin" in the results
     * @returns Promise<User | null>
     */
    getUserByEmail(email: string, showPin: boolean = false): Promise<User | null> {

        return this.userRepository.findOne({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                address: true,
                city: true,
                vatNumber: true,
                pin: showPin
            },
            where: { email: email }
        })
    }

    /**
     * Create a new user
     * 
     * @param data dto with required fields to create a new user
     * @returns Promise<User>
     */
    async create(data: CreateUserDto): Promise<User> {

        const hashPin = await HashPassword(data.pin)

        const userEntity: User = this.userRepository.create({
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            pin: hashPin,
            vatNumber: data.vat_number,
            address: data.address ? data.address : null,
            city: data.city ? data.city : null
        })        

        return this.userRepository.save(userEntity)
    }

    /**
     * Update an user
     * 
     * @param data dto with required field to update a user
     * @returns Promise<UpdateResult>
     */
    update(data: UpdateUserDto): Promise<UpdateResult> {

        return this.userRepository.update(
            { id: data.id },
            {
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,            
                vatNumber: data.vat_number,
                address: data.address ? data.address : null,
                city: data.city ? data.city : null
            }
        )
    }

    /**
     * Update user's pin
     * 
     * @param data dto with required field to update user's pin
     * @returns Promise<UpdateResult>
     */
    async setNewPin(data: UpdatePinUserDto): Promise<UpdateResult> {

        const hashPin = await HashPassword(data.pin)

        return this.userRepository.update(
            { id: data.id },
            { pin: hashPin }
        )

    }
}
