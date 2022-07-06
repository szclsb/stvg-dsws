import * as bcrypt from 'bcrypt';

const saltRounds = 17;

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, passwordHash?: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
}

