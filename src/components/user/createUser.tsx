
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, FormGroup } from '@mui/material';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks';
import { registrationSchema } from '../../schemas';
import { LocalStorageService, UserService } from '../../services';
import { FormInput } from "../../UI";


const userService = new UserService()
const localStorageService = new LocalStorageService()
export function CreateUser( {setErrorMessage} ) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
  })
  const { setUser } = useUser()
  const navigate = useNavigate();

  const registration = (data) => {
    userService.registration(data).then(async(response) => {
      localStorageService.setAccessToken(response.data.access_token)
      setUser(await userService.getUserData())
      navigate('/events')
    })
   .catch((error) => {
    setErrorMessage(error.response.data.message)
   })
  }

  const formFields: {label: string, name: 'name' | 'email' | 'password'}[] = [
    { label: 'Ведіть імʼя', name: 'name' },
    { label: 'Ведіть пошту', name: 'email' },
    { label: 'Ведіть пароль', name: 'password' },
  ];


  return (
    <Box display={'flex'}>
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
        <Button onClick={handleSubmit(registration)} >Зареєструватися</Button>
      </FormGroup>  

      <Box  sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Link to="../login" style={{textDecoration: 'none'}}>Увійти</Link>
      </Box>

    </Box>
  );
}

