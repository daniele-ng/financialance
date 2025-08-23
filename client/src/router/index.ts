import { Auth } from '@/lib/auth'
import CreateAccountView from '@/views/CreateAccountView.vue'
import CreateInvoiceView from '@/views/CreateInvoiceView.vue'
import CreateTaxRateView from '@/views/CreateTaxRateView.vue'
import DashboardView from '@/views/DashboardView.vue'
import InvoicesView from '@/views/InvoicesView.vue'
import LoginView from '@/views/LoginView.vue'
import LogoutView from '@/views/LogoutView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Login",
            component: LoginView,
            meta: { protected: false }
        },
        {
            path: "/new-account",
            name: "NewAccount",
            component: CreateAccountView,
            meta: { protected: false }
        },
        {
            path: "/dashboard",
            name: "Dashboard",
            component: DashboardView,
            meta: { protected: true }
        },
        {
            path: "/invoices",
            name: "Invoices",
            component: InvoicesView,
            meta: { protected: true }
        },
        {
            path: "/new-invoice",
            name: "NewInvoice",
            component: CreateInvoiceView,
            meta: { protected: true}
        },
        {
            path: "/settings",
            name: "Settings",
            component: SettingsView,
            meta: { protected: true }
        },
        {
            path: "/new-tax-rate",
            name: "NewTaxRate",
            component: CreateTaxRateView,
            meta: { protected: true}
        },
        {
            path: "/logout",
            name: "Logout",
            component: LogoutView,
            meta: { protected: false }
        }
    ],
})

router.beforeEach(async(to, from) => {

    if (to.name !== 'Login' && to.meta.protected && !Auth.isAuthenticated()) {

        return { name: 'Login' }
    }
})

export default router
