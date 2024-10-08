<template>
  <div class="product-list-container">
    <h1>Product List</h1>

    <table v-if="products.length > 0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Description</th>
          <th class="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.name }}</td>
          <td>${{ product.price }}</td>
          <td>{{ product.description }}</td>
          <td class="actions">
            <button class="btn-small btn-edit" @click="editProduct(product.id)">
              Edit
            </button>
            <button
              class="btn-small btn-delete"
              @click="deleteProduct(product.id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="no-products-message"><p>No products to show.</p></div>
    <div class="add-product-btn-container">
      <button class="add-product-btn" @click="showAddProduct = true">
        Add New Product
      </button>
    </div>

    <div v-if="showAddProduct || selectedProduct" class="product-form">
      <input v-model="productForm.name" placeholder="Name" />
      <input v-model="productForm.price" placeholder="Price" />
      <textarea
        v-model="productForm.description"
        placeholder="Description"
      ></textarea>
      <div class="btn-container">
        <button class="btn-cancel" @click="cancel">Cancel</button>
        <button class="btn-submit" @click="submitProduct">Submit</button>
      </div>
    </div>
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

export default {
  data() {
    return {
      products: [],
      showAddProduct: false,
      selectedProduct: null,
      productForm: {
        name: "",
        price: null,
        description: "",
      },
    };
  },
  async created() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      const querySnapshot = await getDocs(collection(db, "products"));
      this.products = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    editProduct(id) {
      const product = this.products.find((product) => product.id === id);
      this.productForm = { ...product };
      this.selectedProduct = id;
      this.showAddProduct = true;
    },
    async deleteProduct(id) {
      await deleteDoc(doc(db, "products", id));
      await this.fetchProducts();
    },
    async submitProduct() {
      if (this.selectedProduct) {
        await updateDoc(
          doc(db, "products", this.selectedProduct),
          this.productForm
        );
      } else {
        await addDoc(collection(db, "products"), this.productForm);
      }
      this.cancel();
      await this.fetchProducts();
    },
    cancel() {
      this.showAddProduct = false;
      this.selectedProduct = null;
      this.productForm = { name: "", price: null, description: "" };
    },
  },
};
</script>

<style scoped>
.product-list-container {
  min-width: 360px;
  max-width: 640px;
  margin: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th,
td {
  border: solid 1px #ccc;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f5f5f5;
}
th.actions {
  width: 160px;
}
td.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}
.btn-small {
  margin-right: 4px;
  height: 32px;
  padding: 2px 6px;
  font-size: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-edit {
  width: 54px;
  background-color: #ffc107; /* Naranja */
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.btn-edit:hover {
  background-color: #e0a800; /* Naranja más oscuro */
}
.btn-delete {
  width: 80px;
  background-color: #dc3545; /* Rojo */
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
.btn-cancel {
  width: 80px;
  background-color: #6c757d; /* Gris */
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.btn-cancel:hover {
  background-color: #5a6268;
}
.btn-submit {
  background-color: #28a745; /* Verde claro */
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.btn-submit:hover {
  background-color: #218838; /* Verde más oscuro */
}
.add-product-btn-container {
  display: flex;
  justify-content: center;
}
.add-product-btn {
  margin-top: 12px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.add-product-btn:hover {
  background-color: #218838;
}
.product-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}
.product-form input,
.product-form textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-container {
  display: flex;
  justify-content: space-evenly;
}
.product-form button {
  width: 48%;
  height: 48px;
  padding: auto;
}
.no-products-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background-color: #dddddd;
  border-radius: 4px;
}
.no-products-message p {
  font-size: large;
}
</style>
