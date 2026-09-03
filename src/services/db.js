import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'praktikumsstellen';

export const getPraktikumsstellen = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return [];
  }
};

export const addPraktikumsstelle = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const updatePraktikumsstelle = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const deletePraktikumsstelle = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

export const seedTestData = async () => {
  const testData = [
    {
      title: 'Praktikum Softwareentwicklung',
      category: 'IT',
      company: 'Volkswagen Financial Services',
      location: 'Braunschweig',
      duration: '2-3 Wochen',
      description: 'Einblicke in die IT-Abteilung und agile Softwareentwicklung. Kennenlernen von Programmiersprachen und Datenbanken.',
      requirements: 'Interesse an Computern, logisches Denken.',
      contact: 'karriere@vwfs.com',
      website: 'https://vwfs.com'
    },
    {
      title: 'Schülerpraktikum Verkauf',
      category: 'Wirtschaft',
      company: 'New Yorker',
      location: 'Braunschweig',
      duration: '2 Wochen',
      description: 'Praktikum im Store. Einblicke in Verkauf, Warenpräsentation und Kundenberatung.',
      requirements: 'Offenheit, Kommunikationsstärke.',
      contact: 'jobs@newyorker.de',
      website: 'https://newyorker.de'
    },
    {
      title: 'Praktikant (m/w/d) im Labor',
      category: 'Naturwissenschaften',
      company: 'Helmholtz-Zentrum für Infektionsforschung',
      location: 'Braunschweig',
      duration: '2 Wochen',
      description: 'Einführung in einfache laborpraktische Tätigkeiten und Begleitung der Forscher.',
      requirements: 'Gute Noten in Biologie und Chemie.',
      contact: 'info@helmholtz-hzi.de',
      website: 'https://helmholtz-hzi.de'
    },
    {
      title: 'Kaufmännisches Praktikum',
      category: 'Wirtschaft',
      company: 'Nordzucker',
      location: 'Braunschweig',
      duration: '3 Wochen',
      description: 'Einblicke in die Abteilungen Einkauf, Marketing und Rechnungswesen.',
      requirements: 'Interesse an kaufmännischen Zusammenhängen.',
      contact: 'karriere@nordzucker.com',
      website: 'https://nordzucker.com'
    }
  ];

  for (const stelle of testData) {
    await addPraktikumsstelle(stelle);
  }
};
