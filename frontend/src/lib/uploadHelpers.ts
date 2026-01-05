import { storage } from "./firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export interface UploadProgress {
  progress: number;
  url?: string;
  error?: string;
}

/**
 * Upload file to Firebase Storage
 * @param file - File to upload
 * @param path - Storage path (e.g., "products/image.jpg")
 * @param onProgress - Callback for upload progress
 * @returns Promise with download URL
 */
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      reject(new Error("File size must be less than 5MB"));
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      reject(new Error("Only JPG, PNG, and WebP images are allowed"));
      return;
    }

    // Create storage reference
    const storageRef = ref(storage, path);

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress callback
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        // Error callback
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        // Success callback
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Upload product image
 * @param file - Image file
 * @param productId - Product ID (optional, generates new if not provided)
 * @param onProgress - Progress callback
 * @returns Promise with download URL
 */
export const uploadProductImage = async (
  file: File,
  productId?: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const path = productId
    ? `products/${productId}/${fileName}`
    : `products/temp/${fileName}`;

  return uploadFile(file, path, onProgress);
};

/**
 * Delete file from Firebase Storage
 * @param url - Download URL of the file to delete
 */
export const deleteFile = async (url: string): Promise<void> => {
  try {
    // Extract path from URL
    const path = extractPathFromURL(url);
    if (!path) {
      throw new Error("Invalid file URL");
    }

    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Delete file error:", error);
    throw error;
  }
};

/**
 * Extract storage path from download URL
 */
const extractPathFromURL = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Firebase Storage URL format: /v0/b/{bucket}/o/{path}
    const match = pathname.match(/\/o\/(.+)$/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }

    return null;
  } catch (error) {
    console.error("Extract path error:", error);
    return null;
  }
};

/**
 * Generate unique filename
 */
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split(".").pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");

  return `${nameWithoutExt}-${timestamp}-${randomStr}.${ext}`;
};

/**
 * Validate image file
 */
export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, PNG, and WebP images are allowed",
    };
  }

  return { valid: true };
};
