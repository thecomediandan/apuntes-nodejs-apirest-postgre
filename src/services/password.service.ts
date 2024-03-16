import bcrypt from "bcrypt";

// ? SALT_ROUNDS define el numero de recorridos de seguridad para el hash del password, generalmente es 10
const SALT_ROUNDS: number = 10;

export const hashPassword = async (password :string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}