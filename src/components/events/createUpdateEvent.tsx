import { Button, FormGroup, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { useStatus } from '../../hooks';
import { EventInterface } from '../../interfaces/event.interfaces';
import { EventsService } from '../../services';
import { FormInput } from '../../UI';

const eventsService = new EventsService();

export function CreateUpdateEvent() {
  const { setStatus } = useStatus();
  const minDateTime = dayjs().add(1, 'hour');
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ['addEvent'],
    mutationFn: (event: EventInterface) => eventsService.createNewEvent(event),
    onMutate: () => setStatus(eventsService.autoSetStatus(true, 'Очікування відповіді від сервера', 'info')),
    onSuccess: () => {
      queryClient.fetchInfiniteQuery({
        queryKey: ['events'],
        initialPageParam: undefined
      });
      setStatus(eventsService.autoSetStatus(false, 'Задачу успішно додано', 'success'));
      reset();
    },
    onError: (error) => setStatus(eventsService.autoSetStatus(false, error.message, 'error'))
  });

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      dueDate: minDateTime,
      isDone: false,
      priority: 'NORMAL'
    }
  });

  const checkDate = (newDate: dayjs.Dayjs | null) => {
    if (newDate && dayjs(newDate).isAfter(minDateTime)) {
      setValue('dueDate', newDate);
      clearErrors('dueDate');
    } else {
      setError('dueDate', {
        type: 'manual',
        message: 'Invalid date'
      });
    }
  };

  const formFields: { label: string; name: 'title' | 'description' }[] = [
    { label: 'Тайтл', name: 'title' },
    { label: 'Опис', name: 'description' }
  ];

  return (
    <FormGroup>
      {formFields.map((field) => (
        <FormInput
          key={field.name}
          label={field.label}
          name={field.name}
          register={register}
          error={errors[field.name]}
        />
      ))}


      <RadioGroup defaultValue="NORMAL" {...register("priority")}>
        <FormControlLabel value="NORMAL" control={<Radio />} label="Звичайна" />
        <FormControlLabel value="IMPORTANT" control={<Radio />} label="Важлива" />
        <FormControlLabel value="CRITICAL" control={<Radio />} label="Критична" />
      </RadioGroup>

      <DateTimePicker onChange={checkDate} minDateTime={minDateTime} value={getValues("dueDate")} />

      <Button onClick={handleSubmit((data) => mutate(data))}>&#10003;</Button>
    </FormGroup>
  );
}
