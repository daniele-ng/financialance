import { compare } from 'bcrypt'; 

/**
 * Check between hashed password and the plain one
 * 
 * @param plainPassword plain text password
 * @param hashPassword hashed password
 * @returns Promise<boolean>
 */
export default async function CheckPassword(plainPassword: string, hashPassword: string): Promise<boolean> {

    const result: boolean = await compare(plainPassword, hashPassword);

    return result;

}