import client from "../../config/db";

export const carQuerys = {
    async getAllCars() {
        const query = "SELECT * FROM cars";
        const result = await client.query(query);
        return result.rows;
    },
    async removeCarByID(id: number) {
        const query = "DELETE FROM cars WHERE id = $1";
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    },
    async findCarByID(id: number) {
        const query = "SELECT * FROM cars WHERE id = $1";
        const result = await client.query(query, [id]);
        return result.rows[0];
    }
}