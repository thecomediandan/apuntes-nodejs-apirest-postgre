import { Request, Response } from "express";
import { hashPassword } from "../services/password.service";
import prisma from "../models/user";

export const createUser = async (req: Request, res: Response): Promise<void> => {
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

        res.status(201).json({user});
        return;
    } catch (error: any) {
        //console.log(error);
        if(error?.code === "P2002" && error?.meta?.target?.includes("email")) {
            res.status(402).json({ message: "Bad Request: El email ya existe." });
            return;
        }
        res.status(500).json({ message: "Internal Server Error: Error interno del servidor." });
        return;
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany();
        res.status(200).json({users});
        return;
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error: Error interno del servidor." });
        return;
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    try {
        const user = await prisma.findUnique({ where: { id: userId } });
        if(!user) {
            res.status(404).json({ message: "Not Found: Usuario no encontrado." });
            return;
        }
        res.status(200).json({user});
        return;
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error: Error interno del servidor." });
        return;
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    const {email, password} = req.body;
    try {
        let dataToUpdate: any = {...req.body};
        if(password) {
            const hashedPassword = await hashPassword(password);
            dataToUpdate.password = hashedPassword;
        }
        if(email) dataToUpdate.email = email;
        
        const user = await prisma.update({ where: { id: userId }, data: dataToUpdate });

        res.status(200).json({user});
        return;
    } catch (error: any) {
        console.log(error);
        if(error?.code === "P2002" && error?.meta?.target?.includes("email")) {
            res.status(400).json({ message: "Bad Request: El email ya existe." });
            return;
        }else if(error?.code === "P2025") {
            res.status(404).json({ message: "Not Found: Usuario no encontrado." });
            return;
        }else {
            res.status(500).json({ message: "Internal Server Error: Error interno del servidor." });
            return;
        }
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    try {     
        await prisma.delete({ where: { id: userId } });
        res.status(200).json({ mesage: `El usuario con id ${userId} ha sido eliminado.` });
        return;
    } catch (error: any) {
        console.log(error);
        if(error?.code === "P2025") {
            res.status(404).json({ message: "Not Found: Usuario no encontrado." });
            return;
        }else {
            res.status(500).json({ message: "Internal Server Error: Error interno del servidor." });
            return;
        }
    }
}