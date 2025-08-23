/**
 * Custom validation rule. 
 * Check if a user with the same e-mail is already registered
 */

import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";


/**
 * Define validator constraint.
 * Find user by email
 */

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {

    constructor(
        private readonly usersService: UsersService
    ) {}
        
    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
                
        const user = await this.usersService.getUserByEmail(validationArguments?.value);

        if (user == null) return true

        const id = (validationArguments?.object as any)["id"]        

        // Prevent false flag when we are updating user's data
        if ( typeof id != "undefined") {

            if (user.id == id) return true

        }        

        return false

    }

}

/**
 * Register decorator for the rule
 * 
 * @param validationOptions validation options
 * @returns 
 */
export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    
    return function(object: Object, propertyName: string) {

        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint
        })

    }
}