<template>
    <div class="create-order-container">
        <h1>Crear Nueva Orden</h1>

        <form @submit.prevent="submitOrder">
            <!-- Tabla de Selección de Productos -->
            <table class="product-selection-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in availableProducts" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>${{ product.price.toFixed(2) }}</td>
                        <td>
                            <input
                                type="number"
                                v-model.number="product.quantity"
                                min="1"
                                placeholder="Cantidad"
                                class="input-style"
                            />
                        </td>
                        <td>
                            <button
                                type="button"
                                @click="addProductToOrder(product)"
                                class="btn-add"
                                :disabled="isProductAdded(product) || product.quantity < 1"
                                :title="isProductAdded(product) ? 'Producto ya añadido' : 'Agregar Producto'"
                            >
                                Agregar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Lista de Productos Seleccionados -->
            <div v-if="newOrder.products.length > 0" class="selected-products-section">
                <h2>Productos Seleccionados</h2>
                <ul class="selected-products-list">
                    <li v-for="(item, index) in newOrder.products" :key="index">
                        <div class="product-info">
                            <span>{{ item.name }}</span>
                            <span>Cantidad: {{ item.quantity }}</span>
                            <span>Total: ${{ item.total.toFixed(2) }}</span>
                        </div>
                        <button @click="removeProductFromOrder(index)" class="btn-remove" title="Eliminar Producto">
                            Eliminar
                        </button>
                    </li>
                </ul>
                <p class="order-total"><strong>Total: ${{ newOrder.total.toFixed(2) }}</strong></p>
            </div>

            <!-- Botón de Enviar Orden -->
            <div class="submit-btn-container">
                <button
                    type="submit"
                    class="submit-btn"
                    :disabled="newOrder.products.length === 0"
                    :title="newOrder.products.length === 0 ? 'Añade al menos un producto' : 'Enviar Orden'"
                >
                    Enviar Orden
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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
                quantity: 1,
            }));
        },
        async assignOrderNumber() {
            const orders = await fetchOrders();
            if (orders.length > 0) {
                const maxOrderNumber = Math.max(...orders.map(order => order.orderNumber));
                this.newOrder.orderNumber = maxOrderNumber + 1;
            } else {
                this.newOrder.orderNumber = 1;
            }
        },
        async addProductToOrder(selectedProduct) {
            if (selectedProduct.quantity < 1) {
                alert("Por favor, añade una cantidad válida.");
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
            this.newOrder.total = this.newOrder.products.reduce((acc, product) => acc + product.total, 0);
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
                alert("Por favor, añade al menos un producto a la orden.");
                return;
            }
            await this.assignOrderNumber();
            await addDoc(collection(db, "orders"), this.newOrder);
            alert("Orden creada exitosamente.");
            this.resetOrderForm();
        },
        resetOrderForm() {
            this.newOrder = { orderNumber: 0, products: [], total: 0 };
            this.availableProducts.forEach(product => product.quantity = 1);
        },
    }
}
</script>

<style scoped>
.create-order-container {
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

.product-selection-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 25px;
}

.product-selection-table th,
.product-selection-table td {
    border: 1px solid #dddddd;
    padding: 12px 15px;
    text-align: center;
}

.product-selection-table th {
    background-color: #f2f2f2;
    color: #555555;
}

.input-style {
    padding: 8px 12px;
    border: 1px solid #cccccc;
    border-radius: 6px;
    width: 80px;
    text-align: center;
    transition: border-color 0.3s ease;
}

.input-style:focus {
    border-color: #007bff;
    outline: none;
}

.btn-add {
    padding: 8px 16px;
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-add:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
}

.btn-add:hover:not(:disabled) {
    background-color: #0056b3;
}

.selected-products-section {
    margin-top: 20px;
}

.selected-products-list {
    list-style: none;
    padding: 0;
    margin-bottom: 15px;
}

.selected-products-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f9f9f9;
    padding: 12px 15px;
    border-radius: 6px;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.product-info span {
    margin-right: 15px;
    color: #555555;
}

.btn-remove {
    padding: 6px 12px;
    background-color: #dc3545;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-remove:hover {
    background-color: #c82333;
}

.order-total {
    font-size: 18px;
    text-align: right;
    color: #333333;
}

.submit-btn-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.submit-btn {
    padding: 14px 30px;
    background-color: #28a745;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.submit-btn:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
    background-color: #218838;
}
</style>
