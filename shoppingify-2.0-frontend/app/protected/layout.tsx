'use client'

// ----- external modules ----- //
import { Stack, Flex, Avatar, WrapItem, Box } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { FaListUl, FaHistory } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { IoIosStats, IoIosAddCircle } from 'react-icons/io'

// ----- internal modules ----- //
// components
import TooltipCn from './tooltip'

export default function AuthLayout ({
  children
}: PropsWithChildren): React.ReactNode {
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

  return (
    <>
      <Flex w='auto' minH='100vh' bg='#FAFAFE'>
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
          display={['initial', 'none']}
        >
          <Stack spacing={8} direction='row' align='center' justify='center'>
            {Icons.map((icon) =>
              icon.id === 3
                ? (
                  <Box key={icon.id} pos='relative' top='-15px'>
                    <TooltipCn
                      label={icon.tooltip}
                      link={icon.link}
                      icon={icon.icon}
                      size={12}
                    />
                  </Box>
                  )
                : (
                  <TooltipCn
                    key={icon.id}
                    label={icon.tooltip}
                    link={icon.link}
                    icon={icon.icon}
                    size={icon.size}
                  />
                  )
            )}
          </Stack>
        </Flex>
        <Flex
          width='5%'
          h='100%'
          bg='white'
          p='2% 0'
          direction='column'
          align='center'
          justify='space-between'
          position='fixed'
          bottom='0'
          left='0'
          display={['none', 'flex']}
        >
          <WrapItem>
            <Avatar name='Shoppingify Logo' src='/logo.svg' />
          </WrapItem>
          <Stack spacing={8}>
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
        {children}
      </Flex>
      <Flex h={['100px', '0px']} bg='#FAFAFE' />
    </>
  )
}
