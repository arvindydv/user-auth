import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "./swagger.json" assert { type: "json" };

const app = express();

app.use(helmet()); // Adds security headers
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(xss()); //  inputs sanitization.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// import api routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

// user routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default app;
