import { createRouter, createWebHistory } from 'vue-router'
import HistoryRouter from '../component/HistoryManagement.vue'
import AddEditRouter from '../component/AddEdit.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'AddEdit',
            component: AddEditRouter      
        },
        {
            path: '/history',
            name: 'History',
            component: HistoryRouter
        }
    ]
})
export default router