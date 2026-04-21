import { app } from "./app";
import { env } from "./lib/env";
import { connectWithRetry, prisma } from "./lib/prisma";
async function start() {
    await connectWithRetry(5);
    const server = app.listen(Number(env.PORT), () => {
        console.log(`ByaHero API running on port ${env.PORT}`);
    });
    const shutdown = async () => {
        await prisma.$disconnect();
        server.close(() => process.exit(0));
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
}
start().catch((err) => {
    console.error("Startup failed", err);
    process.exit(1);
});
