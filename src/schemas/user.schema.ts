import * as yup from "yup"

export const loginSchema = yup
.object({
  login: yup.string().required(),
  password: yup.string().min(6).required(),
})
.required()

export const registrationSchema = yup
.object({
  name: yup.string().min(2).required('Name is required'),
  email: yup.string().email(),
  password: yup.string().min(6).required('Password is required'),
})
.required()