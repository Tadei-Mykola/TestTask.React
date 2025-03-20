
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, FormGroup } from '@mui/material';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from "../../UI";
import { useUser } from '../../hooks';
import { loginSchema } from '../../schemas';
import { LocalStorageService, UserService } from '../../services';

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
    <Box display={'flex'}>
      <Box  sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Link to="../create" style={{textDecoration: 'none'}}>Реєстрація</Link>
      </Box>
      <FormGroup sx={{flex: 1}}>   
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
    </Box>
  );
}

