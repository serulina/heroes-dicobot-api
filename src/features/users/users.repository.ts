import { and, eq } from 'drizzle-orm';
import type { createDb } from 'src/core/db';
import { users, type NewUser, type User } from 'src/features/users/entities/users.schema';

type Db = ReturnType<typeof createDb>;

export class UsersRepository {
  constructor(private readonly db: Db) {}

  async findByGameNameAndCharacterName(gameName: string, characterName: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: and(eq(users.gameName, gameName), eq(users.characterName, characterName)),
    });
  }

  async findByGameNameAndOcid(gameName: string, ocid: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: and(eq(users.gameName, gameName), eq(users.ocid, ocid)),
    });
  }

  async create(user: NewUser): Promise<User> {
    const [created] = await this.db.insert(users).values(user).returning();

    return created;
  }
}
