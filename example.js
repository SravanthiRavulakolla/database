// Example of using Firebase database functions
const {
  addDocument,
  setDocument,
  getDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  queryDocuments
} = require('./firebase-db');

// Example data
const userData = {
  name: "John Doe",
  email: "john@example.com",
  role: "user",
  createdAt: new Date()
};

const productData = {
  name: "Product 1",
  price: 99.99,
  inStock: true,
  categories: ["electronics", "gadgets"]
};

// Example functions demonstrating database operations
async function createUser() {
  try {
    // Add a document with auto-generated ID
    const userId = await addDocument('users', userData);
    console.log(`User created with ID: ${userId}`);
    return userId;
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

async function createProduct(productId) {
  try {
    // Set a document with specific ID
    await setDocument('products', productId, productData);
    console.log(`Product created with ID: ${productId}`);
  } catch (error) {
    console.error("Error creating product:", error);
  }
}

async function fetchUser(userId) {
  try {
    // Get a document by ID
    const user = await getDocument('users', userId);
    console.log("User data:", user);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function fetchAllProducts() {
  try {
    // Get all documents from a collection
    const products = await getAllDocuments('products');
    console.log("All products:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function updateUserProfile(userId, updates) {
  try {
    // Update a document
    await updateDocument('users', userId, updates);
    console.log(`User ${userId} updated successfully`);
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

async function removeProduct(productId) {
  try {
    // Delete a document
    await deleteDocument('products', productId);
    console.log(`Product ${productId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

async function findProductsByCategory(category) {
  try {
    // Query documents with conditions
    const products = await queryDocuments(
      'products',
      [['categories', 'array-contains', category]],
      'price',
      'asc'
    );
    console.log(`Products in category ${category}:`, products);
    return products;
  } catch (error) {
    console.error("Error querying products:", error);
    return [];
  }
}

// Example of running these functions
async function runExamples() {
  // Create a new user
  const userId = await createUser();
  
  // Create a product with custom ID
  const productId = "prod-123";
  await createProduct(productId);
  
  // Fetch the user we just created
  await fetchUser(userId);
  
  // Update user data
  await updateUserProfile(userId, { 
    role: "admin",
    lastLogin: new Date()
  });
  
  // Fetch all products
  await fetchAllProducts();
  
  // Query products by category
  await findProductsByCategory("electronics");
  
  // Clean up - delete the product we created
  await removeProduct(productId);
}

// Comment out the line below if you want to import this file without running it
runExamples().catch(console.error);

// Export functions for reuse
module.exports = {
  createUser,
  createProduct,
  fetchUser,
  fetchAllProducts,
  updateUserProfile,
  removeProduct,
  findProductsByCategory
}; 