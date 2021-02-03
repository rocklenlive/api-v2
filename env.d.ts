export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      
      DISCORD_CLIENT_ID: string
      DISCORD_CLIENT_SECRET: string
      CALLBACK_URL: string
      
      ACCESS_TOKEN_SECRET: string
      
      MONGODB_URL: string
      
      INFLUX_DB_HOST: string
      INFLUX_DB_NAME: string
    }
  }
}