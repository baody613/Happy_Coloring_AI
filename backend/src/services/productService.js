import { db } from "../config/firebase.js";
import { formatDate } from "../utils/helpers.js";

/**
 * Product Service - handles all product-related database operations
 */

// Get product by ID
export const getProductById = async (productId) => {
  const productDoc = await db.collection("products").doc(productId).get();
  if (!productDoc.exists) {
    return null;
  }
  return { id: productDoc.id, ...productDoc.data() };
};

// Get all products with pagination and filters
export const getAllProducts = async (page = 1, limit = 10, filters = {}) => {
  let query = db.collection("products");

  // Apply filters
  if (filters.category) {
    query = query.where("category", "==", filters.category);
  }

  if (filters.difficulty) {
    query = query.where("difficulty", "==", filters.difficulty);
  }

  if (filters.status) {
    query = query.where("status", "==", filters.status);
  } else {
    // Default: only active products
    query = query.where("status", "==", "active");
  }

  // Price range
  if (filters.minPrice) {
    query = query.where("price", ">=", parseFloat(filters.minPrice));
  }

  if (filters.maxPrice) {
    query = query.where("price", "<=", parseFloat(filters.maxPrice));
  }

  // Get total count
  const totalSnapshot = await query.get();
  const total = totalSnapshot.size;

  // Apply sorting
  const sortBy = filters.sortBy || "createdAt";
  const sortOrder = filters.sortOrder || "desc";
  query = query.orderBy(sortBy, sortOrder);

  // Apply pagination
  const skip = (page - 1) * limit;
  query = query.offset(skip).limit(limit);

  const snapshot = await query.get();
  const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Create new product
export const createProduct = async (productData) => {
  const newProduct = {
    ...productData,
    status: productData.status || "active",
    createdAt: formatDate(),
    updatedAt: formatDate(),
  };

  const docRef = await db.collection("products").add(newProduct);
  return { id: docRef.id, ...newProduct };
};

// Update product
export const updateProduct = async (productId, updateData) => {
  const product = await getProductById(productId);
  if (!product) {
    return null;
  }

  const updates = {
    ...updateData,
    updatedAt: formatDate(),
  };

  await db.collection("products").doc(productId).update(updates);
  return getProductById(productId);
};

// Delete product (soft delete)
export const deleteProduct = async (productId) => {
  return updateProduct(productId, { status: "deleted" });
};

// Get product stats
export const getProductStats = async () => {
  const productsSnapshot = await db.collection("products").get();
  const products = productsSnapshot.docs.map((doc) => doc.data());

  return {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    inactive: products.filter((p) => p.status === "inactive").length,
    deleted: products.filter((p) => p.status === "deleted").length,
  };
};

// Get categories
export const getCategories = async () => {
  const productsSnapshot = await db
    .collection("products")
    .where("status", "==", "active")
    .get();

  const categories = new Set();
  productsSnapshot.forEach((doc) => {
    const category = doc.data().category;
    if (category) {
      categories.add(category);
    }
  });

  return Array.from(categories);
};
