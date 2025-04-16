export interface HateoasLink {
    rel: string;
    href: string;
}

export interface Car {
    id: number;
    brand: string;
    name: string;
    year: number;
    price: number;
    category: string;
    auctionId?: number; // Adicionando a propriedade auctionId
    links?: HateoasLink[]; // Adicionando a propriedade links
}