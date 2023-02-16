'use client'

// external modules
import {
  Flex,
  Container,
  VStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Select
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useState, useEffect, use } from 'react'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { useRouter } from 'next/navigation'

// internal modules
import { User } from '@/common/types'
import { UserSchema } from '@/common/yupSchemas'
import { createAccount } from '@/utils/auth'

export default function Register (): JSX.Element {
  const router = useRouter()
  const [birthdate, setBirthdate] = useState(new Date())
  const [username, setUsername] = useState('undefined')

  const handleBdate = async (date: Date): Promise<void> => {
    setBirthdate(date)
    const convertedValue = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    await formik.setFieldValue('birthdate', convertedValue)
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      fname: '',
      lname: '',
      gender: '',
      birthdate: ''
    },
    validationSchema: UserSchema,
    onSubmit: (values: User) => {
      use(createAccount(values, formik, setUsername))
    }
  })

  useEffect(() => {
    if (username !== 'undefined') {
      router.push(`/auth/confirmation/${username}`)
    }
  }, [router, username])

  return (
    <Flex
      w='100vw'
      h='100vh'
      align={['flex-start', 'center']}
      justify='flex-end'
      bgImage="url('/register-bg-img.png')"
      bgPosition={[
        'bottom 30px center',
        'bottom 30px center',
        '15% 50%',
        '20% 50%'
      ]}
      bgRepeat='no-repeat'
      bgSize={['0%', '15%', '25%', '30%']}
      p={['20% 5%', '0 10%']}
    >
      <Container
        maxW={['100%', '100%', '55%', '36%']}
        m='auto 0'
        h={['100%', '90%', '100%']}
      >
        <VStack
          justify={['flex-start', 'flex-start', 'center']}
          spacing={[50, 10, 50]}
          color='main'
          h='100%'
        >
          <Text fontSize='2xl' fontWeight='600'>
            Create Account
          </Text>
          <form onSubmit={formik.handleSubmit} style={{ width: '90%' }}>
            <VStack w='100%' spacing={[12, 8, 12]}>
              <VStack w='100%' spacing={3}>
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
                <FormControl
                  isInvalid={
                    Boolean(formik.errors.fname) && formik.touched.fname
                  }
                >
                  <Input
                    name='fname'
                    type='text'
                    variant='flushed'
                    placeholder='First name'
                    size='lg'
                    focusBorderColor='secondary'
                    onChange={formik.handleChange}
                    value={formik.values.fname}
                  />
                  <FormErrorMessage>{formik.errors.fname}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    Boolean(formik.errors.lname) && formik.touched.lname
                  }
                >
                  <Input
                    name='lname'
                    type='text'
                    variant='flushed'
                    placeholder='Last name'
                    size='lg'
                    focusBorderColor='secondary'
                    onChange={formik.handleChange}
                    value={formik.values.lname}
                  />
                  <FormErrorMessage>{formik.errors.lname}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    Boolean(formik.errors.gender) && formik.touched.gender
                  }
                >
                  <Select
                    name='gender'
                    placeholder='Your gender'
                    variant='flushed'
                    colorScheme='purple'
                    focusBorderColor='secondary'
                    size='lg'
                    onChange={formik.handleChange}
                    value={formik.values.gender}
                  >
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                  </Select>
                  <FormErrorMessage>{formik.errors.gender}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Birth Date</FormLabel>
                  <SingleDatepicker
                    date={birthdate}
                    onDateChange={async (e) => await handleBdate(e)}
                    propsConfigs={{
                      dateNavBtnProps: {
                        variant: 'flushed'
                      },
                      inputProps: {
                        focusBorderColor: 'secondary',
                        size: 'lg'
                      }
                    }}
                  />
                </FormControl>
              </VStack>
              <Button
                type='submit'
                colorScheme='purple'
                width='full'
                mt='350px'
              >
                Register
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Flex>
  )
}
