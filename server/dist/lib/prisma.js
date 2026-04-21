import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
export async function connectWithRetry(maxRetries = 5) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            await prisma.$connect();
            return;
        }
        catch (error) {
            attempt += 1;
            const delay = Math.min(1000 * 2 ** attempt, 10000);
            if (attempt >= maxRetries)
                throw error;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}
