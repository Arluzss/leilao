import client from "../postgresDB";

const carsData = [
  {
    name: "Golf Confortline",
    brand: "Volkswagen",
    year: 2019,
    price: 50000,
    km: 10000,
    category: "popular"
  },
  {
    name: "Fiesta SE",
    brand: "Ford",
    year: 2018,
    price: 40000,
    km: 12000,
    category: "popular"
  },
  {
    name: "Civic Touring",
    brand: "Honda",
    year: 2022,
    price: 150000,
    km: 5000,
    category: "luxo"
  },
  {
    name: "BMW 320i",
    brand: "BMW",
    year: 2021,
    price: 200000,
    km: 8000,
    category: "luxo"
  }
];

async function setupDatabase() {
  try {
    await client.connect();
    console.log("✅ Conectado ao PostgreSQL! 🚀");

    await client.query("DROP TABLE IF EXISTS cars");

    await client.query(`
      CREATE TABLE cars (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        year INTEGER NOT NULL,
        price NUMERIC(12, 2) NOT NULL,
        km INTEGER NOT NULL,
        category VARCHAR(100) NOT NULL
      )
    `);
    console.log("✅ Tabela 'cars' criada com sucesso! 🚗");

    for (const car of carsData) {
      await client.query(
        `INSERT INTO cars (name, brand, year, price, km, category) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [car.name, car.brand, car.year, car.price, car.km, car.category]
      );
    }
    console.log("✅ Dados populados com sucesso! 🚀");

  } catch (err) {
    console.error("❌ Erro ao configurar o banco:", err);
  } finally {
    await client.end();
    console.log("🔌 Conexão encerrada.");
  }
}

setupDatabase();
