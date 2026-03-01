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
  try {
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

    // Handle empty result
    if (total === 0) {
      return {
        products: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0,
        },
      };
    }

    // For pagination, use the results we already have if within first page
    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit);
    
    let products;
    if (skip === 0 && limitNum >= total) {
      // Use existing snapshot
      products = totalSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } else {
      // Need to query again with pagination
      let paginatedQuery = db.collection("products");
      
      // Reapply all filters
      if (filters.category) {
        paginatedQuery = paginatedQuery.where("category", "==", filters.category);
      }
      if (filters.difficulty) {
        paginatedQuery = paginatedQuery.where("difficulty", "==", filters.difficulty);
      }
      if (filters.status) {
        paginatedQuery = paginatedQuery.where("status", "==", filters.status);
      } else {
        paginatedQuery = paginatedQuery.where("status", "==", "active");
      }
      if (filters.minPrice) {
        paginatedQuery = paginatedQuery.where("price", ">=", parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        paginatedQuery = paginatedQuery.where("price", "<=", parseFloat(filters.maxPrice));
      }
      
      // Apply sorting if specified
      if (filters.sortBy) {
        paginatedQuery = paginatedQuery.orderBy(filters.sortBy, filters.sortOrder || "desc");
      }
      
      paginatedQuery = paginatedQuery.offset(skip).limit(limitNum);
      const snapshot = await paginatedQuery.get();
      products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("getAllProducts error:", error);
    // Return empty result on error instead of throwing
    return {
      products: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        totalPages: 0,
      },
    };
  }
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
