import { AppDataSource } from "../../shared/database/migration/data-source";
import { OTP } from "../../shared/database/entity/OTP";
import { MoreThan } from "typeorm";
import moment from "moment-timezone";

// Get the database timezone from the connection options
const dbTimezone = (AppDataSource.options.extra as any)?.timezone || "UTC";

// Calculate 5 minutes ago in the database's timezone
const fiveMinutesAgo = moment().tz(dbTimezone).subtract(5, "minutes").toDate();

export const otpRepository = {
  // TODO: automate this process
  deleteExpiredTokens: async (): Promise<void> => {
    await AppDataSource.manager
      .createQueryBuilder()
      .delete()
      .from(OTP)
      .where("createdAt < :now", { now: new Date() })
      .execute();
  },
  async getLatestOtp(email: string): Promise<OTP | null> {
   try {
    const otp = await AppDataSource.manager.findOne(OTP, {
      where: {
        email,
        createdAt: MoreThan(fiveMinutesAgo),
      },
      order: { createdAt: "DESC" },
    });
    return otp;
   } catch (err: any) {
    console.error(`Error getting latest OTP: ${err}`);
    return null;
   }
  },
};
