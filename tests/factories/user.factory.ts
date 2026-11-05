import User from "../../src/models/user.model";
import { InferCreationAttributes } from "sequelize";

type UserOverrides = Partial<InferCreationAttributes<User>>;

let userCounter = 0;

const createUser = async (overrides: UserOverrides = {}): Promise<User> => {
  userCounter++;

  return User.create({
    name: "Test User",
    email: `test-user-${Date.now()}-${userCounter}@example.com`,
    passwordHash: "test-password-hash",
    role: "attendee",
    ...overrides,
  });
};

export default createUser;
