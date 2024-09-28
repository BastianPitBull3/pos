<template>
    <div class="product-list-container">
        <h1>Lista de Productos</h1>

        <div v-if="products.length > 0">
            <table class="products-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>${{ product.price.toFixed(2) }}</td>
                        <td>{{ product.description }}</td>
                        <td>
                            <button class="btn-edit" @click="editProduct(product.id)" title="Editar Producto">
                                Editar
                            </button>
                            <button class="btn-delete" @click="deleteProduct(product.id)" title="Eliminar Producto">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="no-products-message">
            <p>No hay productos disponibles.</p>
        </div>

        <div class="add-product-btn-container">
            <button class="add-product-btn" @click="showAddProductForm = true" title="Agregar Nuevo Producto">
                Agregar Producto
            </button>
        </div>

        <!-- Formulario de Agregar/Editar Producto -->
        <div v-if="showAddProductForm" class="product-form-overlay">
            <div class="product-form-container">
                <h2>{{ selectedProduct ? 'Editar Producto' : 'Agregar Nuevo Producto' }}</h2>
                <form @submit.prevent="submitProduct">
                    <div class="form-group">
                        <label for="product-name">Nombre</label>
                        <input
                            type="text"
                            id="product-name"
                            v-model="productForm.name"
                            placeholder="Nombre del producto"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="product-price">Precio</label>
                        <input
                            type="number"
                            id="product-price"
                            v-model.number="productForm.price"
                            placeholder="Precio del producto"
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="product-description">Descripción</label>
                        <textarea
                            id="product-description"
                            v-model="productForm.description"
                            placeholder="Descripción del producto"
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-submit">
                            {{ selectedProduct ? 'Actualizar' : 'Agregar' }}
                        </button>
                        <button type="button" class="btn-cancel" @click="cancelForm">
                            Cancelar
                        </button>
                    </div>
                </form>
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
            showAddProductForm: false,
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
                .sort((a, b) => a.name.localeCompare(b.name));
        },
        async deleteProduct(id) {
            if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
                await deleteDoc(doc(db, "products", id));
                await this.fetchProducts();
                alert("Producto eliminado exitosamente.");
            }
        },
        editProduct(id) {
            const product = this.products.find(p => p.id === id);
            if (product) {
                this.productForm = { ...product };
                this.selectedProduct = id;
                this.showAddProductForm = true;
            }
        },
        async submitProduct() {
            if (this.selectedProduct) {
                await updateDoc(doc(db, "products", this.selectedProduct), this.productForm);
                alert("Producto actualizado exitosamente.");
            } else {
                await addDoc(collection(db, "products"), this.productForm);
                alert("Producto agregado exitosamente.");
            }
            this.cancelForm();
            await this.fetchProducts();
        },
        addProduct() {
            this.selectedProduct = null;
            this.productForm = { name: '', price: null, description: '' };
            this.showAddProductForm = true;
        },
        cancelForm() {
            this.showAddProductForm = false;
            this.selectedProduct = null;
            this.productForm = { name: '', price: null, description: '' };
        }
    }
}
</script>

<style scoped>
.product-list-container {
    max-width: 1000px;
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

.products-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 25px;
}

.products-table th,
.products-table td {
    border: 1px solid #dddddd;
    padding: 12px 15px;
    text-align: center;
}

.products-table th {
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

.add-product-btn-container {
    text-align: center;
    margin-top: 20px;
}

.add-product-btn {
    padding: 12px 24px;
    background-color: #28a745;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px;
}

.add-product-btn:hover {
    background-color: #218838;
}

.no-products-message {
    text-align: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 6px;
    color: #555555;
    font-size: 16px;
}

.product-form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.product-form-container {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.product-form-container h2 {
    margin-bottom: 20px;
    color: #333333;
    text-align: center;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    color: #555555;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #cccccc;
    border-radius: 6px;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    border-color: #007bff;
    outline: none;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.btn-submit,
.btn-cancel {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
    width: 48%;
}

.btn-submit {
    background-color: #007bff;
    color: #ffffff;
}

.btn-submit:hover {
    background-color: #0056b3;
}

.btn-cancel {
    background-color: #6c757d;
    color: #ffffff;
}

.btn-cancel:hover {
    background-color: #5a6268;
}
</style>
