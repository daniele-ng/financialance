/**
 * Custom validation rule
 * Check if an entity exists on the database
 */

import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import AppDataSource from "src/database/data-source";
import AppDataSourceTest from "src/database/data-source-test";
import { DataSource } from "typeorm";

/**
 * Return true if the entity exists on the database
 * The check is performed via id
 */
@ValidatorConstraint({ name: "EntityExists", async: true })
@Injectable()
export class EntityExistsConstranint implements ValidatorConstraintInterface {

    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {                

        const table = validationArguments?.constraints[0]

        let dataSource: DataSource;

        if (process.env.NODE_ENV == "test") {

            dataSource = AppDataSourceTest.isInitialized ? AppDataSourceTest : await AppDataSourceTest.initialize()          

        }
        else {

            dataSource = AppDataSource.isInitialized  ? AppDataSource : await AppDataSource.initialize()

        }

        const result: [{ counter: number }] = await dataSource.query("select count(id) as counter from " + table + " where id = ?", [value])        

        return result[0].counter == 1

    }

}

/**
 * Register a decorator for the rule
 * 
 * @param table name of the table where to check
 * @param validationOptions 
 * @returns 
 */
export function EntityExists(table: string, validationOptions?: ValidationOptions) {

    return function(object: Object, propertyName: string) {

        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [table],
            validator: EntityExistsConstranint
        })

    }

}