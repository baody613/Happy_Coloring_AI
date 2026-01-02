import { storage } from "../config/firebase.js";

/**
 * Upload file to Firebase Storage from backend
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} folder - Storage folder (default: "products")
 * @returns {Promise<string>} Download URL
 */
export const uploadToStorage = async (
  fileBuffer,
  fileName,
  folder = "products"
) => {
  try {
    const bucket = storage.bucket();
    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${folder}/${timestamp}-${safeName}`;

    const file = bucket.file(filePath);

    // Upload file
    await file.save(fileBuffer, {
      metadata: {
        contentType: getContentType(fileName),
        metadata: {
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Make file publicly accessible
    await file.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    return publicUrl;
  } catch (error) {
    console.error("Upload to storage error:", error);
    throw new Error("Failed to upload file to storage");
  }
};

/**
 * Delete file from Firebase Storage
 * @param {string} url - File URL
 */
export const deleteFromStorage = async (url) => {
  try {
    const bucket = storage.bucket();
    const path = extractPathFromURL(url, bucket.name);

    if (!path) {
      throw new Error("Invalid file URL");
    }

    const file = bucket.file(path);
    await file.delete();

    console.log(`File deleted: ${path}`);
  } catch (error) {
    console.error("Delete from storage error:", error);
    throw new Error("Failed to delete file from storage");
  }
};

/**
 * Get content type from file name
 */
const getContentType = (fileName) => {
  const ext = fileName.split(".").pop().toLowerCase();

  const contentTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    pdf: "application/pdf",
  };

  return contentTypes[ext] || "application/octet-stream";
};

/**
 * Extract storage path from public URL
 */
const extractPathFromURL = (url, bucketName) => {
  try {
    const urlObj = new URL(url);

    // Firebase Storage public URL format
    // https://storage.googleapis.com/{bucket}/{path}
    if (urlObj.hostname === "storage.googleapis.com") {
      const pathMatch = urlObj.pathname.match(new RegExp(`/${bucketName}/(.+)`));
      if (pathMatch && pathMatch[1]) {
        return decodeURIComponent(pathMatch[1]);
      }
    }

    // Firebase Download URL format
    // https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}
    if (urlObj.hostname === "firebasestorage.googleapis.com") {
      const pathMatch = urlObj.pathname.match(/\/o\/(.+)$/);
      if (pathMatch && pathMatch[1]) {
        return decodeURIComponent(pathMatch[1].split("?")[0]);
      }
    }

    return null;
  } catch (error) {
    console.error("Extract path error:", error);
    return null;
  }
};

/**
 * Validate file buffer
 */
export const validateFile = (buffer, maxSize = 5 * 1024 * 1024) => {
  if (!buffer) {
    return { valid: false, error: "No file provided" };
  }

  if (buffer.length > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
};
