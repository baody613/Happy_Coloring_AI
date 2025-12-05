import Joi from "joi";

// User validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "any.required": "Mật khẩu là bắt buộc",
  }),
  displayName: Joi.string().required().messages({
    "any.required": "Tên hiển thị là bắt buộc",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Product validation schemas
export const createProductSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Tiêu đề là bắt buộc",
  }),
  description: Joi.string().allow(""),
  category: Joi.string().allow(""),
  price: Joi.number().min(0).required().messages({
    "number.min": "Giá phải lớn hơn hoặc bằng 0",
    "any.required": "Giá là bắt buộc",
  }),
  imageUrl: Joi.string().uri().required().messages({
    "string.uri": "URL hình ảnh không hợp lệ",
    "any.required": "Hình ảnh là bắt buộc",
  }),
  thumbnailUrl: Joi.string().uri().allow(""),
  difficulty: Joi.string().valid("easy", "medium", "hard").default("medium"),
  dimensions: Joi.object({
    width: Joi.number().required(),
    height: Joi.number().required(),
    unit: Joi.string().default("cm"),
  }).optional(),
  colors: Joi.number().min(1).optional(),
});

export const updateProductSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(""),
  category: Joi.string().allow(""),
  price: Joi.number().min(0),
  imageUrl: Joi.string().uri(),
  thumbnailUrl: Joi.string().uri().allow(""),
  difficulty: Joi.string().valid("easy", "medium", "hard"),
  status: Joi.string().valid("active", "inactive", "deleted"),
  dimensions: Joi.object({
    width: Joi.number(),
    height: Joi.number(),
    unit: Joi.string(),
  }),
  colors: Joi.number().min(1),
}).min(1);

// Order validation schemas
export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required(),
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
  paymentMethod: Joi.string()
    .valid("cod", "vnpay", "momo", "banking")
    .required(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipping", "delivered", "cancelled")
    .required(),
});

// Settings validation schemas
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
  }),
});

export const emailSettingsSchema = Joi.object({
  smtpHost: Joi.string(),
  smtpPort: Joi.number().min(1).max(65535),
  smtpUser: Joi.string().email(),
  smtpPassword: Joi.string().allow(""),
  fromEmail: Joi.string().email(),
  fromName: Joi.string(),
  emailNotifications: Joi.object({
    orderConfirmation: Joi.boolean(),
    orderStatusUpdate: Joi.boolean(),
    newUserRegistration: Joi.boolean(),
    passwordReset: Joi.boolean(),
  }),
});

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};
