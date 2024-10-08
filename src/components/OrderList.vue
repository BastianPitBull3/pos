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
          <td>{{ order.orderNumber }}</td>
          <td>${{ order.total }}</td>
          <td>
            <button class="btn-small btn-edit" @click="editOrder(order.id)">
              Edit
            </button>
            <button class="btn-small btn-delete" @click="deleteOrder(order.id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <router-link to="create-order" class="add-order-link"
      >Add New Order</router-link
    >
  </div>
</template>

<script>
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { fetchOrders } from "@/firebaseUtils";

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
      await deleteDoc(doc(db, "orders", id));
      await this.fetchOrders();
    },
    editOrder(id) {},
  },
};
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
.btn-edit {
    width: 54px;
  background-color: #ffc107; /* Naranja */
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-edit:hover {
  background-color: #e0a800; /* Naranja más oscuro */
}
.btn-small {
  padding: 2px;
  height: 32px;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}
.btn-delete {
    width: 80px;
  background-color: #dc3545;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.btn-delete:hover {
  background-color: #c82333; /* Rojo más oscuro */
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
