'use client'

// external modules
import {
  Flex,
  Container,
  VStack,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
  Button
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'

// internal modules
import { authenticateUser } from '@/utils/auth'
import { UserLoginSchema } from '@/common/yupSchemas'

export default function Login (): JSX.Element {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: UserLoginSchema,
    onSubmit: async (values) => {
      await authenticateUser(
        values.email,
        values.password,
        formik,
        setLoggedIn
      )
    }
  })

  useEffect(() => {
    if (loggedIn) {
      router.push('/protected/dashboard')
    }
  }, [router, loggedIn])

  return (
    <Flex
      w='100vw'
      h='100vh'
      align={['flex-start', 'center']}
      justify='flex-end'
      bgImage="url('/login-bg-img.png')"
      bgPosition={['bottom 30px center', '10% 20%']}
      bgRepeat='no-repeat'
      bgSize={['80%', '50%']}
      p={['30% 5%', '0 10%']}
    >
      <Container maxW={['100%', '36%']} m='auto 0' h='100%'>
        <VStack
          justify={['flex-start', 'center']}
          spacing={50}
          color='main'
          h='100%'
        >
          <Text fontSize='2xl' fontWeight='600'>
            Welcome back!
          </Text>
          <form onSubmit={formik.handleSubmit} style={{ width: '90%' }}>
            <VStack w='100%' spacing={1}>
              <VStack w='100%' spacing={2}>
                <FormControl
                  isInvalid={
                    Boolean(formik.errors.email) && formik.touched.email
                  }
                >
                  <Input
                    name='email'
                    type='email'
                    variant='flushed'
                    placeholder='Email'
                    size='lg'
                    focusBorderColor='secondary'
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    Boolean(formik.errors.password) && formik.touched.password
                  }
                >
                  <Input
                    name='password'
                    type='password'
                    variant='flushed'
                    placeholder='Password'
                    size='lg'
                    focusBorderColor='secondary'
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>
              </VStack>
              <Button type='submit' colorScheme='purple' width='full' mt='35px'>
                Login
              </Button>
            </VStack>
          </form>
          <VStack w='100%' spacing={2}>
            <NextLink href='/resetPasswordVc'>
              <Text
                fontSize='md'
                _hover={{ borderBottomWidth: '1px', borderColor: 'purple' }}
              >
                Forgot password?
              </Text>
            </NextLink>
            <NextLink href='/register'>
              <Text
                fontSize='md'
                _hover={{ borderBottomWidth: '1px', borderColor: 'purple' }}
              >
                Do not have an account yet ? Create one
              </Text>
            </NextLink>
          </VStack>
        </VStack>
      </Container>
    </Flex>
  )
}
