<template>
    <div class="create-order-container">
        <h1>Create New Order</h1>

        <form @submit.prevent="submitOrder" >
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
                            <input type="text" pattern="\d*" v-model="product.quantity" min=0 placeholder="Quantity" class="input-style">
                        </td>
                        <td>
                            <button type="button" @click="addProductToOrder(product)" class="add-button"  :disabled="isProductAdded(product)">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h2>Selected Products</h2>
            <ul>
                <li v-for="(item, index) in newOrder.products" :key="index">
                    {{ item.name }} - Quantity: {{ item.quantity }}  Total: ${{  item.total  }}
                    <button @click="removeProductFromOrder(index)" class="btn-small btn-danger">Remove</button>
                </li>
            </ul>
            <p><strong>Total: ${{newOrder.total}}</strong></p>

            <div class="submit-btn-container">
                <button type="submit" class="submit-btn">Submit Order</button>
            </div>
        </form>
    </div>
</template>

<script>
    import { db } from '../firebaseConfig';
    import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
    import { fetchOrders } from '@/firebaseUtils';

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
                this.availableProducts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    quantity: 0,
                }));
            },
            async assignOrderNumber() {
                const orders = await fetchOrders();
                console.log(`numero de ordenes: ${orders.length}`);
                if (orders.length > 0) {
                    console.log("mas de 0 ordenes");
                    // Asigna el número de orden automáticamente como el número más alto + 1
                    const maxOrderNumber = (Math.max(...orders.map(order => order.orderNumber)));
                    this.newOrder.orderNumber = maxOrderNumber + 1;
                    console.log(`orderNumber: ${this.newOrder.orderNumber}`);
                    
                } else {
                    console.log("no hay ordenes");
                    this.newOrder.orderNumber = 1; // Si no hay órdenes previas
                }
            },
            async addProductToOrder(selectedProduct) {
                if (selectedProduct <= 0) {
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
                this.newOrder.total = this.newOrder.products.reduce((acc, product) => acc + product.total, 0)
            },
            isProductAdded(product) {
                return this.newOrder.products.some(item => item.id === product.id);
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
                alert("order created succesfully");
                this.resetOrderForm();
            },
            resetOrderForm() {
                this.newOrder = { orderNumber: 0, products: [], total: 0 };
                this.availableProducts.forEach(product => product.quantity=0);      
            },
        }
    }
</script>

<style scoped>
    .create-order-container {
        max-width: 800px;
        margin: 12px auto auto auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background: #f9f9f9
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
        border: 1px solid #757575;
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
        background-color: #28a745;
        color: white;
    }
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
    .btn-small {
        padding: 5px 10px;
        font-size: 0.8rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .btn-danger{
        background-color: #dc3545;
        color: white;
    }
    .btn-danger:hover {
        background-color: #c82333;
    }
    h2, p {
        margin-top: 20px;
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
        width: 100%
    }
    .add-button[disabled] {
        background-color: #ccc;
        cursor: not-allowed;
    }
</style>