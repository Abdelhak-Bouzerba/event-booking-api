import sequelize from "../../src/config/db";

const cleanupDatabase = async (): Promise<void> => {
  // Safety checks: never clean a non-test database.
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Database cleanup is only allowed in test environment.");
  }

  const expectedDatabase = process.env.TEST_DB_NAME;
  const actualDatabase = sequelize.config.database;

  if (!expectedDatabase || actualDatabase !== expectedDatabase) {
    throw new Error("Refusing to clean an unexpected database.");
  }

  const queryInterface = sequelize.getQueryInterface();

  // Delete in reverse foreign-key dependency order.
  await queryInterface.bulkDelete("bookings", {});
  await queryInterface.bulkDelete("events", {});
  await queryInterface.bulkDelete("users", {});
};

export default cleanupDatabase;
