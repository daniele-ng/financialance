import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FinancialStatementsService } from './financial-statements.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiResponseDataType } from 'src/@types/api-response-type';
import { DataFinancialStatement } from 'src/@types/financial-statement-type';
import { sanitizeHtmlPipe } from 'src/lib/pipes/sanitize-html.pipe';
import { TaxRatesService } from 'src/tax-rates/tax-rates.service';
import { TaxRate } from 'src/entities/tax-rate.entity';

@UseGuards(AuthGuard)
@Controller('api')
export class FinancialStatementsController {

    constructor(
        private financialStmtsServices: FinancialStatementsService,
        private taxRatesService: TaxRatesService
    ) { }

    /**
     * @method GET
     * @endpoint /api/financial-statement
     * 
     * Get yearly financial statement
     * 
     * @param query HTTP query params
     * @returns Promise<ApiResponseDataType>
     */
    @Get('financial-statement')
    async getFinancialStatement(@Query(new sanitizeHtmlPipe([])) query: { year: number }): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as DataFinancialStatement }

        const taxRate: TaxRate | null = await this.taxRatesService.getTaxRate(query.year)

        if (taxRate != null) {

            response.success = true
            response.data = await this.financialStmtsServices.getSummary(query.year, taxRate)

        }
        else {

            response.error = "Impostare dati fiscali per l'anno " + query.year

        }

        return response

    }
}
