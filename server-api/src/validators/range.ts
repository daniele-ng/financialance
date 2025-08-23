/**
 * Custom validation rule. Check if the field value is in a numeric range
 */

import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

/**
 * Return true if the field value between min and max
 */
@ValidatorConstraint({ name: "range", async: false })
export class RangeConstraint implements ValidatorConstraintInterface {

    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        
        const min: number = validationArguments?.constraints[0]
        const max: number = validationArguments?.constraints[1]

        return value >= min && value <= max

    }

}

/**
 * Register a decorator for the rule
 * 
 * @param param0 {min:number, max:number} min and max limits of the range
 * @param validationOptions 
 * @returns 
 */
export function Range({ min, max }: {min: number, max: number}, validationOptions?: ValidationOptions) {

    return function(object: Object, propertyName: string) {

        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [min, max],
            validator: RangeConstraint
        })

    }

}