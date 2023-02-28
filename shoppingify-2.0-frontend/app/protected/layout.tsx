'use client'

// external modules
import { VStack, Flex, Avatar } from '@chakra-ui/react'
import { FaListUl, FaHistory } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { IoIosStats, IoIosAddCircle } from 'react-icons/io'

// internal modules
import TooltipCn from './tooltip'

export default function AuthLayout ({
  children
}: {
  children: React.ReactNode
}): React.ReactNode {
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
  return (
    <Flex w='100vw' h='100vh' bg='#FAFAFE'>
      <Flex
        width='5%'
        bg='white'
        p='2% 0'
        direction='column'
        align='center'
        justify='space-between'
      >
        <Avatar name='Shoppingify Logo' src='/logo.svg' />
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
          link='/protected/addNewReceipt'
          icon={IoIosAddCircle}
          size={8}
        />
      </Flex>
      {children}
    </Flex>
  )
}
