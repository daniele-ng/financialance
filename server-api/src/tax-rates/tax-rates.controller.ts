import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiResponseDataType, ApiResponseType } from 'src/@types/api-response-type';
import { AuthGuard } from 'src/auth/auth.guard';
import { TaxRatesService } from './tax-rates.service';
import { TaxRate } from 'src/entities/tax-rate.entity';
import { sanitizeHtmlPipe } from 'src/lib/pipes/sanitize-html.pipe';
import { CreateTaxRateDto, UpdateTaxRateDto } from './tax-rates.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('api')
export class TaxRatesController {

    constructor(
        private taxRatesService: TaxRatesService
    ) { }

    /**
     * @method GET
     * @endpoint /api/tax-rates
     * 
     * Get a list of tax rates
     * 
     * @returns Promise<ApiResponseDataType>
     */
    @Get('tax-rates')
    async getTaxRates(): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as TaxRate }

        try {

            const taxRates: TaxRate[] = await this.taxRatesService.getTaxRates()

            response.success = true
            response.data = taxRates

        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method GET
     * @endpoint /api/tax-rate/:year
     * 
     * Get tax rate details
     * 
     * @param params route params. Tax rate year
     * @returns Promise<ApiResponseDataType>
     */
    @Get('tax-rate/:year')
    async getTaxRate(@Param() params: { year: number }): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as TaxRate }

        try {

            const taxrate: TaxRate | null = await this.taxRatesService.getTaxRate(params.year)

            response.success = true
            response.data = taxrate

        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method POST
     * @endpoint /api/tax-rate
     * 
     * Store a new tax rate in to the database
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @Post('tax-rate')
    @UseInterceptors(NoFilesInterceptor)
    async createTaxRate(@Body(new sanitizeHtmlPipe([])) data: CreateTaxRateDto): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.taxRatesService.create(data)

            response.success = true

        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method PUT
     * @endpoint /api/tax-rate
     * 
     * Update the data of a tax rate
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @Put('tax-rate')
    @UseInterceptors(NoFilesInterceptor)
    async updateTaxRate(@Body(new sanitizeHtmlPipe([])) data: UpdateTaxRateDto): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.taxRatesService.update(data)

            response.success = true

        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method DELETE
     * @endpoint /api/tax-rate
     * 
     * Delete a tax rate
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @Delete('tax-rate')
    @UseInterceptors(NoFilesInterceptor)
    async deleteTaxRate(@Body() data: { id: number }): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.taxRatesService.delete(data.id)

            response.success = true

        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

}
