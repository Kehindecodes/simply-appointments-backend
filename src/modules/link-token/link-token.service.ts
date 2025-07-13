import { AppDataSource } from "../../shared/database/migration/data-source";
import { LinkToken } from "../../shared/database/entity/Token";
import { generateToken } from "../../shared/utils/token.utils";

export const linkTokenService = {
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
        await AppDataSource.manager.delete(LinkToken, { token });
    },

    deleteExpiredTokens: async (): Promise<void> => {
        await AppDataSource.manager
            .createQueryBuilder()
            .delete()
            .from(LinkToken)
            .where("expiresAt < :now", { now: new Date() })
            .execute();
    },
};
