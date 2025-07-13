import { Role } from "../../shared/database/entity/Role";
import { ApiErrorResponse } from "../../shared/utils/ApiErrorResponse";
import { roleRepository } from "./role.repository";



const roleService = {

    async getRoles(): Promise<Role[]> {
        const roles = await roleRepository.getRoles();
        if (!roles) {
            return [];
        }
        let data = [];
        for (const role of roles) {
            data.push(role);
        }
        return data;
    },

}

export default roleService