import { envs } from "../../config";
import { CategoryModel } from "../mongo/models/category.model";
import { ProductModel } from "../mongo/models/product.model";
import { UserModel } from "../mongo/models/user.model";
import { MongoConnection } from "../mongo/mongo-connection";
import { seedData } from "./data";

(async () => {
  await MongoConnection.connectionDatabase({
    dbName: envs.MONGO_DB_NAME,
    dbUrl: envs.MONGODB_URI,
  });
  await main();

  await MongoConnection.disconnectDatabase();
})();

const randonBetween0AndX = (x: number) => Math.floor(Math.random() * x);

async function main() {
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);

  //insert users
  const users = await UserModel.insertMany(seedData.users);

  const categories = await CategoryModel.insertMany(
    seedData.categories.map((category) => ({
      ...category,
      user: users[0]._id,
    })),
  );

  const products = await ProductModel.insertMany(
    seedData.products.map((products) => ({
      ...products,
      user: users[randonBetween0AndX(users.length - 1)]._id,
      category: categories[randonBetween0AndX(categories.length - 1)]._id,
    })),
  );
  console.log("seeded");
}
