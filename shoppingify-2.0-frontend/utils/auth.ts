// ----- external modules ----- //
import { FormikProps } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUserSession,
  CookieStorage
} from 'amazon-cognito-identity-js'
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import Cookies from 'js-cookie'
import * as jose from 'jose'

// ----- internal modules ----- //
// types
import {
  User,
  UserLogin,
  ResetPasswordVc,
  ResetPassword
} from '@/common/types/auth_types'

interface DataMapping {
  property: string
  mapping: string
}

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
  ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
  Storage: new CookieStorage({
    domain:
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : 'shoppingify-2-0-frontend.vercel.app',
    expires: 1 / 24
  })
})

export async function createAccount (
  formData: User,
  formik: FormikProps<User>,
  setUsername: Dispatch<SetStateAction<string>>
): Promise<void> {
  const dataMapping: DataMapping[] = [
    { property: 'given_name', mapping: 'fname' },
    { property: 'family_name', mapping: 'lname' },
    { property: 'gender', mapping: 'gender' },
    { property: 'birthdate', mapping: 'birthdate' }
  ]

  const attributeList: CognitoUserAttribute[] = []

  dataMapping.forEach((item: DataMapping) => {
    attributeList.push(
      new CognitoUserAttribute({
        Name: item.property,
        Value: formData[item.mapping as keyof User]
      })
    )
  })

  userPool.signUp(
    formData.email,
    formData.password,
    attributeList,
    [],
    function (err, result) {
      if (err != null) {
        formik.setErrors({ email: err.message })
      } else {
        const cognitoUser = result?.user
        setUsername(
          cognitoUser?.getUsername() != null
            ? cognitoUser.getUsername()
            : 'undefined'
        )
      }
    }
  )
}

export async function confirmAccount (
  username: string,
  code: string,
  setConfirmed: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  const userData = {
    Username: decodeURIComponent(username).replace(/\+/g, ' '),
    Pool: userPool
  }

  const cognitoUser = new CognitoUser(userData)
  cognitoUser.confirmRegistration(code, false, function (err) {
    if (err != null) {
      console.log(err.message)
    } else {
      setConfirmed(true)
    }
  })
}

export async function resendConfirmationCode (
  username: string,
  setCodeSent: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  const userData = {
    Username: decodeURIComponent(username).replace(/\+/g, ' '),
    Pool: userPool
  }

  const cognitoUser = new CognitoUser(userData)
  cognitoUser.resendConfirmationCode(function (err) {
    if (err != null) {
      console.log(err.message)
    } else {
      setCodeSent(true)
    }
  })
}

export async function authenticateUser (
  username: string,
  password: string,
  formik: FormikProps<UserLogin>,
  setLoggedIn: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  const userData = {
    Username: username,
    Pool: userPool,
    Storage: new CookieStorage({
      domain:
        process.env.NODE_ENV === 'development'
          ? 'localhost'
          : 'shoppingify-2-0-frontend.vercel.app',
      expires: 1 / 24
    })
  }

  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password
  })

  const cognitoUser = new CognitoUser(userData)
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function () {
      setLoggedIn(true)
    },

    onFailure: function (err) {
      if (err.message === 'User does not exist.') {
        formik.setErrors({ email: err.message })
      } else {
        formik.setErrors({ password: 'Incorrect password' })
      }
    }
  })
}

export async function resetPasswordVc (
  username: string,
  formik: FormikProps<ResetPasswordVc>,
  setCodeSent: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  const userData = {
    Username: username,
    Pool: userPool
  }

  const cognitoUser = new CognitoUser(userData)
  cognitoUser.forgotPassword({
    onSuccess: function () {
      setCodeSent(true)
    },

    onFailure: function (err) {
      if (err.message === 'Username/client id combination not found.') {
        formik.setErrors({ email: 'User does not exist.' })
      }
    }
  })
}

export async function resetPassword (
  code: string,
  newPassword: string,
  username: string,
  formik: FormikProps<ResetPassword>,
  setResetPasswordStatus: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  const userData = {
    Username: username,
    Pool: userPool
  }

  const cognitoUser = new CognitoUser(userData)
  cognitoUser.confirmPassword(code, newPassword, {
    onSuccess: function () {
      setResetPasswordStatus(true)
    },

    onFailure: function (err) {
      if (
        err.message === 'Invalid verification code provided, please try again.'
      ) {
        formik.setErrors({ code: err.message })
      }
    }
  })
}

export async function logout (
  setSignedOut: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  const cognitoUser = userPool.getCurrentUser()
  if (cognitoUser != null) {
    cognitoUser.getSession(function (err: any, session: CognitoUserSession) {
      if (err != null) {
        setSignedOut(false)
      } else {
        const isValid: boolean = session.isValid()
        if (isValid) {
          cognitoUser.globalSignOut({
            onSuccess: function () {
              setSignedOut(true)
            },

            onFailure: function (err) {
              console.log(err)
              setSignedOut(false)
            }
          })
        } else {
          setSignedOut(false)
        }
      }
    })
  }
}

export async function loggedIn (): Promise<{
  signedIn: boolean
  error_message?: string
  email?: string
  jwt?: string
}> {
  return await new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err: any, session: CognitoUserSession) {
        if (err != null) {
          resolve({
            error_message: 'Error: missing credentials. Please login again!',
            signedIn: false
          })
        }
        const isValid: boolean = session.isValid()
        if (isValid) {
          cognitoUser.getUserAttributes(function (err, result) {
            if (err != null) {
              resolve({
                error_message: 'Error: cannot get user attributes',
                signedIn: false
              })
            } else {
              resolve({
                email: result?.filter((pair) => pair.Name === 'email')[0].Value,
                jwt: session.getIdToken().getJwtToken(),
                signedIn: true
              })
            }
          })
        } else {
          resolve({
            error_message: 'Error: session expired. Please login again!',
            signedIn: false
          })
        }
      })
    } else {
      resolve({ error_message: 'Error: user not loggen in', signedIn: false })
    }
  })
}

export async function verifyUser (token: string): Promise<{
  succcess: boolean
  error_message?: string
  payload?: string
}> {
  const response = { succcess: true, error_message: '', payload: '' }

  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    tokenUse: 'id',
    clientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID
  })

  try {
    const payload = await verifier.verify(token)
    response.payload = JSON.stringify(payload)
  } catch {
    response.error_message = 'Token is not valid'
    response.succcess = false
  }
  return response
}

export function getUsername (payload: string): string {
  const parsedData = JSON.parse(payload)
  return parsedData.email
}

export function getUsernameFromCookies (): string {
  const allCookies = Cookies.get()
  let username = ''

  for (const [key, value] of Object.entries(allCookies)) {
    if (key.includes('idToken')) {
      username = getUsername(JSON.stringify(jose.decodeJwt(value)))
    }
  }

  return username
}
