import { Client } from 'pg';
import { env } from './env';

const client = new Client({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
});

export async function connectDB() {
    try {
        await client.connect();
        console.log('✅ Conectado ao PostgreSQL! 🚀');
    } catch (error) {
        console.error('❌ Erro ao conectar ao PostgreSQL:', error);
    }
}

export default client;