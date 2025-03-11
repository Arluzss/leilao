export interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  logoSrc: string;
  carSrc: string;
  km: number;
  engine: string;
  time: number;
  bids?: Bid[]; // Lista de lances
  parts?: Parts[]; // Lista de peças
  comments?: Comment[]; // Lista de comentários
}

export interface Parts{
  name: string;
  rating: number;
}

export interface Bid {
  user: string;
  bidAmount: number;
  timestamp?: Date; // Opcional porque tem um valor padrão
}

export interface Comment {
  user: string;
  text: string;
  timestamp?: Date; // Opcional porque tem um valor padrão
}