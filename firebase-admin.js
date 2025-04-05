const admin = require('firebase-admin');
const serviceAccount = require('./suagr-firebase.json');

// Initialize Firebase Admin with the service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const adminDb = admin.firestore();

/**
 * Admin functions for server-side operations
 */

/**
 * Add a document to a collection with auto-generated ID
 * @param {string} collectionName - The collection to add to
 * @param {object} data - The data to add
 * @returns {Promise<string>} - The ID of the created document
 */
const adminAddDocument = async (collectionName, data) => {
  try {
    const docRef = await adminDb.collection(collectionName).add(data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document (admin): ", error);
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
const adminSetDocument = async (collectionName, docId, data) => {
  try {
    await adminDb.collection(collectionName).doc(docId).set(data, { merge: true });
    return docId;
  } catch (error) {
    console.error("Error setting document (admin): ", error);
    throw error;
  }
};

/**
 * Get a document by ID
 * @param {string} collectionName - The collection to query
 * @param {string} docId - The document ID
 * @returns {Promise<object|null>} - The document data or null if not found
 */
const adminGetDocument = async (collectionName, docId) => {
  try {
    const docRef = adminDb.collection(collectionName).doc(docId);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document (admin): ", error);
    throw error;
  }
};

/**
 * Get all documents from a collection
 * @param {string} collectionName - The collection to query
 * @returns {Promise<Array>} - Array of document data
 */
const adminGetAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await adminDb.collection(collectionName).get();
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error("Error getting documents (admin): ", error);
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
const adminUpdateDocument = async (collectionName, docId, data) => {
  try {
    await adminDb.collection(collectionName).doc(docId).update(data);
  } catch (error) {
    console.error("Error updating document (admin): ", error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} collectionName - The collection containing the document
 * @param {string} docId - The document ID
 * @returns {Promise<void>}
 */
const adminDeleteDocument = async (collectionName, docId) => {
  try {
    await adminDb.collection(collectionName).doc(docId).delete();
  } catch (error) {
    console.error("Error deleting document (admin): ", error);
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
const adminQueryDocuments = async (
  collectionName,
  conditions = [],
  orderByField = null,
  orderDirection = 'asc',
  limitCount = null
) => {
  try {
    let query = adminDb.collection(collectionName);
    
    // Add where conditions
    if (conditions && conditions.length) {
      conditions.forEach(condition => {
        query = query.where(condition[0], condition[1], condition[2]);
      });
    }
    
    // Add orderBy if specified
    if (orderByField) {
      query = query.orderBy(orderByField, orderDirection);
    }
    
    // Add limit if specified
    if (limitCount) {
      query = query.limit(limitCount);
    }
    
    const querySnapshot = await query.get();
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error("Error querying documents (admin): ", error);
    throw error;
  }
};

/**
 * Batch write multiple documents
 * @param {Array} operations - Array of operations [type, collectionName, docId, data]
 * @returns {Promise<void>}
 */
const adminBatchOperation = async (operations) => {
  try {
    const batch = adminDb.batch();
    
    operations.forEach(op => {
      const [type, collectionName, docId, data] = op;
      const docRef = adminDb.collection(collectionName).doc(docId);
      
      if (type === 'set') {
        batch.set(docRef, data, { merge: true });
      } else if (type === 'update') {
        batch.update(docRef, data);
      } else if (type === 'delete') {
        batch.delete(docRef);
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error in batch operation: ", error);
    throw error;
  }
};

// Export the admin app and database instance
module.exports = {
  admin, 
  adminDb,
  adminAddDocument,
  adminSetDocument,
  adminGetDocument,
  adminGetAllDocuments,
  adminUpdateDocument,
  adminDeleteDocument,
  adminQueryDocuments,
  adminBatchOperation
}; 