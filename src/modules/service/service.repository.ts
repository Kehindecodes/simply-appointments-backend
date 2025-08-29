import { AppDataSource } from "../../shared/database/migration/data-source";
import { Service } from "../../shared/database/entity/Service";
import { validateEntity } from "../../shared/utils/validateData";

export const serviceRepository = {

getServiceWithAssignedStaff: async(serviceId: string): Promise<Service | null> => {
        return AppDataSource.getRepository(Service)
            .createQueryBuilder("service")
            .leftJoinAndSelect("service.users", "user")
            .where("service.id = :id", { id: serviceId })
            .getOne();
    },

    getServiceById: async(serviceId: string): Promise<Service | null> => {
        return AppDataSource.manager.findOne(Service, {where: {id: serviceId}})

    },

   createService: async (
    serviceName: string,
    description: string,
    duration: string,
    price: number,
   ) => {
    const service = AppDataSource.manager.create(Service, {
        serviceName,
        description,
        duration,
        price,
    })

    await validateEntity(service);
    await AppDataSource.manager.save(service);
    return service;
    },

    updateService: async (service: Service) => {
        await validateEntity(service);
        await AppDataSource.manager.update(Service, service.id, service);
        return service;
    },

    deleteService: async (service: Service) => {
        await AppDataSource.manager.remove(service);
        return service;
    },

    getAllServices: async () => {
        return AppDataSource.manager.find(Service);
    },
}
