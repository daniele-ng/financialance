/**
 * Override default exception thrown by the ValidationPipe when data validation fails
 */

import { ValidationError, UnprocessableEntityException } from "@nestjs/common";

/**
 * Throw UnprocessableEntityException HTTP_CODE = 422
 * In the response body return an object of invalid fields that didn't pass the validation
 * 
 * @param errors contains the entity that didn't the validation
 */
export const validationExceptionFactory = (errors: ValidationError[]) => {

    // The key is the field name and its value is the error message returned by the validation rules
    let errorFields: { [key:string]: string[] } = {};

    // Define response object
    let response = {
        message: "Validation has failed",
        errors: {},
        error: 'Unprocessable Entity',
        statusCode: 422
    }

    // Loop the errors array
    for(const error of errors) {

        if (typeof error.constraints != "undefined") {
            
            errorFields[error.property] = Object.values(error.constraints)

        }

    }

    response.errors = errorFields;

    throw new UnprocessableEntityException(response);

}