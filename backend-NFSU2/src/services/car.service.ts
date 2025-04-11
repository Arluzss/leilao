import { HateoasLink } from "../models/car.model";
import { Car } from "../models/car.model";
import { getAllCars } from "../routes/querys/postgresQuerys";

function buildHateoasLink(rel: string, href: string): HateoasLink {
    return { rel, href };
}

export function buildCarHateoasLinks(car: Car[]): Car[] {
    const carWithLinks = car.map(car => ({
        ...car,
        links: [
            buildHateoasLink("logo", `cars/logo/${car.brand.replace(/\s+/g, '')}.png`),
            buildHateoasLink("imagem-carro", `cars/images/${car.name.replace(/\s+/g, '')}.png`)
        ]
    }));
    return carWithLinks;
}

export function getAll() {
    return new Promise<Car[]>((resolve, reject) => {
        getAllCars()
            .then(cars => {
                resolve(cars);
            })
            .catch(error => {
                console.error("Error fetching cars:", error);
                reject(error);
            });
    });
};