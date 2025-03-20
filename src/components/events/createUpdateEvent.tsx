import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormControlLabel, FormGroup, Radio, RadioGroup } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useStatus } from '../../hooks';
import { EventInterface } from '../../interfaces/event.interfaces';
import { createUpdateEventSchema } from '../../schemas';
import { EventsService } from '../../services';
import { FormInput } from '../../UI';

const eventsService = new EventsService();

export function CreateUpdateEvent() {
  const { setStatus } = useStatus();
  const minDateTime = dayjs().add(1, 'hour');
  const queryClient = useQueryClient();
  const { eventId } = useParams();
  const isUpdating = !!eventId
  const navigate = useNavigate()

  const navigateToEvents = () => {
    navigate('/events');
  }
  const { mutate } = useMutation({
    mutationKey: ['addEvent'],
    mutationFn: (event: EventInterface) =>   isUpdating ? eventsService.updateEvent(+eventId, event) :eventsService.createNewEvent(event),
    onMutate: () => setStatus(eventsService.autoSetStatus(true, 'Очікування відповіді від сервера', 'info')),
    onSuccess: () => {
      queryClient.fetchInfiniteQuery({
        queryKey: ['events'],
        initialPageParam: undefined
      });
      setStatus(eventsService.autoSetStatus(false, 'Подію успішно додано', 'success'));
      reset();
      navigateToEvents()
    },
    onError: (error) => setStatus(eventsService.autoSetStatus(false, error.message, 'error'))
  });

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      dueDate: minDateTime,
      priority: 'NORMAL'
    },
    resolver: yupResolver(createUpdateEventSchema)
  });

  useEffect(() => {
    if (isUpdating) {
      const fetchEvent = async () => {
        try {
          const event = await eventsService.getEventById(+eventId!);
          reset({
            title: event.title,
            description: event.description,
            dueDate: dayjs(event.dueDate),
            priority: event.priority
          });
        } catch (error) {
          console.error('Помилка при отриманні події:', error);
          setStatus(eventsService.autoSetStatus(false, 'Не вдалося завантажити подію', 'error'));
        }
      };

      fetchEvent();
    }
  }, [eventId])

  const checkDate = (newDate: dayjs.Dayjs | null) => {
    if (newDate && dayjs(newDate).isAfter(minDateTime)) {
      setValue('dueDate', newDate);
      clearErrors('dueDate');
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


      <RadioGroup row defaultValue="NORMAL" >
        <FormControlLabel value="NORMAL" control={<Radio {...register("priority")}/>} label="Звичайна" />
        <FormControlLabel value="IMPORTANT" control={<Radio {...register("priority")}/>} label="Важлива" />
        <FormControlLabel value="CRITICAL" control={<Radio {...register("priority")}/>} label="Критична" />
      </RadioGroup>

      <DateTimePicker  onChange={checkDate} minDateTime={minDateTime} value={getValues("dueDate") as dayjs.Dayjs} />

      <Box display="flex" gap={1} width="100%">
        <Button sx={{ flex: 1 }} onClick={navigateToEvents}>Вернутися</Button>
        <Button sx={{ flex: 1 }} variant="contained" color="primary" onClick={handleSubmit((data) => mutate(data as EventInterface))}>{ isUpdating ? "Зберегти" : "Створити"}</Button>
      </Box>
      
    </FormGroup>
  );
}
