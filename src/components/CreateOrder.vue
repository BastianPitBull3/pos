<template>
  <div class="create-order-container">
    <h1>Create New Order</h1>

    <form @submit.prevent="submitOrder">
      <!-- <input v-model="newOrder.number" placeholder="Order Number" class="input-style"> -->

      <table class="product-selection-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in availableProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td>${{ product.price }}</td>
            <td>
              <input
                type="text"
                v-model="product.quantity"
                @input="handleQuantityInput(product, $event)"
                min="0"
                placeholder="0"
                class="input-style"
              />
            </td>
            <td>
              <button
                type="button"
                @click="addProductToOrder(product)"
                class="add-button"
                :disabled="isProductAdded(product)"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Selected Products</h2>
      <ul>
        <li v-for="(item, index) in newOrder.products" :key="index">
          {{ item.name }} - Quantity: {{ item.quantity }} Total: ${{
            item.total
          }}
          <button
            @click="removeProductFromOrder(index)"
            class="btn-small btn-delete"
          >
            Remove
          </button>
        </li>
      </ul>
      <p>
        <strong>Total: ${{ newOrder.total }}</strong>
      </p>

      <div class="submit-btn-container">
        <button type="submit" class="submit-btn">Submit Order</button>
      </div>
    </form>
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
      newOrder: {
        orderNumber: 0,
        products: [],
        total: 0,
      },
      availableProducts: [],
    };
  },
  async created() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      const querySnapshot = await getDocs(collection(db, "products"));
      this.availableProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        quantity: '',
      }));
    },
    async assignOrderNumber() {
      const orders = await fetchOrders();
      console.log(`numero de ordenes: ${orders.length}`);
      if (orders.length > 0) {
        console.log("mas de 0 ordenes");
        // Asigna el número de orden automáticamente como el número más alto + 1
        const maxOrderNumber = Math.max(
          ...orders.map((order) => order.orderNumber)
        );
        this.newOrder.orderNumber = maxOrderNumber + 1;
        console.log(`orderNumber: ${this.newOrder.orderNumber}`);
      } else {
        console.log("no hay ordenes");
        this.newOrder.orderNumber = 1; // Si no hay órdenes previas
      }
    },
    async addProductToOrder(selectedProduct) {
      console.log(selectedProduct);
      if (selectedProduct.quantity == '') {
        alert("Please add a valid quantity");
        return;
      }

      const productTotal = selectedProduct.price * selectedProduct.quantity;
      const productToAdd = {
        ...selectedProduct,
        total: productTotal,
      };
      this.newOrder.products.push(productToAdd);
      this.calculateOrderTotal();
    },
    calculateOrderTotal() {
      this.newOrder.total = this.newOrder.products.reduce(
        (acc, product) => acc + product.total,
        0
      );
    },
    isProductAdded(product) {
      return this.newOrder.products.some((item) => item.id === product.id);
    },
    removeProductFromOrder(index) {
      this.newOrder.products.splice(index, 1);
      this.calculateOrderTotal();
    },
    async submitOrder() {
      if (this.newOrder.products.length === 0) {
        alert("please add at least one product to the order.");
        return;
      }
      await this.assignOrderNumber();
      await addDoc(collection(db, "orders"), this.newOrder);
      alert(`Order saved with order number: ${this.newOrder.orderNumber}`);
      this.resetOrderForm();
    },
    resetOrderForm() {
      this.newOrder = { orderNumber: 0, products: [], total: 0 };
      this.availableProducts.forEach((product) => (product.quantity = ''));
    },
    handleQuantityInput(product, event) {
      if(event.target.value !== ''){
        const sanitizedValue = parseInt(event.target.value.replace(/\D/g, '')) || '';
        product.quantity = sanitizedValue === '' ? '' : sanitizedValue;
      }else{
        product.quantity = '';
      }
    }
  },
};
</script>

<style scoped>
.create-order-container {
  max-width: 800px;
  margin: 12px auto auto auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input[type="number"],
input[type="text"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
button {
  font-size: 1rem;
}
.add-button {
  width: 80px;
  justify-content: center;
  background-color: #007bff;
  color: white;
  border: none;
}
.add-button:hover {
  background-color: #0056b3;
}
.submit-btn-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.submit-btn {
  height: 40px;
  width: 320px;
  margin-top: 12px;
  padding: 8px 16px;
  font-size: 18px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.submit-btn:hover {
  background-color: #218838;
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    background: #e9ecef;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.btn-small {
  padding: 5px 10px;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-delete {
  background-color: #dc3545; /* Rojo */
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.btn-delete:hover {
  background-color: #c82333; /* Rojo más oscuro */
}
.product-selection-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}
.product-selection-table th,
.product-selection-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.product-selection-table input[type="number"] {
  max-width: 80px;
}
.product-selection-table th {
  background-color: #f5f5f5;
}
.product-selection-table td:nth-child(1) {
  width: 50%;
}
.product-selection-table th:nth-child(2),
.product-selection-table td:nth-child(3) {
  width: 15%;
}
.product-selection-table td:nth-child(4) {
  width: 15%;
}
.input-style {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
.add-button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
