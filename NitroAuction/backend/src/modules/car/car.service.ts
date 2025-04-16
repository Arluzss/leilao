import { HateoasLink } from "./car.model";
import { Car } from "./car.model";
import { carQuerys } from "../../database/queries/car.queries";

function buildHateoasLink(rel: string, href: string): HateoasLink {
    return { rel, href };
}

export const carService = {
    async getAllCars() {
        const car = buildCarHateoasLinks(await carQuerys.getAllCars());
        if (Array.isArray(car)) {
            return car;
        }
    },
    async removeCarByID(id: number) {
        const result = await carQuerys.removeCarByID(id);
        return result;
    },
    async findCarByID(id: number) {
        const car = buildCarHateoasLinks(await carQuerys.findCarByID(id));
        if (Array.isArray(car)) {
            return null;
        }
        return car;
    }
};

function buildCarHateoasLinks(car: Car[] | Car): Car[] | Car {
    if (!Array.isArray(car)) {
        return {
            ...car,
            links: [
                buildHateoasLink("logo", `cars/logo/${car.brand.replace(/\s+/g, '')}.png`),
                buildHateoasLink("imagem-carro", `cars/images/${car.name.replace(/\s+/g, '')}.png`)
            ]
        };
    }

    return car.map(c => ({
        ...c,
        links: [
            buildHateoasLink("logo", `cars/logo/${c.brand.replace(/\s+/g, '')}.png`),
            buildHateoasLink("imagem-carro", `cars/images/${c.name.replace(/\s+/g, '')}.png`)
        ]
    }));
}