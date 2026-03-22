import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { CostsService } from "./costs.service";
import { ApiResponseDataType, ApiResponseType } from "src/@types/api-response-type";
import { Cost } from "src/entities/cost.entity";
import { CreateCostDto, QueryCostDto, UpdateCostDto } from "./costs.dto";
import { NoFilesInterceptor } from "@nestjs/platform-express";
import { sanitizeHtmlPipe } from "src/lib/pipes/sanitize-html.pipe";

@UseGuards(AuthGuard)
@Controller('api')
export class CostsController {

    constructor(
        private costsService: CostsService
    ){ }

    /**
     * @method GET
     * @endpoint /api/costs
     * 
     * Get a list of costs
     * 
     * @param query query params
     * @returns Promise<ApiResponseDataType>
     */
    @Get('costs')
    async getCosts(@Query() query?: any): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as Cost}

        try {

            const costs: Cost[] = await this.costsService.getCosts(query as QueryCostDto)

            response.success = true
            response.data = costs
        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response
    }

    /**
     * @method GET
     * @endpoint /api/cost/:id
     * 
     * Get cost details
     * 
     * @param params route params. Cost ID
     * @returns Promise<ApiResponseDataType>
     */
    @Get('cost/:id')
    async getCost(@Param() params: { id: number }): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as Cost}

        try {

            const cost: Cost | null = await this.costsService.getCost(params.id)

            response.success = true
            response.data = cost
        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response
    }

    /**
     * @method POST
     * @endpoint /api/cost
     * 
     * Store new cost data
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @Post('cost')
    @UseInterceptors(NoFilesInterceptor)
    async createCost(@Body(new sanitizeHtmlPipe([])) data: CreateCostDto): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.costsService.create(data)

            response.success = true
        }
        catch (err) {

            response.error = "Errore server: " + err.message
        }

        return response
    }

    /**
     * @method PUT
     * @endpoint /api/cost
     * 
     * Update cost data
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @Put('cost')
    @UseInterceptors(NoFilesInterceptor)
    async updateCost(@Body(new sanitizeHtmlPipe([])) data: UpdateCostDto): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.costsService.update(data)

            response.success = true
        }
        catch (err) {

            response.error = "Errore server: " + err.message
        }

        return response
    }

    /**
     * @method DELETE
     * @endpoint /api/cost
     * 
     * Delete a cost
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @Delete('cost')
    @UseInterceptors(NoFilesInterceptor)
    async deleteCost(@Body() data: { id: number }): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.costsService.delete(data.id)

            response.success = true

        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response
    }
}