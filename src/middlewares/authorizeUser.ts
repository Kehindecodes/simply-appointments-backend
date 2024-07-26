import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-express";
import { AppDataSource } from "../migration/data-source";
import { User } from "../entity/User";
import { Permission } from "../entity/Permission";



export const authorizeUser = (permissions: string[]) => {
 return async (req: CustomRequest, res: Response, next: NextFunction) => {
   try{ 
    const user = req.user
    if (!user) {
        res.status(401).send({
            message: "User not authenticated",
    });
}

console.log(`Fetching user with ID: ${user.user.id}`);
        // Fetch the user's role and permissions
      const userWithRole = await AppDataSource.getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('user.id = :userId', { userId: user.user.id })
      .cache(true)
      .getOne();

      if (!userWithRole || !userWithRole.role) {
        return res.status(403).json({ message: 'Forbidden: User has no role assigned' });
      }


      const userPermissions = userWithRole.role?.permissions?.map((p: Permission) => p.name);

      // Check if the user has all required permissions
      const hasAllPermissions = permissions.every((permission: string)  => 
        userPermissions?.includes(permission)
      );

      if(!hasAllPermissions){
        return res.status(403).json({ message: 'Access denied'})
      }
      next()
    }catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ message: 'Internal server error during authorization' });
      }
}
}