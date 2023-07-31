import { PrismaClient } from "@prisma/client";

/* declare a global variable named prisma of
 type PrismaClient | undefined by extending the global namespace */
declare global {
    var prisma: PrismaClient | undefined
}

const prismadb = globalThis.prisma || new PrismaClient();
//condition to check whether its safe to use globalThis.prisma or to re initialize new PrismaClient()
//if we are in development, this is going to save us because we if reinitialize new PrismaClient()
//next13 with it hot reloading would create bunch of Primsa instances causing warning and degradation of performance 
//in development

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb

export default prismadb