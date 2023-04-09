'use client'

// ----- external modules ----- //
import { Stack, Flex, Avatar, WrapItem } from '@chakra-ui/react'
import { FaListUl, FaHistory } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { IoIosStats, IoIosAddCircle } from 'react-icons/io'
import { useState, useEffect } from 'react'

// ----- internal modules ----- //
// components
import TooltipCn from './tooltip'

interface LayoutProps {
  children: React.ReactNode
}

export default function AuthLayout ({ children }: LayoutProps): React.ReactNode {
  const Icons = [
    {
      icon: FaListUl,
      size: 6,
      id: 1,
      tooltip: 'My products',
      link: '/protected/productsList'
    },
    {
      icon: FaHistory,
      size: 5,
      id: 2,
      tooltip: 'History',
      link: '/protected/purchaseHistory'
    },
    {
      icon: IoIosAddCircle,
      size: 8,
      id: 3,
      tooltip: 'Add new receipt',
      link: '/protected/addReceipt'
    },
    {
      icon: FiUser,
      size: 6,
      id: 4,
      tooltip: 'My profile',
      link: '/protected/profile'
    },
    {
      icon: IoIosStats,
      size: 6,
      id: 5,
      tooltip: 'Statistics',
      link: '/protected/stats'
    }
  ]

  const [width, setWidth] = useState<number>(0)

  function handleWindowSizeChange () {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    if (width === 0) {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [width])

  return (
    width !== 0 && (
      <Flex w='auto' minH='100vh' bg='#FAFAFE'>
        {width <= 768
          ? (
            <Flex
              width='100%'
              h='8%'
              bg='white'
              p='0'
              direction='row'
              align='center'
              justify='center'
              position='fixed'
              bottom='0'
              left='0'
              borderTopLeftRadius={12}
              borderTopRightRadius={12}
              zIndex='5'
              borderTopWidth='2px'
              borderTopColor='blackAlpha.200'
            >
              <Stack spacing={8} direction='row' align='center'>
                {Icons.map((icon) => (
                  <TooltipCn
                    label={icon.tooltip}
                    link={icon.link}
                    icon={icon.icon}
                    size={icon.size}
                    key={icon.id}
                  />
                ))}
              </Stack>
            </Flex>
            )
          : (
            <Flex
              width={['95%', '5%']}
              h={['8%', '100%']}
              bg='white'
              p='2% 0'
              direction={['row', 'column']}
              align='center'
              justify='space-between'
              position='fixed'
              bottom='0'
              left='0'
            >
              <WrapItem display={['none', 'block']}>
                <Avatar name='Shoppingify Logo' src='/logo.svg' />
              </WrapItem>
              <Stack spacing={8} direction={['row', 'column']}>
                {Icons.map(
                  (icon) =>
                    icon.icon !== IoIosAddCircle && (
                      <TooltipCn
                        label={icon.tooltip}
                        link={icon.link}
                        icon={icon.icon}
                        size={icon.size}
                        key={icon.id}
                      />
                    )
                )}
              </Stack>
              <TooltipCn
                label='Add new receipt'
                link='/protected/addReceipt'
                icon={IoIosAddCircle}
                size={8}
              />
            </Flex>
            )}
        {children}
      </Flex>
    )
  )
}
