import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-express";
import { AppDataSource } from "../database/migration/data-source";
import { User } from "../database/entity/User";
import { Permission } from "../database/entity/Permission";

export const authorizeUser = (permissions: string[]) => {
 return async (req: CustomRequest, res: Response, next: NextFunction) => {
   try{
    const userId = req.userId
    if (!userId) {
        res.status(401).json({message: "User not authenticated"});
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
                res.status(403).json({message: "Forbidden: User has no role assigned"});
                return;
            }

            const userPermissions = userWithRole!.role?.permissions?.map(
                (p: Permission) => p.name
            ) || [];

            // Check if the user has all required permissions
            const hasAllPermissions = permissions.every((permission: string) =>
                userPermissions.includes(permission)
            );

            if (!hasAllPermissions) {
                res.status(403).json({message: "Forbidden: User does not have required permissions"});
                return;
            }
            next();
        } catch (error) {
            console.error("Authorization error:", error);
            return res.status(500).json({message: "Internal server error during authorization"});
        }
    };
};
