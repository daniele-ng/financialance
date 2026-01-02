<script setup lang="ts">
import CardComponent from '@/components/CardComponent.vue';
import ItemCardComponent from '@/components/ItemCardComponent.vue';
import { useFetch } from '@/lib/fetch';
import { onMounted, type Ref, ref  } from 'vue';
import MonthlyIncomeView from './MonthlyIncomeView.vue';
import AnnualIncomeView from './AnnualIncomeView.vue';

const year: Ref<number> = ref(new Date().getFullYear())
const showFinancialStmtData: Ref<boolean> = ref(false)

const { pending: pendingFinancialStmt, apiResponse: resFinancialStmt, handlerFetch: fetchFinancialStmt } = useFetch()
const { pending: pendingInvoices, apiResponse: resInvoices, handlerFetch: fetchInvoices } = useFetch()

onMounted(async () => {    

    await fetchInvoices('/api/invoices?limit=5')
    await fetchFinancialStmt('/api/financial-statement?year=' + year.value)    

    showFinancialStmtData.value = typeof resFinancialStmt.value.data != 'undefined' && Object.entries(resFinancialStmt.value.data).length > 0

})

</script>

<template>
    <div class="py-8 px-16 box-content">
        <h2 class="text-3xl text-blue-400 font-['Oxygen']">Dashboard</h2>
        <div class="flex flex-row w-full my-12">
            <div class="basis-1/2">
                <CardComponent :title="'Bilancio ' + year" :error="resFinancialStmt.error" :show-loader="pendingFinancialStmt">
                    <div v-if="showFinancialStmtData" class="mb-6">
                        <span class="text-[1rem]">Redditività: {{ resFinancialStmt.data.revenue_perc }}%</span>
                        <span class="text-[1rem] ml-2">Inps: {{ resFinancialStmt.data.inps_perc }}%</span>
                        <span class="text-[1rem] ml-2">Tasse: {{ resFinancialStmt.data.tax_perc }}%</span>
                    </div>
                    <div v-if="showFinancialStmtData">
                        <ItemCardComponent :label-col-sx="'Fatturato lordo:'"
                            :label-col-dx="resFinancialStmt.data.income" />
                        <ItemCardComponent :label-col-sx="'Fatturato netto:'"
                            :label-col-dx="resFinancialStmt.data.net_income" />
                        <ItemCardComponent :label-col-sx="'Imponibile:'"
                            :label-col-dx="resFinancialStmt.data.taxable_income" />
                        <ItemCardComponent :label-col-sx="'Tasse:'" :label-col-dx="resFinancialStmt.data.tax" />
                        <ItemCardComponent :label-col-sx="'Tasse INPS:'"
                            :label-col-dx="resFinancialStmt.data.inps_tax" />
                        <ItemCardComponent :label-col-sx="'Totale tasse:'"
                            :label-col-dx="resFinancialStmt.data.total_tax" />
                        <ItemCardComponent :label-col-sx="'Anticipo tasse:'"
                            :label-col-dx="resFinancialStmt.data.advance_tax_payment" />
                    </div>
                </CardComponent>
            </div>
            <div class="basis-1/2">
                <CardComponent :title="'Fatture'" :error="resInvoices.error" :show-loader="pendingInvoices">
                    <div v-if="typeof resInvoices.data != 'undefined'" class="mb-6">
                        <p class="text-[1rem]">Ultime 5 fatture emesse</p>
                    </div>
                    <div v-if="typeof resInvoices.data !== 'undefined'" v-for="item in resInvoices.data">
                        <ItemCardComponent :label-col-sx="item.code" :label-col-dx="item.amount_it" />
                    </div>
                </CardComponent>
            </div>
        </div>
    </div>
    <div class="py-8 px-16 box-content">
        <h2 class="text-3xl text-blue-400 font-['Oxygen']">Statistiche</h2>
        <MonthlyIncomeView />
        <AnnualIncomeView />
    </div>
</template>