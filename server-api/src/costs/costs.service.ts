import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cost } from "src/entities/cost.entity";
import { DeleteResult, FindOptionsOrder, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { CreateCostDto, QueryCostDto, UpdateCostDto } from "./costs.dto";

@Injectable()
export class CostsService {

    constructor(
        @InjectRepository(Cost)
        private costRepository: Repository<Cost>
    ){}

    /**
     * Return a list of costs
     * 
     * @param params query params
     * @returns Promise<Cost[]>
     */
    getCosts(params?: QueryCostDto): Promise<Cost[]> {

        let sort: FindOptionsOrder<Cost> = { date: "DESC" }        
        let where: FindOptionsWhere<Cost> | undefined = undefined

        if (params?.sort && params?.sort_direction) {

            sort = { [params.sort] : params.sort_direction }
        }

        if (params?.year) {

            where = { year: params?.year }
        }

        return this.costRepository.find({
            where: where,
            order: sort,
            take: params?.limit
        })
    }

    /**
     * Get cost details
     * 
     * @param id cost ID
     * @returns Promise<Cost | null>
     */
    getCost(id: number): Promise<Cost | null> {

        return this.costRepository.findOneBy({ id: id })
    }

    /**
     * Create a new cost
     * 
     * @param data dto with the fields to add a new cost
     * @returns Promise<Cost>
     */
    create(data: CreateCostDto): Promise<Cost> {
        
        const dateArray: string[] = data.date.split("-")
        
        const costEntity: Cost = this.costRepository.create({
            title: data.title,
            date: data.date,
            amount: data.amount,
            month: parseInt(dateArray[1]),
            year: parseInt(dateArray[0]),
            note: data.note
        })

        return this.costRepository.save(costEntity)
    }    

    /**
     * Update a cost
     *
     * @param data dto the fields to update a cost
     * @returns Promise<UpdateResult>
     */
    update(data: UpdateCostDto): Promise<UpdateResult> {

        const dateArray: string[] = data.date.split("-")

        return this.costRepository.update(
            { id: data.id },
            {
                title: data.title,
                date: data.date,
                amount: data.amount,
                month: parseInt(dateArray[1]),
                year: parseInt(dateArray[0]),
                note: data.note
            }
        )
    }

    /**
     * Delete a cost
     * 
     * @param id cost ID
     * @returns Promise<DeleteResult>
     */
    delete(id: number): Promise<DeleteResult> {

        return this.costRepository.delete({ id: id })
    }
}