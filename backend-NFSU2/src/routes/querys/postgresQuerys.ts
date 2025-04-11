import client from "../../../postgresDB";
import { QueryResult } from "pg";

// Pegar todos os carros da tabela
export async function getAllCars() {
  try {
    const result: QueryResult = await client.query("SELECT * FROM cars");
    return result.rows;
  } catch (error) {
    console.error("Erro ao buscar carros:", error);
    throw error;
  }
}

export async function removeCarByID(id: number) {
  try {
    const result: QueryResult = await client.query(
      "DELETE FROM cars WHERE id = $1",
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error("Erro ao remover carro:", error);
    throw error;
  }
}