
import './loginUser.scss';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FormInput } from "../../../UI"
import { UserService, LocalStorageService } from '../../../services';
import { useUser } from '../../../hooks'
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../../schemas';
import { Button, FormGroup } from '@mui/material';

const userService = new UserService()
const localStorageService = new LocalStorageService()
export function LoginUser({setErrorMessage}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  })
  const { setUser } = useUser()
  const navigate = useNavigate();
  const login = (data) => {
    userService.login(data.login, data.password).then(async (response) => {
      localStorageService.setAccessToken(response.data.access_token)
      setUser(await userService.getUserData())
      navigate('/events')
    })
   .catch((error) => {
    setErrorMessage(error.response.data.message)
   })
  }

  const formFields: {label: string, name: 'login' | 'password'}[] = [
    { label: 'Пошта', name: 'login' },
    { label: 'Пароль', name: 'password' },
  ];

  return (
    <div className="login-user">
      <div className="registration">
        <Link style={{textDecoration: 'none'}} to="../create">Реєстрація</Link>
      </div>
      <FormGroup style={{ width: '50%' }}>   
        {formFields.map((field) => (
          <FormInput
            key={field.name}
            label={field.label}
            name={field.name}
            register={register}
            error={errors[field.name]}
          />
        ))}
        <Button onClick={handleSubmit(login)}>Увійти</Button>
      </FormGroup>
    </div>
  );
}

