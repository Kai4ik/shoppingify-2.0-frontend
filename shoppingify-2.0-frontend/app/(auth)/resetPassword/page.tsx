'use client'

// external modules
import {
  Flex,
  Container,
  VStack,
  Text,
  FormControl,
  FormErrorMessage,
  Input,
  HStack,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { FocusableElement } from '@chakra-ui/utils'
import { useFormik } from 'formik'
import { use, useState, useRef, RefObject } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NextLink from 'next/link'

// internal modules
import { resetPassword } from '@/utils/auth'
import { ResetPasswordSchema } from '@/common/yupSchemas'

export default function ConfirmEmail (): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const username: string = searchParams.get('email') as string

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef() as RefObject<FocusableElement>

  const [resetPasswordStatus, setResetPasswordStatus] = useState(false)

  const formik = useFormik({
    initialValues: {
      code: '',
      password: ''
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: (values) => {
      use(
        resetPassword(
          values.code,
          values.password,
          username,
          formik,
          setResetPasswordStatus
        )
      )
    }
  })

  return (
    <Flex
      w='100vw'
      h='100vh'
      align={['flex-start', 'center']}
      justify='flex-end'
      bgImage="url('/confirm-bg-img.png')"
      bgPosition={[
        'bottom 30px center',
        'bottom 30px center',
        '10% 40%',
        '18% 40%'
      ]}
      bgRepeat='no-repeat'
      bgSize={['70%', '40%', '35%']}
      p={['20% 5%', '10%', '0 10%']}
    >
      <Container maxW={['100%', '100%', '50%', '36%']} m='auto 0' h='100%'>
        <VStack
          justify={['flex-start', 'flex-start', 'center']}
          spacing={50}
          color='main'
          h='100%'
        >
          <VStack w={['100%', '80%', '100%', '100%']} spacing={8}>
            <VStack w='100%' spacing={4}>
              <Text fontSize='2xl' fontWeight='600' align='center'>
                Reset password
              </Text>
            </VStack>
            <form onSubmit={formik.handleSubmit} style={{ width: '90%' }}>
              <VStack w='100%' spacing={12}>
                <VStack w='100%' spacing={3}>
                  <FormControl
                    isInvalid={
                      Boolean(formik.errors.code) && formik.touched.code
                    }
                  >
                    <Input
                      name='code'
                      type='text'
                      variant='flushed'
                      placeholder='Verification Code'
                      size='lg'
                      focusBorderColor='secondary'
                      onChange={formik.handleChange}
                      value={formik.values.code}
                    />
                    <FormErrorMessage>{formik.errors.code}</FormErrorMessage>
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
                      placeholder='New Password'
                      size='lg'
                      focusBorderColor='secondary'
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    <FormErrorMessage>
                      {formik.errors.password}
                    </FormErrorMessage>
                  </FormControl>
                </VStack>
                <Button
                  type='submit'
                  colorScheme='purple'
                  width='full'
                  mt='350px'
                  onClick={onOpen}
                >
                  Reset
                </Button>
              </VStack>
            </form>
            <NextLink href='/login'>
              <Text
                fontSize='md'
                _hover={{ borderBottomWidth: '1px', borderColor: 'purple' }}
              >
                Proceed to login
              </Text>
            </NextLink>
          </VStack>
        </VStack>
      </Container>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody color='main'>
              {resetPasswordStatus && (
                <>
                  <HStack justify='center' p='10% 0'>
                    <Text fontSize='xl'>
                      Password has been reset successfully
                    </Text>
                    <CheckCircleIcon boxSize={6} color='green.500' />
                  </HStack>
                  <HStack justify='center' pb='10%'>
                    <Button onClick={() => router.push('/login/')}>
                      Proceed to login
                    </Button>
                  </HStack>
                </>
              )}
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  )
}
