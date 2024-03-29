declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_USER_POOL_ID: string
      NEXT_PUBLIC_USER_POOL_CLIENT_ID: string
      NEXT_PUBLIC_AWS_ACCESS_KEY_ID: string
      NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: string
      NEXT_PUBLIC_AWS_REGION: string
      NEXT_PUBLIC_PGQL_URL: string
      AWS_ACCESS_KEY_ID: string
      AWS_SECRET_ACCESS_KEY: string
      AWS_REGION: string
      PGQL_URL: string
      NEXT_PUBLIC_API_URL: string
    }
  }
}

export {}
