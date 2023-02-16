export interface User {
  email: string
  password: string
  fname: string
  lname: string
  gender: string
  birthdate: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface ResetPasswordVc {
  email: string
}

export interface ResetPassword {
  code: string
  password: string
}
