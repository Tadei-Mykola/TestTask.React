import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';
import { useStatus } from '../hooks';
export function CustomAlert () {
  const [isOpenCustomAlert, setIsOpenCustomAlert] = useState(false)
  const statusContext = useStatus();
  const status = statusContext?.status;

  useEffect((() => {
    if (status?.message) {
      setIsOpenCustomAlert(true);
      const timer = setTimeout(() => {
        setIsOpenCustomAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }),[status?.message, status?.loading])

  if (!status?.message) {
    return null;
  }

  return (
    <Alert 
      style={{
        display: isOpenCustomAlert ? "flex" : "none",
        position: 'fixed',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '25px',
        alignItems: 'center',
        textAlign: 'center',
      }} 
      severity={status?.severity}
    >
      {status.message}
    </Alert>
  );
}
