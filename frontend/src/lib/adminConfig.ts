// Admin email configuration
export const ADMIN_EMAILS = [
  'admin@yulingstore.com',
  // Add more admin emails here if needed
];

export const isAdmin = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
