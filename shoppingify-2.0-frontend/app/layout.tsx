// external modules
import { PropsWithChildren } from 'react'

// internal modules
import { Providers } from './providers'

export default function RootLayout ({
  children
}: PropsWithChildren): JSX.Element {
  return (
    <html lang='en'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
