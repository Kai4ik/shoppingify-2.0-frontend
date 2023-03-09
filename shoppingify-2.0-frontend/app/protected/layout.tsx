'use client'

// external modules
import {
  VStack,
  Flex,
  Avatar,
  WrapItem,
  Spinner,
  Text
} from '@chakra-ui/react'
import { FaListUl, FaHistory } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { IoIosStats, IoIosAddCircle } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { loggedIn } from '@/utils/auth'

// internal modules
import TooltipCn from './tooltip'

interface LayoutProps {
  children: React.ReactNode
}

export default function AuthLayout ({ children }: LayoutProps): React.ReactNode {
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
      icon: FiUser,
      size: 6,
      id: 3,
      tooltip: 'My profile',
      link: '/protected/profile'
    },
    {
      icon: IoIosStats,
      size: 6,
      id: 4,
      tooltip: 'Statistics',
      link: '/protected/stats'
    }
  ]

  useEffect(() => {
    const checkAuthentication = async (): Promise<void> => {
      const isAuthenticated = await loggedIn()
      setIsAuthenticated(isAuthenticated.signedIn)
      setIsAuthenticating(false)
    }

    checkAuthentication()
  }, [])

  if (isAuthenticating) {
    return (
      <VStack spacing={6} h='100vh' align='center' justify='center'>
        <Text fontSize='2xl' color='main'>
          Verifying user ...
        </Text>
        <Spinner color='secondary' />
      </VStack>
    )
  }

  if (!isAuthenticated) {
    router.push('/login')
    return (
      <VStack spacing={6} h='100vh' align='center' justify='center'>
        <Text fontSize='2xl' color='main'>
          You are not signed in. Redirecting to the login page
        </Text>
        <Spinner color='secondary' />
      </VStack>
    )
  }

  return (
    <Flex w={['auto', '100vw']} h={['auto', '100vh']} bg='#FAFAFE'>
      <Flex
        width={['0%', '5%']}
        bg='white'
        p='2% 0'
        direction='column'
        align='center'
        justify='space-between'
        visibility={['hidden', 'visible']}
      >
        <WrapItem>
          <Avatar name='Shoppingify Logo' src='/logo.svg' />
        </WrapItem>
        <VStack spacing={8}>
          {Icons.map((icon) => (
            <TooltipCn
              label={icon.tooltip}
              link={icon.link}
              icon={icon.icon}
              size={icon.size}
              key={icon.id}
            />
          ))}
        </VStack>
        <TooltipCn
          label='Add new receipt'
          link='/protected/addReceipt'
          icon={IoIosAddCircle}
          size={8}
        />
      </Flex>
      {children}
    </Flex>
  )
}
