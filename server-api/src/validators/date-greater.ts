/**
 * Compare two dates
 */

import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

/**
 * Define validator constraint.
 * Check if the value of the field is greater than another
 */
@ValidatorConstraint({ name: "dateGreater", async: false })
export class DateGreaterConstraint implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments): Promise<boolean> | boolean {            

        const dateA: Date = new Date(value)

        const [relatedPropertyName] = args.constraints

        const dateToCompareStr: string = (args.object as any)[relatedPropertyName]

        const dateToCompare: Date = new Date(dateToCompareStr)        

        return dateA.getTime() > dateToCompare.getTime()
        
    }

}

/**
 * Register decorator for the rule
 * 
 * @param relatedProperty field name, which value must be compare to
 * @param validationOptions 
 * @returns 
 */
export function DateGreater(relatedProperty: string, validationOptions?: ValidationOptions) {

    return function(object: Object, propertyName: string) {

        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [relatedProperty],
            validator: DateGreaterConstraint
        })

    }

}