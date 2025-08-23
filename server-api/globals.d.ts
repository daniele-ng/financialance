namespace NodeJS {

    // Define variable type in the .env file
    interface ProcessEnv {
        APP_MODE: string     
        SERVER_PORT: string
        JWT_SECRET: string
        JWT_ACCESS_TOKEN_TIMEOUT: string
        JWT_REFRESH_TOKEN_TIMEOUT: string
        JWT_TOKEN_ISSUER: string
        DATABASE_NAME: string
        DATABASE_SYNCHRONIZE: boolean
        DATABASE_MIGRATION_AUTO_RUN: boolean
    }

}