import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-express";
import { AppDataSource } from "../database/migration/data-source";
import { User } from "../database/entity/User";
import { Permission } from "../database/entity/Permission";
import { ApiErrorResponse } from "../utils/ApiErrorResponse";

export const authorizeUser = (permissions: string[]) => {
 return async (req: CustomRequest, next: NextFunction) => {
   try{
    const userId = req.userId
    if (!userId) {
        throw new ApiErrorResponse(401, "User not authenticated");
    }

console.log(`Fetching user with ID: ${userId}`);
        // Fetch the user's role and permissions
      const userWithRole = await AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('user.id = :userId', { userId: userId })
      .cache(true)
      .getOne();

            if (!userWithRole || !userWithRole.role) {
                throw new ApiErrorResponse(403, "Forbidden: User has no role assigned");
            }

            const userPermissions = userWithRole.role?.permissions?.map(
                (p: Permission) => p.name
            ) || [];

            // Check if the user has all required permissions
            const hasAllPermissions = permissions.every((permission: string) =>
                userPermissions.includes(permission)
            );

            if (!hasAllPermissions) {
                throw new ApiErrorResponse(403, "Access denied");
            }
            next();
        } catch (error) {
            console.error("Authorization error:", error);
            throw new ApiErrorResponse(500, "Internal server error during authorization");
        }
    };
};
