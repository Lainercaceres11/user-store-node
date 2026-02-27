import { envs } from "./config/envs";
import { MongoConnection } from "./data";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  await MongoConnection.connectionDatabase({
    dbName: envs.MONGO_DB_NAME,
    dbUrl: envs.MONGODB_URI,
  });

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}
