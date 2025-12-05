// Response helpers
export const sendSuccess = (
  res,
  data,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res,
  message = "Error",
  statusCode = 500,
  error = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || error,
  });
};

// Pagination helper
export const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return {
    skip,
    limit: parseInt(limit),
    page: parseInt(page),
  };
};

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Format date to ISO string
export const formatDate = (date = new Date()) => {
  return date.toISOString();
};

// Sanitize user data (remove sensitive fields)
export const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

// Check if string is valid email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if string is valid phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

// Mask sensitive data
export const maskString = (str, visibleChars = 4) => {
  if (!str || str.length <= visibleChars) return str;
  return str.slice(0, visibleChars) + "****";
};

// Deep merge objects
export const deepMerge = (target, source) => {
  const result = { ...target };
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};
