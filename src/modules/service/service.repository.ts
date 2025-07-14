import { AppDataSource } from "../../shared/database/migration/data-source";
import { Service } from "../../shared/database/entity/Service";

export const serviceRepository = {

getServiceWithAssignedStaff: async(serviceId: string): Promise<Service | null> => {
        return AppDataSource.getRepository(Service)
            .createQueryBuilder("service")
            .leftJoinAndSelect("service.users", "user")
            .where("service.id = :id", { id: serviceId })
            .getOne();
    }

}
