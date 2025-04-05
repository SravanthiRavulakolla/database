// Script to fetch and display data from Firebase
const { getAllDocuments } = require('./firebase-db');
const { adminGetAllDocuments } = require('./firebase-admin');

// Collections to check
const collections = [
  'admin-products',
  'admin-users',
  'products',
  'users',
  'test-collection'
];

async function fetchAndDisplayData() {
  console.log('=== FETCHING DATA FROM FIREBASE ===\n');
  
  // Try both client-side and admin methods
  for (const collection of collections) {
    console.log(`\n=== COLLECTION: ${collection} ===`);
    
    // Try client-side method first
    try {
      console.log('\n[CLIENT-SIDE FETCH]:');
      const clientData = await getAllDocuments(collection);
      if (clientData && clientData.length > 0) {
        console.log(`Found ${clientData.length} documents:`);
        clientData.forEach((doc, i) => {
          console.log(`\nDocument ${i + 1} (ID: ${doc.id}):`);
          console.log(JSON.stringify(doc, null, 2));
        });
      } else {
        console.log('No documents found or permission denied (client-side fetch)');
      }
    } catch (error) {
      console.log(`Error with client-side fetch: ${error.message}`);
    }
    
    // Then try admin method
    try {
      console.log('\n[ADMIN FETCH]:');
      const adminData = await adminGetAllDocuments(collection);
      if (adminData && adminData.length > 0) {
        console.log(`Found ${adminData.length} documents:`);
        adminData.forEach((doc, i) => {
          console.log(`\nDocument ${i + 1} (ID: ${doc.id}):`);
          console.log(JSON.stringify(doc, null, 2));
        });
      } else {
        console.log('No documents found (admin fetch)');
      }
    } catch (error) {
      console.log(`Error with admin fetch: ${error.message}`);
    }
  }
  
  console.log('\n=== FETCH OPERATION COMPLETE ===');
}

// Run the fetch operation
fetchAndDisplayData().catch(error => {
  console.error('Unhandled error:', error);
}); 