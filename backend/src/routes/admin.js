import express from "express";
import usersRouter from "./admin/users.js";
import productsRouter from "./admin/products.js";
import ordersRouter from "./admin/orders.js";
import settingsRouter from "./admin/settings/settings.js";

const router = express.Router();

// Mount admin sub-routes
router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/settings", settingsRouter);

export default router;
