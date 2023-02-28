// external modules
import { FormikProps } from 'formik'
import { Dispatch, SetStateAction } from 'react'

import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUserSession
} from 'amazon-cognito-identity-js'

// internal modules
import { User, UserLogin, ResetPasswordVc, ResetPassword } from 'common/types'

interface DataMapping {
  property: string
  mapping: string
}

const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
  ClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID
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
    Pool: userPool
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

export function getSession (): string {
  const cognitoUser = userPool.getCurrentUser()
  if (cognitoUser != null) {
    cognitoUser?.getSession(function (err: any, session: CognitoUserSession) {
      if (err != null) {
        return 'error'
      } else {
        // console.log("session validity: " + session.isValid());
        // Set the profile info
        cognitoUser?.getUserAttributes(function (err, result) {
          if (err != null) {
            console.log('err')
            return 'err'
          } else {
            console.log(result)
            return 'result'
          }

          // document.getElementById("email_value").innerHTML = result[2].getValue();
        })
        return 'session'
      }
    })
  } else {
    return 'gg'
  }
  return 'gsdfsdg'
}
