import { db } from "../config/firebase.js";
import { formatDate } from "../utils/helpers.js";

const getSortableValue = (value) => {
  if (value === undefined || value === null) return 0;

  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const dateTimestamp = new Date(value).getTime();
    if (!Number.isNaN(dateTimestamp)) return dateTimestamp;

    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? 0 : numericValue;
  }

  if (typeof value?.toDate === "function") {
    const timestamp = value.toDate().getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  if (typeof value?._seconds === "number") {
    return value._seconds * 1000;
  }

  return 0;
};

const sortProducts = (products, sortBy, sortOrder = "desc") => {
  if (!sortBy) return products;

  const direction = sortOrder === "asc" ? 1 : -1;
  return [...products].sort((a, b) => {
    const aValue = getSortableValue(a?.[sortBy]);
    const bValue = getSortableValue(b?.[sortBy]);

    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });
};

const PAID_PAYMENT_STATUSES = new Set(["paid", "success", "completed", "done"]);

const PAID_ORDER_STATUSES = new Set(["delivered", "completed"]);

const isPaidOrder = (order) => {
  const paymentStatus = String(order?.paymentStatus || "").toLowerCase();
  const status = String(order?.status || "").toLowerCase();
  return (
    PAID_PAYMENT_STATUSES.has(paymentStatus) || PAID_ORDER_STATUSES.has(status)
  );
};

const attachPaidSalesToProducts = async (products) => {
  if (!Array.isArray(products) || products.length === 0) return products;

  const productIds = new Set(products.map((p) => p.id));
  const salesByProductId = {};

  const ordersSnapshot = await db.collection("orders").get();
  ordersSnapshot.forEach((doc) => {
    const order = doc.data();
    if (!isPaidOrder(order)) return;

    const items = Array.isArray(order.items) ? order.items : [];
    items.forEach((item) => {
      const productId = item?.productId;
      if (!productId || !productIds.has(productId)) return;

      const quantity = Number(item?.quantity) || 1;
      salesByProductId[productId] =
        (salesByProductId[productId] || 0) + quantity;
    });
  });

  return products.map((product) => ({
    ...product,
    sales: salesByProductId[product.id] || 0,
  }));
};

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

    // Status filter: null means fetch all, undefined means default to active
    if (filters.status === null) {
      // Fetch all statuses (for admin)
      // Don't apply status filter
    } else if (filters.status) {
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

    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // "sales" is a computed field (not stored in Firestore) — must sort in-memory
    if (filters.sortBy === "sales") {
      const allSnapshot = await query.get();
      const total = allSnapshot.size;

      if (total === 0) {
        return {
          products: [],
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: 0,
            totalPages: 0,
          },
        };
      }

      const allProducts = allSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const withSales = await attachPaidSalesToProducts(allProducts);
      const sorted = sortProducts(
        withSales,
        "sales",
        filters.sortOrder || "desc",
      );
      const paginated = sorted.slice(skip, skip + limitNum);

      return {
        products: paginated,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      };
    }

    // Get total count
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    // Handle empty result
    if (total === 0) {
      return {
        products: [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          totalPages: 0,
        },
      };
    }

    let products;
    if (skip === 0 && limitNum >= total) {
      // Use existing snapshot
      products = totalSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      // Need to query again with pagination
      let paginatedQuery = db.collection("products");

      // Reapply all filters
      if (filters.category) {
        paginatedQuery = paginatedQuery.where(
          "category",
          "==",
          filters.category,
        );
      }
      if (filters.difficulty) {
        paginatedQuery = paginatedQuery.where(
          "difficulty",
          "==",
          filters.difficulty,
        );
      }
      // Status filter: null means fetch all, undefined means default to active
      if (filters.status === null) {
        // Fetch all statuses (for admin)
        // Don't apply status filter
      } else if (filters.status) {
        paginatedQuery = paginatedQuery.where("status", "==", filters.status);
      } else {
        paginatedQuery = paginatedQuery.where("status", "==", "active");
      }
      if (filters.minPrice) {
        paginatedQuery = paginatedQuery.where(
          "price",
          ">=",
          parseFloat(filters.minPrice),
        );
      }
      if (filters.maxPrice) {
        paginatedQuery = paginatedQuery.where(
          "price",
          "<=",
          parseFloat(filters.maxPrice),
        );
      }

      // Apply sorting if specified (only for Firestore-stored fields)
      if (filters.sortBy) {
        paginatedQuery = paginatedQuery.orderBy(
          filters.sortBy,
          filters.sortOrder || "desc",
        );
      }

      paginatedQuery = paginatedQuery.offset(skip).limit(limitNum);
      const snapshot = await paginatedQuery.get();
      products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    const sortedProducts = sortProducts(
      products,
      filters.sortBy,
      filters.sortOrder,
    );

    return {
      products: sortedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
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
