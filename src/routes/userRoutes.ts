import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/usersController";

const JWT_SECRET = process.env.JWT_SECRET || "default_key";
const router = express.Router();

// Middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) {
        res.status(401).json({ message: "No esta autorizado." });
        return;
    }else {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if(err) {
                res.status(403).json({ message: "Forbidden: No tienes acceso a este recurso." });
                return;
            }
            next();
        });
    }
};

// Routes
router.post("/", authenticateToken, createUser);
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);


export default router;