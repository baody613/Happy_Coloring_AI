import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Happy Coloring AI – API Docs",
      version: "1.0.0",
      description:
        "REST API cho nền tảng tranh tô màu theo số tích hợp AI.\n\n" +
        "**Cách dùng:** Đăng nhập qua `/api/auth/login` → copy `token` → nhấn **Authorize** ở trên → dán vào ô `Bearer <token>`.",
    },
    servers: [
      { url: "http://localhost:5000", description: "Local development" },
      {
        url: "https://happy-coloring-ai.onrender.com",
        description: "Production (Render)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Firebase ID Token lấy từ response của /api/auth/login",
        },
      },
      schemas: {
        // ─── Auth ───────────────────────────────────────────────
        RegisterRequest: {
          type: "object",
          required: ["email", "password", "displayName"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "123456" },
            displayName: { type: "string", example: "Nguyễn Văn A" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "123456" },
          },
        },
        // ─── Product ────────────────────────────────────────────
        Product: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string", example: "Tranh Mèo Dễ Thương" },
            description: { type: "string" },
            price: { type: "number", example: 150000 },
            category: { type: "string", example: "animals" },
            difficulty: {
              type: "string",
              enum: ["easy", "medium", "hard"],
              example: "easy",
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              example: "active",
            },
            imageUrl: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateProductRequest: {
          type: "object",
          required: ["title", "price", "category", "difficulty"],
          properties: {
            title: { type: "string", example: "Tranh Phong Cảnh Núi" },
            description: {
              type: "string",
              example: "Tranh phong cảnh núi non",
            },
            price: { type: "number", example: 200000 },
            category: { type: "string", example: "landscape" },
            difficulty: {
              type: "string",
              enum: ["easy", "medium", "hard"],
              example: "medium",
            },
            status: {
              type: "string",
              enum: ["active", "inactive"],
              example: "active",
            },
          },
        },
        // ─── Order ──────────────────────────────────────────────
        CreateOrderRequest: {
          type: "object",
          required: ["items", "shippingAddress", "paymentMethod"],
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "integer", example: 1 },
                  price: { type: "number", example: 150000 },
                },
              },
            },
            shippingAddress: {
              type: "object",
              properties: {
                fullName: { type: "string", example: "Nguyễn Văn A" },
                phone: { type: "string", example: "0901234567" },
                address: { type: "string", example: "123 Lê Lợi" },
                city: { type: "string", example: "TP.HCM" },
              },
            },
            paymentMethod: {
              type: "string",
              enum: ["cod", "vnpay", "momo", "banking"],
              example: "cod",
            },
            voucherCode: { type: "string", example: "YULING10" },
          },
        },
        // ─── Generate ───────────────────────────────────────────
        GenerateRequest: {
          type: "object",
          required: ["prompt"],
          properties: {
            prompt: {
              type: "string",
              maxLength: 500,
              example: "Một chú mèo đang ngồi trên mái nhà nhìn ra biển",
            },
            style: {
              type: "string",
              example: "realistic",
              default: "realistic",
            },
            complexity: {
              type: "string",
              enum: ["easy", "medium", "hard"],
              default: "medium",
              example: "medium",
            },
          },
        },
        // ─── Chat ───────────────────────────────────────────────
        ChatRequest: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              example: "Cho tôi xem các tranh loại dễ giá dưới 100k",
            },
            history: {
              type: "array",
              description: "Lịch sử chat (tối đa 20 tin nhắn gần nhất)",
              items: {
                type: "object",
                properties: {
                  sender: {
                    type: "string",
                    enum: ["user", "bot"],
                  },
                  text: { type: "string" },
                },
              },
            },
          },
        },
        // ─── Common Responses ───────────────────────────────────
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Unauthorized" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
            message: { type: "string" },
          },
        },
      },
    },
    // Security mặc định cho tất cả route (ghi đè ở từng route nếu cần)
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Đăng ký / đăng nhập / hồ sơ" },
      { name: "Products", description: "Danh sách & quản lý sản phẩm" },
      { name: "Orders", description: "Tạo & theo dõi đơn hàng" },
      { name: "Generate AI", description: "Tạo tranh tô màu bằng AI" },
      { name: "Chat", description: "Chatbot tư vấn AI" },
      { name: "Payment", description: "Thanh toán VNPay / MoMo" },
      { name: "Users", description: "Hồ sơ người dùng" },
      {
        name: "Password Reset",
        description: "Đặt lại mật khẩu qua email",
      },
      { name: "Admin", description: "Quản trị (yêu cầu quyền admin)" },
    ],
    paths: {
      // ══════════════════════════════════════════════
      // AUTH
      // ══════════════════════════════════════════════
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Đăng ký tài khoản mới",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            201: { description: "Tạo tài khoản thành công" },
            400: { description: "Thiếu email hoặc password" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Đăng nhập → lấy Firebase ID Token",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Đăng nhập thành công, trả về token",
              content: {
                "application/json": {
                  example: {
                    token: "eyJhbGciOiJSUzI1NiIsI...",
                    user: {
                      uid: "abc123",
                      email: "user@example.com",
                      displayName: "Nguyễn Văn A",
                    },
                  },
                },
              },
            },
            401: { description: "Sai email hoặc mật khẩu" },
          },
        },
      },
      "/api/auth/profile": {
        get: {
          tags: ["Auth"],
          summary: "Lấy thông tin hồ sơ người dùng hiện tại",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Thông tin người dùng" },
            401: { description: "Chưa đăng nhập" },
          },
        },
      },
      // ══════════════════════════════════════════════
      // PRODUCTS
      // ══════════════════════════════════════════════
      "/api/products": {
        get: {
          tags: ["Products"],
          summary: "Lấy danh sách sản phẩm (public)",
          security: [],
          parameters: [
            {
              name: "category",
              in: "query",
              schema: { type: "string" },
              example: "animals",
            },
            {
              name: "difficulty",
              in: "query",
              schema: { type: "string", enum: ["easy", "medium", "hard"] },
            },
            {
              name: "minPrice",
              in: "query",
              schema: { type: "number" },
              example: 50000,
            },
            {
              name: "maxPrice",
              in: "query",
              schema: { type: "number" },
              example: 300000,
            },
            {
              name: "sortBy",
              in: "query",
              schema: { type: "string" },
              example: "price",
            },
            {
              name: "sortOrder",
              in: "query",
              schema: { type: "string", enum: ["asc", "desc"] },
            },
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
            },
          ],
          responses: {
            200: {
              description: "Trả về danh sách sản phẩm và thông tin phân trang",
            },
          },
        },
        post: {
          tags: ["Products"],
          summary: "Tạo sản phẩm mới (Admin)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProductRequest" },
              },
            },
          },
          responses: {
            201: { description: "Tạo sản phẩm thành công" },
            401: { description: "Chưa đăng nhập" },
            403: { description: "Không có quyền admin" },
          },
        },
      },
      "/api/products/categories": {
        get: {
          tags: ["Products"],
          summary: "Lấy danh sách các danh mục sản phẩm",
          security: [],
          responses: {
            200: { description: "Danh sách categories" },
          },
        },
      },
      "/api/products/{id}": {
        get: {
          tags: ["Products"],
          summary: "Lấy chi tiết 1 sản phẩm",
          security: [],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Thông tin sản phẩm" },
            404: { description: "Không tìm thấy" },
          },
        },
        put: {
          tags: ["Products"],
          summary: "Cập nhật sản phẩm (Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProductRequest" },
              },
            },
          },
          responses: {
            200: { description: "Cập nhật thành công" },
            403: { description: "Không có quyền admin" },
          },
        },
        delete: {
          tags: ["Products"],
          summary: "Xóa sản phẩm (Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Xóa thành công" },
            403: { description: "Không có quyền admin" },
          },
        },
      },
      // ══════════════════════════════════════════════
      // ORDERS
      // ══════════════════════════════════════════════
      "/api/orders": {
        post: {
          tags: ["Orders"],
          summary: "Tạo đơn hàng mới",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateOrderRequest" },
              },
            },
          },
          responses: {
            201: { description: "Tạo đơn hàng thành công" },
            400: { description: "Dữ liệu không hợp lệ" },
            401: { description: "Chưa đăng nhập" },
          },
        },
      },
      "/api/orders/validate-voucher": {
        post: {
          tags: ["Orders"],
          summary: "Kiểm tra mã giảm giá (public)",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { code: "YULING10" },
              },
            },
          },
          responses: {
            200: {
              description: "Kết quả kiểm tra voucher",
              content: {
                "application/json": {
                  example: { valid: true, discount: 10 },
                },
              },
            },
          },
        },
      },
      "/api/orders/user/{userId}": {
        get: {
          tags: ["Orders"],
          summary: "Lấy danh sách đơn hàng của người dùng",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "userId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Danh sách đơn hàng" },
            403: { description: "Không có quyền xem đơn của người khác" },
          },
        },
      },
      "/api/orders/{id}": {
        get: {
          tags: ["Orders"],
          summary: "Lấy chi tiết 1 đơn hàng",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Chi tiết đơn hàng" },
            404: { description: "Không tìm thấy" },
          },
        },
        put: {
          tags: ["Orders"],
          summary: "Cập nhật trạng thái đơn hàng (Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { status: "processing" },
              },
            },
          },
          responses: {
            200: { description: "Cập nhật thành công" },
          },
        },
      },
      "/api/orders/{id}/cancel": {
        put: {
          tags: ["Orders"],
          summary: "Hủy đơn hàng",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Hủy đơn thành công" },
          },
        },
      },
      // ══════════════════════════════════════════════
      // GENERATE AI
      // ══════════════════════════════════════════════
      "/api/generate/paint-by-numbers": {
        post: {
          tags: ["Generate AI"],
          summary: "Bắt đầu tạo tranh tô màu bằng AI",
          description:
            "Trả về **202 Accepted** ngay lập tức kèm `generationId`. " +
            "Dùng generationId để poll trạng thái tại `/api/generate/status/{id}` mỗi 5 giây.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GenerateRequest" },
              },
            },
          },
          responses: {
            202: {
              description: "Yêu cầu đã được nhận, đang xử lý",
              content: {
                "application/json": {
                  example: {
                    message: "Generation started",
                    generationId: "abc123xyz",
                    status: "processing",
                  },
                },
              },
            },
            400: {
              description: "Thiếu prompt hoặc prompt quá dài (>500 ký tự)",
            },
            401: { description: "Chưa đăng nhập" },
          },
        },
      },
      "/api/generate/status/{generationId}": {
        get: {
          tags: ["Generate AI"],
          summary: "Kiểm tra trạng thái tạo tranh",
          description:
            "Poll mỗi 5 giây. Khi `status = completed` → lấy `imageUrl` để hiển thị ảnh.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "generationId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "ID trả về từ POST /api/generate/paint-by-numbers",
            },
          ],
          responses: {
            200: {
              description: "Trạng thái hiện tại",
              content: {
                "application/json": {
                  examples: {
                    processing: {
                      summary: "Đang xử lý",
                      value: {
                        id: "abc123",
                        status: "processing",
                        prompt: "chú mèo trên mái nhà",
                      },
                    },
                    completed: {
                      summary: "Hoàn thành",
                      value: {
                        id: "abc123",
                        status: "completed",
                        imageUrl: "https://storage.googleapis.com/...",
                      },
                    },
                    failed: {
                      summary: "Thất bại",
                      value: {
                        id: "abc123",
                        status: "failed",
                        error: "AI API error",
                      },
                    },
                  },
                },
              },
            },
            403: { description: "Không phải chủ sở hữu generation này" },
            404: { description: "Không tìm thấy generationId" },
          },
        },
      },
      // ══════════════════════════════════════════════
      // CHAT
      // ══════════════════════════════════════════════
      "/api/chat": {
        post: {
          tags: ["Chat"],
          summary: "Gửi tin nhắn tới chatbot AI",
          description:
            "AI sẽ trả lời bằng tiếng Việt, có context về sản phẩm thực tế trong cửa hàng.",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChatRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Phản hồi từ AI",
              content: {
                "application/json": {
                  example: {
                    success: true,
                    response: {
                      text: "Chào bạn! Hiện cửa hàng có tranh mèo dễ thương giá 80.000đ 🐱",
                    },
                  },
                },
              },
            },
          },
        },
      },
      // ══════════════════════════════════════════════
      // PAYMENT
      // ══════════════════════════════════════════════
      "/api/payment/create-vnpay": {
        post: {
          tags: ["Payment"],
          summary: "Tạo URL thanh toán VNPay",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: {
                  orderId: "order_123",
                  amount: 150000,
                  orderInfo: "Thanh toan don hang 123",
                },
              },
            },
          },
          responses: {
            200: {
              description: "URL redirect VNPay",
              content: {
                "application/json": {
                  example: { paymentUrl: "https://sandbox.vnpayment.vn/..." },
                },
              },
            },
          },
        },
      },
      "/api/payment/create-momo": {
        post: {
          tags: ["Payment"],
          summary: "Tạo URL thanh toán MoMo",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { orderId: "order_123", amount: 150000 },
              },
            },
          },
          responses: {
            200: {
              description: "URL redirect MoMo",
              content: {
                "application/json": {
                  example: { payUrl: "https://test-payment.momo.vn/..." },
                },
              },
            },
          },
        },
      },
      "/api/payment/vnpay-return": {
        get: {
          tags: ["Payment"],
          summary: "VNPay callback sau thanh toán (VNPay gọi tự động)",
          security: [],
          parameters: [
            {
              name: "vnp_ResponseCode",
              in: "query",
              schema: { type: "string" },
              example: "00",
            },
            {
              name: "vnp_SecureHash",
              in: "query",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Xác minh chữ ký HMAC và cập nhật đơn hàng" },
          },
        },
      },
      "/api/payment/momo-callback": {
        post: {
          tags: ["Payment"],
          summary: "MoMo callback sau thanh toán (MoMo gọi tự động)",
          security: [],
          responses: {
            200: {
              description: "Xác minh chữ ký HMAC-SHA256 và cập nhật đơn hàng",
            },
          },
        },
      },
      // ══════════════════════════════════════════════
      // USERS
      // ══════════════════════════════════════════════
      "/api/users/me": {
        get: {
          tags: ["Users"],
          summary: "Lấy thông tin người dùng hiện tại từ Firestore",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Thông tin user" },
            401: { description: "Chưa đăng nhập" },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Cập nhật thông tin cá nhân",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { displayName: "Tên Mới", phone: "0901234567" },
              },
            },
          },
          responses: {
            200: { description: "Cập nhật thành công" },
          },
        },
      },
      // ══════════════════════════════════════════════
      // PASSWORD RESET
      // ══════════════════════════════════════════════
      "/api/password-reset/request": {
        post: {
          tags: ["Password Reset"],
          summary: "Gửi email đặt lại mật khẩu",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                example: { email: "user@example.com" },
              },
            },
          },
          responses: {
            200: { description: "Email đã được gửi nếu tài khoản tồn tại" },
          },
        },
      },
      // ══════════════════════════════════════════════
      // ADMIN
      // ══════════════════════════════════════════════
      "/api/admin/users": {
        get: {
          tags: ["Admin"],
          summary: "Lấy danh sách tất cả người dùng (Admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "integer", default: 1 },
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 20 },
            },
          ],
          responses: {
            200: { description: "Danh sách users" },
            403: { description: "Không có quyền admin" },
          },
        },
      },
      "/api/admin/orders": {
        get: {
          tags: ["Admin"],
          summary: "Lấy tất cả đơn hàng (Admin)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Tất cả đơn hàng" },
            403: { description: "Không có quyền admin" },
          },
        },
      },
      "/api/admin/stats": {
        get: {
          tags: ["Admin"],
          summary: "Thống kê tổng quan hệ thống (Admin)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description:
                "Thống kê: tổng đơn, doanh thu, người dùng, sản phẩm",
            },
            403: { description: "Không có quyền admin" },
          },
        },
      },
      // ══════════════════════════════════════════════
      // HEALTH
      // ══════════════════════════════════════════════
      "/api/health": {
        get: {
          tags: ["Health"],
          summary: "Kiểm tra server đang chạy",
          security: [],
          responses: {
            200: {
              description: "Server OK",
              content: {
                "application/json": {
                  example: { status: "ok", message: "Server is running" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], // Không dùng JSDoc comment scanning, spec viết trực tiếp ở trên
};

export const swaggerSpec = swaggerJsdoc(options);
