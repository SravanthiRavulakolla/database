// Example of using Firebase Admin SDK for server-side operations
const {
  adminAddDocument,
  adminSetDocument,
  adminGetDocument,
  adminGetAllDocuments,
  adminUpdateDocument,
  adminDeleteDocument,
  adminQueryDocuments,
  adminBatchOperation
} = require('./firebase-admin');

// Example data
const userData = {
  name: "Admin User",
  email: "admin@example.com",
  role: "system",
  createdAt: new Date(),
  isVerified: true
};

const productBatch = [
  {
    name: "Product A",
    price: 199.99,
    inStock: true,
    categories: ["premium", "electronics"]
  },
  {
    name: "Product B",
    price: 149.99,
    inStock: true,
    categories: ["standard", "electronics"]
  },
  {
    name: "Product C",
    price: 99.99,
    inStock: false,
    categories: ["budget", "electronics"]
  }
];

// Example functions demonstrating admin database operations
async function adminCreateUser() {
  try {
    // Add a document with auto-generated ID
    const userId = await adminAddDocument('admin-users', userData);
    console.log(`Admin user created with ID: ${userId}`);
    return userId;
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

async function adminCreateProducts() {
  try {
    // Add multiple products with custom IDs using batch operations
    const operations = productBatch.map((product, index) => {
      const productId = `admin-prod-${index + 1}`;
      return ['set', 'admin-products', productId, product];
    });
    
    await adminBatchOperation(operations);
    console.log(`${operations.length} products created in batch`);
    
    return operations.map(op => op[2]); // Return the product IDs
  } catch (error) {
    console.error("Error creating products in batch:", error);
    return [];
  }
}

async function adminFetchUser(userId) {
  try {
    // Get a document by ID
    const user = await adminGetDocument('admin-users', userId);
    console.log("Admin user data:", user);
    return user;
  } catch (error) {
    console.error("Error fetching admin user:", error);
    return null;
  }
}

async function adminFetchAllProducts() {
  try {
    // Get all documents from a collection
    const products = await adminGetAllDocuments('admin-products');
    console.log("All admin products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
}

async function adminUpdateUserProfile(userId, updates) {
  try {
    // Update a document
    await adminUpdateDocument('admin-users', userId, updates);
    console.log(`Admin user ${userId} updated successfully`);
  } catch (error) {
    console.error("Error updating admin user:", error);
  }
}

async function adminRemoveProduct(productId) {
  try {
    // Delete a document
    await adminDeleteDocument('admin-products', productId);
    console.log(`Admin product ${productId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting admin product:", error);
  }
}

async function adminFindProducts(category, minPrice) {
  try {
    // Query documents with multiple conditions
    const products = await adminQueryDocuments(
      'admin-products',
      [
        ['categories', 'array-contains', category],
        ['price', '>=', minPrice]
      ],
      'price',
      'desc'
    );
    console.log(`Admin products in category ${category} with price >= ${minPrice}:`, products);
    return products;
  } catch (error) {
    console.error("Error querying admin products:", error);
    return [];
  }
}

// Example of running these admin functions
async function runAdminExamples() {
  // Create a new admin user
  const userId = await adminCreateUser();
  
  // Create products in batch
  const productIds = await adminCreateProducts();
  
  // Fetch the admin user we just created
  await adminFetchUser(userId);
  
  // Update admin user data
  await adminUpdateUserProfile(userId, { 
    role: "super-admin",
    lastLogin: new Date()
  });
  
  // Fetch all admin products
  await adminFetchAllProducts();
  
  // Query admin products by category and price
  await adminFindProducts("electronics", 100);
  
  // Clean up - delete one of the products we created
  if (productIds.length > 0) {
    await adminRemoveProduct(productIds[0]);
  }
}

// Comment out the line below if you want to import this file without running it
runAdminExamples().catch(console.error);

// Export functions for reuse
module.exports = {
  adminCreateUser,
  adminCreateProducts,
  adminFetchUser,
  adminFetchAllProducts,
  adminUpdateUserProfile,
  adminRemoveProduct,
  adminFindProducts
}; 