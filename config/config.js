import dotenv from "dotenv";

dotenv.config();

export const config = {

    port: process.env.PORT || 3000,
    DB_URL: process.env.db_REMOTE_URL,
    JWT_KEY: process.env.JWT_SECRET_KEY

}