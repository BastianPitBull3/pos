import CreateOrder from "@/components/CreateOrder.vue";
import OrderList from "@/components/OrderList.vue";
import ProductList from "@/components/ProductList.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {path: '/products', component: ProductList},
    {path: '/orders', component: OrderList},
    {path: '/create-order', component: CreateOrder}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;