import { AppDataSource } from "../../shared/database/migration/data-source";
import { OTP } from "../../shared/database/entity/OTP";
import { MoreThan } from "typeorm";
import moment from "moment-timezone";

// Get the database timezone from the connection options
// const dbTimezone = (AppDataSource.options.extra as any)?.timezone || "UTC";

// Calculate 5 minutes ago in the database's timezone
const fiveMinutesAgo = moment().utc().subtract(5, "minutes").toDate().toISOString();

export const otpRepository = {
  // TODO: automate this process
  // deleteExpiredTokens: async (): Promise<void> => {
  //   await AppDataSource.manager
  //     .createQueryBuilder()
  //     .delete()
  //     .from(OTP)
  //     .where("email")
  //     .execute();
  // },
  getLatestOtp: async (email: string): Promise<OTP | null> => {
    const otp = await AppDataSource.manager.findOne(OTP, {
      where: {
        email,
        createdAt: MoreThan(new Date(fiveMinutesAgo)) ,
      },
      order: { createdAt: "DESC" },
    });
    return otp;
  },
  getOTPByEmail: async (email: string): Promise<OTP | null> => {
      const otp = await AppDataSource.manager.findOne(OTP, {
        where: {
          email,
        },
      });
      return otp;

  },
  deleteOldOTPByEmail: async (email: string): Promise<void> => {
      await AppDataSource.manager.delete(OTP, {email });

  },
  createOTP: async (email: string, otp: number): Promise<void> => {
    const otpEntity = new OTP();
    otpEntity.otp = otp;
    otpEntity.email = email;
    await AppDataSource.manager.save(otpEntity);
  },
};
