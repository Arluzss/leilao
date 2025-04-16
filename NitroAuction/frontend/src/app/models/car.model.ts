export interface HateoasLink {
  rel: string;
  href: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  km: number;
  engine: string;
  category: string;
  links?: HateoasLink[];
}