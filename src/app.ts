/**
 *  npm init
 *  Primero se instalo las dependencias de desarrollo:
 *  npm i ts-node-dev @types/express @types/jsonwebtoken @types/bcrypt @types/node rimraf prisma --save-dev
 *  Despues se instalo las dependencias de produccion:
 *  npm i express jsonwebtoken bcrypt @prisma/client dotenv typescript
 *  Se configuro el archivo de configuracion de TypeScript:
 *  npx tsc --init --outDir dist/ --rootDir src
 *  Excluyendo las carpetas de node_modules y dist y incluyendo src.
 */

import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();

app.use(express.json());

// Routes
// autenticacion, user, etc
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

export default app;