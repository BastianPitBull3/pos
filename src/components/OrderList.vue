<template>
    <div class="order-list-container">
        <h1>Order List</h1>

        <table class="orders-table">
            <thead>
                <tr>
                    <th>Order number</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.id">
                    <td>{{ order.number }}</td>
                    <td>${{ order.total }}</td>
                    <td>
                        <button class="btn-small" @click="editOrder(order.id)" >Edit</button>
                        <button class="btn-small btn-danger" @click="deleteOrder(order.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <router-link to="create-order" class="add-order-link" >Add New Order</router-link>
    </div>
</template>

<script>
    import { db } from '../firebaseConfig';
    import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

    export default {
        data() {
            return {
                orders: [],
            };
        },
        async created() {
            await this.fetchOrders();
        }, methods: {
            async fetchOrders() {
                const querySnapshot = await getDocs(collection(db, "orders"));
                this.orders = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }));
            },
            async deleteOrder(id) {
                await deleteDoc(doc(db, "orders", id));
                await this.fetchOrders();
            },
            editOrder(id) {

            }
        }
    }
</script>

<style scoped>
    .order-list-container {
        max-width: 800px;
        margin: auto;
        padding: 20px;
    }
    .orders-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    .orders-table th,
    .orders-table td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left; 
    }
    .orders-table th {
        background-color: #f5f5f5; 
    }
    .btn-small {
        font-size: 0.8rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 10px;
    }
    .btn-small.btn-danger {
        background-color: #dc3545;
        color: white;
    }
    .btn-small:hover,
    .btn-small.btn-danger:hover {
        opacity: 0.8;
    }
    .add-order-link {
        display: inline-block;
        margin-top: 20px;
        margin-left: 4px;
        padding: 10px 15px;
        text-decoration: none;
        background-color: #007bff;
        color: white;
        border: 1px solid #757575;
        border-radius: 4px;
    }
    .add-order-link:hover {
        background-color: #0056b3;
    }
</style>