import { db } from "../config/firebase.js";
import { formatDate } from "../utils/helpers.js";

/**
 * User Service - handles all user-related database operations
 */

// Get user by ID
export const getUserById = async (uid) => {
  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.exists) {
    return null;
  }
  return { id: userDoc.id, ...userDoc.data() };
};

// Get user by email
export const getUserByEmail = async (email) => {
  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

// Create new user
export const createUser = async (uid, userData) => {
  const newUser = {
    ...userData,
    role: userData.role || "user",
    createdAt: formatDate(),
    updatedAt: formatDate(),
  };

  await db.collection("users").doc(uid).set(newUser);
  return { id: uid, ...newUser };
};

// Update user
export const updateUser = async (uid, updateData) => {
  const updates = {
    ...updateData,
    updatedAt: formatDate(),
  };

  await db.collection("users").doc(uid).update(updates);
  return getUserById(uid);
};

// Delete user
export const deleteUser = async (uid) => {
  await db.collection("users").doc(uid).delete();
  return true;
};

// Get all users with pagination
export const getAllUsers = async (page = 1, limit = 10, filters = {}) => {
  let query = db.collection("users");

  // Apply filters
  if (filters.role) {
    query = query.where("role", "==", filters.role);
  }

  if (filters.search) {
    // Note: Firestore doesn't support full-text search
    // This is a simple implementation - consider using Algolia or similar for production
    query = query
      .where("email", ">=", filters.search)
      .where("email", "<=", filters.search + "\uf8ff");
  }

  // Get total count
  const totalSnapshot = await query.get();
  const total = totalSnapshot.size;

  // Apply pagination
  const skip = (page - 1) * limit;
  query = query.orderBy("createdAt", "desc").offset(skip).limit(limit);

  const snapshot = await query.get();
  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Update user role
export const updateUserRole = async (uid, role) => {
  return updateUser(uid, { role });
};

// Get user stats
export const getUserStats = async () => {
  const usersSnapshot = await db.collection("users").get();
  const users = usersSnapshot.docs.map((doc) => doc.data());

  return {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
  };
};
