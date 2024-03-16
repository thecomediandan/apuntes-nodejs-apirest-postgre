import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;
    try {
        if(!email || !password) {
            res.status(400).json({ message: "Payload Request: El email y el usuario es requerido." });
            return;
        }

        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);

        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        );

        const token = generateToken(user);

        res.status(201).json({token});
        return;
    } catch (error: any) {
        console.log(error);
        if(error?.code === "P2002" && error?.meta?.target?.includes("email")) {
            res.status(402).json({ message: "Bad Request: El email ya existe." });
            return;
        }
        res.status(500).json({ message: "Internal Server Error: Error interno del servidor." });
        return;
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;
    try {
        if(!email || !password) {
            res.status(400).json({ message: "Payload Request: El email y el usuario es requerido." });
            return;
        }
        
        const user = await prisma.findUnique({ where: { email: email } });
        if(!user) {
            // Error de usuario no encontrado
            res.status(404).json({ message: "Not Found: Falló usuario o contraseña." });
            return;
        }
        const passwordMatch = await comparePassword(password, user.password);

        if(!passwordMatch) {
            // Error de contraseña invalida
            res.status(401).json({ message: "Not Found: Falló usuario o contraseña." });
            return;
        }

        const token = generateToken(user);
        res.status(200).json({ token });
        return;

    } catch (error: any) {
        console.log(error);
    }
}