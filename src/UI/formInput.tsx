
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';

export function FormInput({ label, name, register, error }) {
  return (
    <FormControl error={error?.message} margin='dense'>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Input name={name} {...register(name)} />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
}

