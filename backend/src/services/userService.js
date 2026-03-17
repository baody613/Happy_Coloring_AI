import { db, auth } from "../config/firebase.js";
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

// Update user (uses set+merge so it works even if document doesn't exist yet)
export const updateUser = async (uid, updateData) => {
  const updates = {
    ...updateData,
    updatedAt: formatDate(),
  };

  await db.collection("users").doc(uid).set(updates, { merge: true });
  return getUserById(uid);
};

// Delete user
export const deleteUser = async (uid) => {
  await db.collection("users").doc(uid).delete();
  return true;
};

// Get all users with pagination — source of truth: Firebase Auth
export const getAllUsers = async (page = 1, limit = 10, filters = {}) => {
  // Fetch all Auth users (listUsers supports up to 1000 per call)
  let allAuthUsers = [];
  let nextPageToken;
  do {
    const result = await auth.listUsers(1000, nextPageToken);
    allAuthUsers = allAuthUsers.concat(result.users);
    nextPageToken = result.pageToken;
  } while (nextPageToken);

  // Fetch Firestore profiles for extra fields (phone, address, role, createdAt)
  const firestoreSnap = await db.collection("users").get();
  const firestoreMap = {};
  firestoreSnap.forEach((doc) => {
    firestoreMap[doc.id] = doc.data();
  });

  // Merge Auth + Firestore
  let users = allAuthUsers.map((authUser) => {
    const profile = firestoreMap[authUser.uid] || {};
    return {
      id: authUser.uid,
      email: authUser.email || "",
      displayName: authUser.displayName || profile.displayName || "",
      phoneNumber: authUser.phoneNumber || profile.phoneNumber || "",
      address: profile.address || "",
      disabled: authUser.disabled || false,
      role: profile.role || "user",
      createdAt: authUser.metadata.creationTime || profile.createdAt || "",
      updatedAt: profile.updatedAt || "",
    };
  });

  // Apply filters
  if (filters.search) {
    const q = filters.search.toLowerCase();
    users = users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.displayName && u.displayName.toLowerCase().includes(q)),
    );
  }
  if (filters.role) {
    users = users.filter((u) => u.role === filters.role);
  }

  // Sort newest first
  users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = users.length;
  const skip = (page - 1) * limit;
  const paged = users.slice(skip, skip + limit);

  return {
    users: paged,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

// Update user role
export const updateUserRole = async (uid, role) => {
  return updateUser(uid, { role });
};

// Get user stats
export const getUserStats = async () => {
  let allAuthUsers = [];
  let nextPageToken;
  do {
    const result = await auth.listUsers(1000, nextPageToken);
    allAuthUsers = allAuthUsers.concat(result.users);
    nextPageToken = result.pageToken;
  } while (nextPageToken);

  const firestoreSnap = await db.collection("users").get();
  const firestoreMap = {};
  firestoreSnap.forEach((doc) => {
    firestoreMap[doc.id] = doc.data();
  });

  const adminEmails = (
    process.env.ADMIN_EMAILS || "admin@yulingstore.com,baody613@gmail.com"
  )
    .split(",")
    .map((e) => e.trim().toLowerCase());

  const admins = allAuthUsers.filter(
    (u) =>
      adminEmails.includes((u.email || "").toLowerCase()) ||
      (firestoreMap[u.uid] && firestoreMap[u.uid].role === "admin"),
  ).length;

  return {
    total: allAuthUsers.length,
    admins,
    users: allAuthUsers.length - admins,
  };
};
