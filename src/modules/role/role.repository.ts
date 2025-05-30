import { Role } from "../../shared/database/entity/Role";
import { AppDataSource } from "../../shared/database/migration/data-source";



export const roleRepository = {

    async getRoleByUserType(userType: string): Promise<Role | null>{
        const role = await AppDataSource.manager.findOneBy(Role, {
            name: userType,
        });
        return role;
    }
}
