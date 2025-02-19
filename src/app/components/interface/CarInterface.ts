export interface Car {
    id: string;
    nome: string;
    brand: string;
    year: number;
    preco: number;
    engine: string;
    status?: string; // Opcional porque tem um valor padrão
    startingPrice: number;
    currentPrice: number;
    bids?: Bid[]; // Lista de lances
    comments?: Comment[]; // Lista de comentários
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