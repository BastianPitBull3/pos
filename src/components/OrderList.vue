<template>
    <div class="order-list-container">
        <h1>Lista de Órdenes</h1>

        <div v-if="orders.length > 0">
            <table class="orders-table">
                <thead>
                    <tr>
                        <th># Orden</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id">
                        <td>{{ order.orderNumber }}</td>
                        <td>${{ order.total.toFixed(2) }}</td>
                        <td>
                            <button class="btn-edit" @click="editOrder(order.id)" title="Editar Orden">
                                Editar
                            </button>
                            <button class="btn-delete" @click="deleteOrder(order.id)" title="Eliminar Orden">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="no-orders-message">
            <p>No hay órdenes disponibles.</p>
        </div>

        <router-link to="create-order" class="add-order-btn" title="Agregar Nueva Orden">
            Agregar Nueva Orden
        </router-link>
    </div>
</template>

<script>
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { fetchOrders } from '@/firebaseUtils';

export default {
    data() {
        return {
            orders: [],
        };
    },
    async created() {
        await this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            this.orders = await fetchOrders();
        },
        async deleteOrder(id) {
            if (confirm("¿Estás seguro de que deseas eliminar esta orden?")) {
                await deleteDoc(doc(db, "orders", id));
                await this.fetchOrders();
                alert("Orden eliminada exitosamente.");
            }
        },
        editOrder(id) {
            // Lógica para editar la orden
            alert(`Funcionalidad de edición para la orden #${id} aún no implementada.`);
        }
    }
}
</script>

<style scoped>
.order-list-container {
    max-width: 900px;
    margin: 30px auto;
    padding: 30px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

h1 {
    font-size: 28px;
    color: #333333;
    text-align: center;
    margin-bottom: 25px;
}

.orders-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 25px;
}

.orders-table th,
.orders-table td {
    border: 1px solid #dddddd;
    padding: 12px 15px;
    text-align: center;
}

.orders-table th {
    background-color: #f2f2f2;
    color: #555555;
}

.btn-edit,
.btn-delete {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 8px;
    transition: background-color 0.3s ease;
}

.btn-edit {
    background-color: #17a2b8;
    color: #ffffff;
}

.btn-edit:hover {
    background-color: #138496;
}

.btn-delete {
    background-color: #dc3545;
    color: #ffffff;
}

.btn-delete:hover {
    background-color: #c82333;
}

.add-order-btn {
    display: inline-block;
    padding: 12px 24px;
    background-color: #28a745;
    color: #ffffff;
    text-decoration: none;
    border-radius: 6px;
    text-align: center;
    transition: background-color 0.3s ease;
    margin: 0 auto;
    display: block;
    max-width: 200px;
    margin-top: 20px;
}

.add-order-btn:hover {
    background-color: #218838;
}

.no-orders-message {
    text-align: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 6px;
    color: #555555;
    font-size: 16px;
}
</style>
