import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function fetchOrders() {
    const querySnapshot = await getDocs(collection(db, "orders"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, quantity: '', ...doc.data() }));
}