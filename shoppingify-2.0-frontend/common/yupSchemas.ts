import * as Yup from 'yup'
import { User, UserLogin, ResetPasswordVc, ResetPassword } from 'common/types'

export const UserSchema: Yup.Schema<User> = Yup.object().shape({
  fname: Yup.string()
    .min(2, 'First Name is too short (at least 2 characters)')
    .max(50, 'First Name is too long (maximum 50 characters)')
    .required('Required field'),
  lname: Yup.string()
    .min(2, 'Last Name is too short (at least 2 characters)')
    .max(50, 'Last Name is too long (maximum 50 characters)')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required field'),
  gender: Yup.string()
    .oneOf(['male', 'female'] as const, 'Must be either male or female')
    .required('Required field'),
  password: Yup.string()
    .min(8, 'Password is too short (at least 8 characters)')
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Password must contain at least 8 characters, one uppercase, one number and one special case character'
    )
    .required('Required field'),
  birthdate: Yup.string().required()
})

export const UserLoginSchema: Yup.Schema<UserLogin> = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required field'),
  password: Yup.string()
    .min(8, 'Password is too short (at least 8 characters)')
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Password must contain at least 8 characters, one uppercase, one number and one special case character'
    )
    .required('Required field')
})

export const ResetPasswordVcSchema: Yup.Schema<ResetPasswordVc> =
  Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required field')
  })

export const ResetPasswordSchema: Yup.Schema<ResetPassword> =
  Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password is too short (at least 8 characters)')
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'Password must contain at least 8 characters, one uppercase, one number and one special case character'
      )
      .required('Required field'),
    code: Yup.string()
      .min(6, 'Must be exactly 6 digits')
      .max(6, 'Must be exactly 6 digits')
      .required('Required')
  })
