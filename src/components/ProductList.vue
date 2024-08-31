<template>
    <div class="product-list-container">
        <h1>Product List</h1>

        <table v-if="products.length > 0" >
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th class="actions">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id" >
                    <td>{{ product.name }}</td>
                    <td>${{ product.price }}</td>
                    <td> {{ product.description }}</td>
                    <td class="actions">
                        <button class="btn-small" @click="editProduct(product.id)" >Edit</button>
                        <button class="btn-small btn-danger" @click="deleteProduct(product.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else class="no-products-message"><p>No products to show.</p></div>
        <div class="add-product-btn-container">
            <button class="add-product-btn" @click="showAddProduct = true">Add New Product</button>
        </div>

        <div v-if="showAddProduct || selectedProduct" class="product-form">
            <input v-model="productForm.name" placeholder="Name">
            <input v-model="productForm.price" placeholder="Price">
            <textarea v-model="productForm.description" placeholder="Description"></textarea>
            <div class="btn-container">
                <button @click="submitProduct">Submit</button>
                <button class="cancel" @click="cancel">Cancel</button>
            </div>    
        </div>
    </div>
</template>

<script>
    import { db } from '../firebaseConfig';
    import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

    export default {
        data() {
            return {
                products: [],
                showAddProduct: false,
                selectedProduct: null,
                productForm: {
                    name: '',
                    price: null,
                    description: '',
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
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a,b) => a.name.localeCompare(b.name));
            },
            editProduct(id) {
                const product = this.products.find(product => product.id === id);
                this.productForm = { ...product };
                this.selectedProduct = id;
                this.showAddProduct = true;
            },
            async deleteProduct(id) {
                await deleteDoc(doc(db, "products", id));
                await this.fetchProducts();
            },
            async submitProduct() {
                if(this.selectedProduct) {
                    await updateDoc(doc(db, "products", this.selectedProduct), this.productForm);
                }else {
                    await addDoc(collection(db, "products"), this.productForm);
                }
                this.cancel();
                await this.fetchProducts();
            }, cancel() {
                this.showAddProduct = false;
                this.selectedProduct = null;
                this.productForm = {  name: '', price: null, description: ''};
            }
        }
    }

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
    th, td {
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
        padding: 5px 10px;
        font-size: 0.8rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
    }
    .btn-small.btn-danger {
        background-color: #dc3545;
    }
    .btn-small:hover {
        opacity: 0.8;
    }
    .add-product-btn-container {
        display: flex;
        justify-content: center;
    }
    .add-product-btn {
        margin-top: 12px;
        padding: 10px 15px;
        text-decoration: none;
        background-color: #007bff;
        color: white;
        border: 1px solid #757575;
        border-radius: 4px;
    }
    .add-product-btn:hover {
        background-color: #0056b3;
    }
    .product-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
    }
    .product-form input, .product-form textarea {
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
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #28a475;
        color: white;
    }
    .product-form button:hover {
        background-color: #218838;
    }
    .product-form button.cancel {
        background-color: #dc3545;
    }
    .product-form button.cancel:hover {
        background-color: #ba2535;
    }
    .no-products-message {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120px;
        background-color: #dddddd;
        border-radius: 4px;
    }
    .no-products-message p{
        font-size: large;
    }

</style>