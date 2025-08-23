import * as bcrypt from 'bcrypt';

/**
 * Get hashed password
 * 
 * @param password plain text password
 * @returns Promise<string>
 */
export default async function HashPassword(password: string): Promise<string> {
        
    const hash: string = await bcrypt.hash(password, 10);

    return hash;

}