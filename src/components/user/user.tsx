
import { LoginUser, CreateUser } from "../../components"
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CustomAlert } from '../../UI'

export function User() {
  const [ errorMessage, setErrorMessage] = useState('')
  useEffect((() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
}),[errorMessage])

  return (
    <div className="user">
      <Routes>
        <Route path='login' element={<LoginUser setErrorMessage={setErrorMessage}/>} />
        <Route path='create' element={<CreateUser setErrorMessage={setErrorMessage}/>} />
      </Routes>
      {errorMessage && <CustomAlert message={errorMessage} severity={'error'}/>}
    </div>
  );
}

