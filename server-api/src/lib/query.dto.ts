/**
 * Data transfer object definitions
 */

import { FindOptionsOrderValue } from "typeorm"

// Common dto class for query params
export class QueryDto<T> {

    // field name to sort results
    sort?: keyof T

    // sort direction
    sort_direction?: FindOptionsOrderValue

    // limit results
    limit?: number

}