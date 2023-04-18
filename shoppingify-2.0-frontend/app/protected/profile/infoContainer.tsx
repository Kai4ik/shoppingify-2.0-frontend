'use client'

// ----- external modules ----- //
import {
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
  Text,
  Stack,
  Button,
  Icon
} from '@chakra-ui/react'
import * as jose from 'jose'
import { EditIcon } from '@chakra-ui/icons'
import { FiLogOut } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// ----- internal modules ----- //
import { logout } from '@/utils/auth'

interface Props {
  userinfo: jose.JWTPayload
}

export default function InfoContainer ({ userinfo }: Props): JSX.Element {
  const router = useRouter()

  const [signingOut, setSigningOut] = useState<boolean>(false)
  const [signedOut, setSignedOut] = useState<boolean>(false)

  useEffect(() => {
    if (signedOut) {
      router.push('/login')
    }
  }, [router, signedOut])

  const inputs = [
    {
      label: 'First Name',
      type: 'text',
      placeholder: 'First Name',
      name: 'firstName',
      value: userinfo.given_name as string
    },
    {
      label: 'Last Name',
      type: 'text',
      placeholder: 'Last Name',
      name: 'lastName',
      value: userinfo.family_name as string
    },
    {
      label: 'Birth Date',
      type: 'date',
      placeholder: 'Birth Date',
      name: 'birthDate',
      value: userinfo.birthdate as string
    },
    {
      label: 'Gender',
      type: 'text',
      placeholder: 'Gender',
      name: 'gender',
      value: userinfo.gender as string
    },
    {
      label: 'Email',
      type: 'email',
      placeholder: 'Email',
      name: 'Email',
      value: userinfo.email as string
    }
  ]

  const handleLogout = (): void => {
    setSigningOut(true);
    (async () => {
      await logout(setSignedOut)
    })().catch((err) => console.error(err))
    setSigningOut(false)
  }

  return (
    <VStack w='100%' p='4% 0' spacing={8} align='center'>
      <Text fontSize={22} color='main' fontWeight={600}>
        Profile
      </Text>
      <VStack w={['90%', '60%']} spacing={3}>
        {inputs.map((input, index) => (
          <InputGroup key={index} size='lg'>
            <InputLeftAddon w={['auto', '20%']} color='main'>
              {input.label}
            </InputLeftAddon>
            <Input
              type={input.type}
              placeholder={input.placeholder}
              name={input.name}
              value={input.value}
              isReadOnly
              color='main'
            />
          </InputGroup>
        ))}
      </VStack>
      <Stack
        w={['90%', '60%']}
        direction={['column', 'row']}
        justify='space-between'
      >
        <Button
          colorScheme='yellow'
          w={['100%', '49%']}
          leftIcon={<EditIcon />}
        >
          Edit
        </Button>
        <Button
          colorScheme='red'
          w={['100%', '49%']}
          leftIcon={<Icon as={FiLogOut} />}
          onClick={handleLogout}
          isLoading={signingOut}
          loadingText='Signing out...'
        >
          Log out
        </Button>
      </Stack>
    </VStack>
  )
}
