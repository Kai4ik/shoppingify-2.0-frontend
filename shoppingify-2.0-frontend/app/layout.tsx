'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  const theme = {
    colors: {
      main: '#80485B',
      secondary: '#F9A109'
    },
    styles: {
      global: {
        'html, body': {
          boxSizing: 'border-box',
          margin: '0',
          padding: '0',
          bg: '#F7F7F7'
        }
      }
    },
    components: {
      Input: {
        baseStyle: {
          field: {
            _autofill: {
              boxShadow: '0 0 0px 1000px #F7F7F7 inset',
              textFillColor: '#80485B'
            }
          }
        }
      }
    }
  }

  const customTheme = extendTheme(theme)

  return (
    <html lang='en'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body>
        <ChakraProvider theme={customTheme}>{children}</ChakraProvider>
      </body>
    </html>
  )
}
