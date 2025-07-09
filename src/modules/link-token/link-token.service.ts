import { AppDataSource } from "../../shared/database/migration/data-source";
import { LinkToken } from "../../shared/database/entity/Token";
import { generateToken } from "../../shared/utils/token.utils";

export const linkTokenService = {
    createToken: async (email: string): Promise<LinkToken> => {
        const token = generateToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

        const linkToken = new LinkToken();
        linkToken.token = token;
        linkToken.email = email;
        linkToken.expiresAt = expiresAt;


        return await AppDataSource.manager.save(linkToken);
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
