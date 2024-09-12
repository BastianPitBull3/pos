import CreateOrder from "@/components/CreateOrder.vue";
import OrderList from "@/components/OrderList.vue";
import ProductList from "@/components/ProductList.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: '/', redirect: '/products' },  // Redirige la raíz a productos
    { path: '/products', component: ProductList },
    { path: '/orders', component: OrderList },
    { path: '/create-order', component: CreateOrder },
    { path: '/:pathMatch(.*)*', redirect: '/products' }  // Redirige cualquier ruta no definida a productos
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;