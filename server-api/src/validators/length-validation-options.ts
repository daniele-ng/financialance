import { ValidationOptions } from "class-validator";

/**
 * Validation mMessages for fields under the rule Length
 * 
 * @param fieldName field name
 * @param maxLength string max length
 * @returns 
 */
export const lengthValidationOptions = (fieldName: string, maxLength: number):ValidationOptions => {

    const options: ValidationOptions = {

        message(args) {

            const value = args.value as string | undefined

            if (typeof value == "undefined") return "The field " + fieldName + " is required";

            if (value.length == 0) return "The field " + fieldName + " is required";
            
            if (value.length > maxLength) return "The field " + fieldName + " is too long, maximal allowed length " + maxLength + " chars";

            return ""

        }

    }

    return options

}