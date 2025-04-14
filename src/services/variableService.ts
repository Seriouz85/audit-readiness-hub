import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { Variable } from '@/types/audit';

const COLLECTION_NAME = 'variables';

export const variableService = {
  async getVariables(requirementId: string): Promise<Variable[]> {
    try {
      const variablesRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(variablesRef);
      
      return querySnapshot.docs
        .filter(doc => doc.data().requirementId === requirementId)
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as Variable[];
    } catch (error) {
      console.error('Error fetching variables:', error);
      throw new Error('Failed to fetch variables');
    }
  },

  async createVariable(data: Omit<Variable, 'id' | 'createdAt' | 'updatedAt'>): Promise<Variable> {
    try {
      const variablesRef = collection(db, COLLECTION_NAME);
      const docRef = await addDoc(variablesRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error creating variable:', error);
      throw new Error('Failed to create variable');
    }
  },

  async updateVariable(id: string, value: string): Promise<Variable> {
    try {
      const variableRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(variableRef, {
        value,
        updatedAt: serverTimestamp()
      });

      const updatedDoc = await getDocs(collection(db, COLLECTION_NAME));
      const updatedVariable = updatedDoc.docs
        .find(doc => doc.id === id)
        ?.data() as Variable;

      return {
        ...updatedVariable,
        id,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error updating variable:', error);
      throw new Error('Failed to update variable');
    }
  }
}; 