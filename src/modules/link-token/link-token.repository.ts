import { AppDataSource } from "../../shared/database/migration/data-source";
import { LinkToken } from "../../shared/database/entity/Token";

export const linkTokenRepository = {
  create: async (tokenData: Partial<LinkToken>): Promise<LinkToken> => {
    const token = AppDataSource.manager.create(LinkToken, tokenData);
    return await AppDataSource.manager.save(token);
  },

  validateToken: async (token: string): Promise<LinkToken | null> => {
    const linkToken = await AppDataSource.manager.findOne(LinkToken, {
      where: { token },
    });

    if (!linkToken || linkToken.isExpired) {
      return null;
    }

    return linkToken;
  },

  deleteToken: async (token: string): Promise<void> => {
    await AppDataSource.manager.delete(LinkToken, { token }); // automatically handles the deletion of the token
  },

  deleteExpiredTokens: async (): Promise<void> => {
    await AppDataSource.manager
      .createQueryBuilder()
      .delete()
      .from(LinkToken)
      .where("expiresAt < :now", { now: new Date() })
      .execute();
  },
}
