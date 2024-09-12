import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function fetchOrders() {
    const querySnapshot = await getDocs(collection(db, "orders"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}