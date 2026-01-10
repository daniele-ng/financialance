import { Body, Controller, Get, Param, Patch, Post, Put, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { InvoicesService } from './invoices.service';
import { ApiResponseDataType, ApiResponseType } from 'src/@types/api-response-type';
import { Invoice } from 'src/entities/invoice.entity';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { sanitizeHtmlPipe } from 'src/lib/pipes/sanitize-html.pipe';
import { CreateInvoiceDto, QueryInvoiceDto, UpdateInvoiceDto } from './invoices.dto';

@UseGuards(AuthGuard)
@Controller('api')
export class InvoicesController {

    constructor(
        private invoicesService: InvoicesService
    ) { }

    /**
     * @method GET
     * @endpoint /api/invoices
     * 
     * Get a list of invoices
     * 
     * @returns Promise<ApiResponseDataType>
     */
    @Get('invoices')    
    async getInvoices(@Query() query?: any): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as Invoice }

        try {

            const invoices: Invoice[] = await this.invoicesService.getInvoices(query as QueryInvoiceDto)

            response.success = true
            response.data = invoices

        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method GET
     * @endpoint /api/invoices/:year
     * 
     * Get invoices for a given year
     * 
     * @param params route params. Calendar year
     * @returns Promise<ApiResponseDataType>
     */
    @Get('invoices/:year')
    async getAnnualInvoices(@Param() params: { year: number }): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as Invoice}

        try {

            const invoices: Invoice[] = await this.invoicesService.getAnnualInvoices(params.year)

            response.success = true
            response.data = invoices

        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response
    }

    /**
     * @method GET
     * @endpoint /api/invoice/:id
     * 
     * Get invoice details
     * 
     * @param params route params. Invoice ID
     * @returns Promise<ApiResponseDataType>
     */
    @Get('invoice/:id')
    async getInvoice(@Param() params: { id: number }): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as Invoice }

        try {
            
            const invoice: Invoice | null = await this.invoicesService.getInvoice(params.id)

            response.success = true
            response.data = invoice

        }
        catch (err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method POST
     * @endpoint /api/invoice
     * 
     * Store new invoice data in to the database
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @Post('invoice')
    @UseInterceptors(NoFilesInterceptor)
    async createInvoice(@Body(new sanitizeHtmlPipe([])) data: CreateInvoiceDto, @Request() req: any): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            data.user = req.user

            await this.invoicesService.create(data)

            response.success = true

        }
        catch(err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method PUT
     * @endpoint /api/invoice
     * 
     * Update data of an invoice
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @Put('invoice')
    @UseInterceptors(NoFilesInterceptor)
    async updateInvoce(@Body(new sanitizeHtmlPipe([])) data: UpdateInvoiceDto): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.invoicesService.update(data)
            
            response.success = true

        }
        catch(err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method PATCH
     * @endpoint /api/invoice
     * 
     * Set an invoice as paid
     * 
     * @param data HTTP body request
     * @returns Promise<ApiResponseType>
     */
    @Patch('invoice')
    @UseInterceptors(NoFilesInterceptor)
    async setInvoiceAsPaid(@Body() data: { id: number } ): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.invoicesService.setAsPaid(data.id)
            
            response.success = true

        }
        catch(err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

}
