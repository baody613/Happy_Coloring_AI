import Joi from "joi";

// ---- Reusable field fragments ----
const f = {
  requiredEmail: Joi.string().email().required().messages({
    "string.email": "Email khong hop le",
    "any.required": "Email la bat buoc",
  }),
  optionalEmail: Joi.string().email(),
  password: Joi.string().min(6).required().messages({
    "string.min": "Mat khau phai co it nhat 6 ky tu",
    "any.required": "Mat khau la bat buoc",
  }),
};

const req = (msg) =>
  Joi.string().required().messages({ "any.required": msg });

// ---- User schemas ----
export const registerSchema = Joi.object({
  email: f.requiredEmail,
  password: f.password,
  displayName: req("Ten hien thi la bat buoc"),
});

export const loginSchema = Joi.object({
  email: f.requiredEmail,
  password: Joi.string().required(),
});

// ---- Product schemas ----
const productBase = {
  title: Joi.string(),
  description: Joi.string().allow(""),
  category: Joi.string().allow(""),
  price: Joi.number()
    .min(0)
    .messages({ "number.min": "Gia phai lon hon hoac bang 0" }),
  originalPrice: Joi.number().min(0).optional(),
  discountPercent: Joi.number().min(0).max(100).optional(),
  imageUrl: Joi.string(),
  thumbnailUrl: Joi.string().allow(""),
  difficulty: Joi.string().valid("easy", "medium", "hard"),
  dimensions: Joi.object({
    width: Joi.number(),
    height: Joi.number(),
    unit: Joi.string().default("cm"),
  }).optional(),
  colors: Joi.number().min(1).optional(),
};

export const createProductSchema = Joi.object({
  ...productBase,
  title: req("Tieu de la bat buoc"),
  price: productBase.price.required().messages({
    "number.min": "Gia phai lon hon hoac bang 0",
    "any.required": "Gia la bat buoc",
  }),
  imageUrl: req("Hinh anh la bat buoc"),
  difficulty: Joi.string().valid("easy", "medium", "hard").default("medium"),
});

export const updateProductSchema = Joi.object({
  ...productBase,
  status: Joi.string().valid("active", "inactive", "deleted"),
}).min(1);

// ---- Order schema ----
export const createOrderSchema = Joi.object({
  userId: Joi.string().optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
        title: Joi.string().optional(),
        imageUrl: Joi.string().optional(),
        category: Joi.string().optional(),
        isAIProduct: Joi.boolean().optional(),
      })
    )
    .min(1)
    .required(),
  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    district: Joi.string().allow(""),
    ward: Joi.string().allow(""),
  }).required(),
  totalAmount: Joi.number().min(0).required(),
  originalAmount: Joi.number().min(0).optional(),
  voucherCode: Joi.string().allow("", null).optional(),
  voucherDiscount: Joi.number().min(0).optional(),
  note: Joi.string().allow("").optional(),
  paymentMethod: Joi.string()
    .valid("cod", "vnpay", "momo", "banking")
    .required(),
  status: Joi.string().optional(),
  createdAt: Joi.string().optional(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipping", "delivered", "cancelled")
    .required(),
});

// ---- Settings schemas ----
export const systemSettingsSchema = Joi.object({
  siteName: Joi.string(),
  siteDescription: Joi.string(),
  maintenanceMode: Joi.boolean(),
  allowRegistration: Joi.boolean(),
  maxImageSize: Joi.number().min(1),
  defaultCurrency: Joi.string().valid("VND", "USD"),
  taxRate: Joi.number().min(0).max(100),
  shippingFee: Joi.number().min(0),
});

export const paymentSettingsSchema = Joi.object({
  paymentMethods: Joi.object({
    cod: Joi.boolean(),
    vnpay: Joi.boolean(),
    momo: Joi.boolean(),
    banking: Joi.boolean(),
  }),
  vnpayConfig: Joi.object({
    tmnCode: Joi.string().allow(""),
    hashSecret: Joi.string().allow(""),
    url: Joi.string().uri().allow(""),
  }),
  momoConfig: Joi.object({
    partnerCode: Joi.string().allow(""),
    accessKey: Joi.string().allow(""),
    secretKey: Joi.string().allow(""),
  }),
  bankingInfo: Joi.object({
    bankName: Joi.string().allow(""),
    accountNumber: Joi.string().allow(""),
    accountName: Joi.string().allow(""),
    qrImageUrl: Joi.string().uri().allow(""),
  }),
});

export const emailSettingsSchema = Joi.object({
  smtpHost: Joi.string(),
  smtpPort: Joi.number().min(1).max(65535),
  smtpUser: f.optionalEmail,
  smtpPassword: Joi.string().allow(""),
  fromEmail: f.optionalEmail,
  fromName: Joi.string(),
  emailNotifications: Joi.object({
    orderConfirmation: Joi.boolean(),
    orderStatusUpdate: Joi.boolean(),
    newUserRegistration: Joi.boolean(),
    passwordReset: Joi.boolean(),
  }),
});

// ---- Validation middleware factory ----
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (!error) return next();

  const fieldErrors = error.details.map(({ path, message }) => ({
    field: path.join("."),
    message,
  }));

  console.error("Validation error on", req.path, JSON.stringify(fieldErrors));
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: fieldErrors,
  });
};
