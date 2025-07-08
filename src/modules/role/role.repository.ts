import { Role } from "../../shared/database/entity/Role";
import { AppDataSource } from "../../shared/database/migration/data-source";



export const roleRepository = {

    async getRoleByName(roleName: string): Promise<Role | null> {
        if (!roleName || typeof roleName !== 'string') {
            throw new Error('Invalid role name parameter');
        }

        try {
            const role = await AppDataSource.manager.findOneBy(Role, {
                name: roleName,
            });
            return role;
        } catch (err: any) {
            console.error(`Error getting role by name: ${err}`);
            return null;
        }
    }
}
