import { AppDataSource } from './../../migration/data-source';
import { Service } from './../../entity/Service';
import { ResponseStatus } from './../../model/response-status';


export const createService = async (req: any, res: any) => {
    try {
        const { serviceName, price, description, duration } = req.body;
        if (
            serviceName !== "" &&
            price !== "" &&
            description !== "" &&
            duration !== ""
        ) {
            const service = new Service();
            service.serviceName = serviceName;
            service.description = description;
            service.duration = duration;
            service.price = price;
            service.isActive = true;
            service.availability = true;

            await AppDataSource.manager.save(service);
            res.json(ResponseStatus.SUCCESS);
        }
        // handle case where input validation fails
        res.json(ResponseStatus.INVALID_INPUT);
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        });
    }
};

// get single service via serviceId

export const getService = async (req: any, res: any) => {
    try {
        const service = await AppDataSource.manager.findOneBy({
            id: req.params.serviceId,
        });
        res.json(service);
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        });
    }
}