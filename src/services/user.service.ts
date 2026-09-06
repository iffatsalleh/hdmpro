import { userRepository, UserRepository } from "@/repositories/user.repository";
import bcrypt from "bcryptjs";

export class UserService {
  constructor(private repo: UserRepository = userRepository) {}

  async getUserByEmail(email: string) {
    return this.repo.findByEmail(email);
  }

  async getUserById(id: string) {
    return this.repo.findById(id);
  }

  async registerUser(params: { name: string; email: string; password?: string }) {
    const existing = await this.repo.findByEmail(params.email);
    if (existing) {
      throw new Error("Emel telah didaftarkan.");
    }

    const hashedPassword = params.password
      ? await bcrypt.hash(params.password, 10)
      : undefined;

    return this.repo.createUser({
      name: params.name,
      email: params.email,
      password: hashedPassword,
    });
  }

  async ensureUserExists(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) {
      return this.repo.createUser({
        id: userId,
        email: `${userId}@hdmpro.app`,
        name: "Ahli HDM",
      });
    }
    return user;
  }
}

export const userService = new UserService();
