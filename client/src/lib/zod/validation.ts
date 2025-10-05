/**
 * Validation class on top of Zod package
 */

import { ZodObject, ZodIntersection } from "zod";
import { type $ZodIssue, type $ZodAny, type $ZodShape } from "zod/v4/core"

// Define validation erroe type
type ValidationErrorType =  { [key: string]: string }

export class ZodValidation
{
    // Hold form fields validation errors
    private errors: ValidationErrorType = {};

    // Form fields values
    public values:any;

    /**
     * Validate form fields against a zod schema
     * 
     * @param data FormData object
     * @param schema validation schema
     * @returns boolean
     */
    public validate(data: FormData, schema: ZodObject<$ZodShape> | ZodIntersection<$ZodAny,$ZodAny>): boolean {

        // validate with Zod
        const validation = schema.safeParse(Object.fromEntries(data));
        
        this.values = validation.data;

        // If the validation fails, populate errors object
        if(validation.success === false) {

            const zodIssues: $ZodIssue[] = validation.error.issues;

            this.errors = {};

            zodIssues.forEach(err => {
                
                const field: string = err.path[0] as string
                this.errors[field] = err.message;

            })

        }   

        return validation.success;
    }

    /**
     * Get error object
     * 
     * @returns ValidationErrorType
     */
    public getErrors(): ValidationErrorType {
        
        return this.errors;

    }

}