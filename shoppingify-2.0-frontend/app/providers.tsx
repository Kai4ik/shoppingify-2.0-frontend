'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

export function Providers ({
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
    <CacheProvider>
      <ChakraProvider theme={customTheme}>{children}</ChakraProvider>
    </CacheProvider>
  )
}
