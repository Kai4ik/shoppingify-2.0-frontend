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
import { useRouter } from 'next/navigation'

// internal modules
import { resetPasswordVc } from '@/utils/auth'
import { ResetPasswordVcSchema } from '@/common/yupSchemas'

export default function ConfirmEmail (): JSX.Element {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef() as RefObject<FocusableElement>

  const [codeSent, setCodeSent] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: ResetPasswordVcSchema,
    onSubmit: (values) => {
      use(resetPasswordVc(values.email, formik, setCodeSent))
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
                Get verification code
              </Text>
              <Text fontSize='l' fontWeight='400' align='center'>
                Enter the email address assosciated with your account and we
                will send you a verification code
              </Text>
            </VStack>
            <form onSubmit={formik.handleSubmit} style={{ width: '90%' }}>
              <VStack w='100%' spacing={12}>
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
                <Button
                  type='submit'
                  colorScheme='purple'
                  width='full'
                  mt='350px'
                  onClick={onOpen}
                >
                  Submit
                </Button>
              </VStack>
            </form>
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
              {codeSent
                ? (
                  <>
                    <HStack justify='center' p='10% 0'>
                      <Text fontSize='xl'> Code was sent </Text>
                      <CheckCircleIcon boxSize={6} color='green.500' />
                    </HStack>
                    <HStack justify='center' pb='10%'>
                      <Button
                        onClick={() =>
                          router.push(
                          `/auth/resetPassword?email=${formik.values.email}`
                          )}
                      >
                        Continue
                      </Button>
                    </HStack>
                  </>
                  )
                : (
                  <HStack justify='center' p='10% 0'>
                    <Text fontSize='xl'> {formik.errors.email} </Text>
                  </HStack>
                  )}
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  )
}
