import admin, {ServiceAccount} from 'firebase-admin';
import serviceAccount from './credentials.json';

// Initialize Firebase Admin SDK
export const firebaseAdmin =  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});