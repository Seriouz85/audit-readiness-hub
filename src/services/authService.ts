import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { User } from '@/types/audit';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      // Demo credentials bypass
      if (email === 'demo@auditready.com' && password === 'demo123') {
        return {
          id: 'demo-user',
          email: 'demo@auditready.com',
          displayName: 'Demo User',
          role: 'admin',
          lastLogin: new Date()
        };
      }

      // Real authentication for other users
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
        role: 'user', // Default role, should be fetched from your database
        lastLogin: new Date()
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Authentication failed');
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  },

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          role: 'user', // Default role, should be fetched from your database
          lastLogin: new Date()
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  },

  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      role: 'user', // Default role, should be fetched from your database
      lastLogin: new Date()
    };
  }
}; 