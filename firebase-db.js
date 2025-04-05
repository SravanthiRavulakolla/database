const { db } = require('./firebase-config');
const {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} = require('firebase/firestore');

/**
 * Add a document to a collection with auto-generated ID
 * @param {string} collectionName - The collection to add to
 * @param {object} data - The data to add
 * @returns {Promise<string>} - The ID of the created document
 */
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

/**
 * Add or update a document with a specified ID
 * @param {string} collectionName - The collection to add to
 * @param {string} docId - The document ID
 * @param {object} data - The data to add
 * @returns {Promise<void>}
 */
const setDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
    return docId;
  } catch (error) {
    console.error("Error setting document: ", error);
    throw error;
  }
};

/**
 * Get a document by ID
 * @param {string} collectionName - The collection to query
 * @param {string} docId - The document ID
 * @returns {Promise<object|null>} - The document data or null if not found
 */
const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

/**
 * Get all documents from a collection
 * @param {string} collectionName - The collection to query
 * @returns {Promise<Array>} - Array of document data
 */
const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

/**
 * Update a document
 * @param {string} collectionName - The collection containing the document
 * @param {string} docId - The document ID
 * @param {object} data - The data to update
 * @returns {Promise<void>}
 */
const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} collectionName - The collection containing the document
 * @param {string} docId - The document ID
 * @returns {Promise<void>}
 */
const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

/**
 * Query documents with filters
 * @param {string} collectionName - The collection to query
 * @param {Array} conditions - Array of where conditions [field, operator, value]
 * @param {string} orderByField - Field to order results by (optional)
 * @param {string} orderDirection - 'asc' or 'desc' (optional)
 * @param {number} limitCount - Maximum number of results (optional)
 * @returns {Promise<Array>} - Array of document data
 */
const queryDocuments = async (
  collectionName,
  conditions = [],
  orderByField = null,
  orderDirection = 'asc',
  limitCount = null
) => {
  try {
    let q = collection(db, collectionName);
    
    // Add where conditions
    if (conditions && conditions.length) {
      conditions.forEach(condition => {
        q = query(q, where(condition[0], condition[1], condition[2]));
      });
    }
    
    // Add orderBy if specified
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }
    
    // Add limit if specified
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error("Error querying documents: ", error);
    throw error;
  }
};

module.exports = {
  addDocument,
  setDocument,
  getDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  queryDocuments
}; 