
import './createUser.scss';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { UserService, LocalStorageService } from '../../../services';
import { useUser } from '../../../hooks'
import { useNavigate } from 'react-router-dom';
import { registrationSchema } from '../../../schemas';
import { FormInput } from "../../../UI"
import { Button, FormGroup } from '@mui/material';


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
    console.log(data)
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
    <div className="create-user">
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
        <Button onClick={handleSubmit(registration)} >Зареєструватися</Button>
      </FormGroup>  

      <div className="login">
        <Link to="../login" style={{textDecoration: 'none'}}>Увійти</Link>
      </div>

    </div>
  );
}

