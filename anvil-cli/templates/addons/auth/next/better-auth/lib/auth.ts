import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/app/generated/prisma"; //change path to your Prisma client import
 
const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql" // Specify your database provider here, e.g., "postgresql", "mysql", etc.
    }),
    emailAndPassword: {
        enabled: true
    }
} satisfies BetterAuthOptions);