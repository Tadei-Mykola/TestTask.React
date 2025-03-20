
import { useState, useEffect } from 'react';
import { ConfirmationModal } from '../../UI';
import { EventsService } from '../../services';
import { useStatus } from '../../hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const eventsService = new EventsService()
export function EventItem(props) {
  const [event, setEvent] = useState(props.event)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { setStatus } = useStatus()
  const [isExpired, setIsExpired] = useState(false);
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: deleteTodo } = useMutation({
    mutationKey: ['deleteEvent'],
    mutationFn: () => eventsService.deleteEventById(event.id),
    onMutate: () => setStatus(eventsService.autoSetStatus(true, 'Очікування відповіді від сервера', 'info')),
    onSuccess: () => {
      queryClient.fetchInfiniteQuery({
        queryKey: ['events'],
        initialPageParam: undefined
      })
      setStatus(eventsService.autoSetStatus(false, 'Подію видалено', 'success'))
    },
    onError: (error) => setStatus(eventsService.autoSetStatus(false, error.message, 'error')),
    onSettled: () => setModalIsOpen(false),
  })
  const toggleEditMode = () => {
    navigate(`create-update-event/${event.id}`)
  }
  useEffect(() => {
    if (event?.dueDate) {
      const currentDate = new Date();
      const todoDate = new Date(event.dueDate);
      setIsExpired(todoDate < currentDate)
    }
    setEvent(props.event);
  }, [props.event]);


  return (
    <div>
      <h1>{event.title}</h1> 
      <p>{event.description}</p>
      <p>{event.dueDate}</p>
        <div>
          <Button onClick={toggleEditMode} disabled={isExpired} variant='contained'>Редагувати</Button>
          <Button onClick={() => setModalIsOpen(true)} variant='outlined'>Видалити</Button>
          <ConfirmationModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} onConfirm={deleteTodo} text={"Ви дійсно хочете видалити дію"} isDelete={true}/>
        </div>
    </div>
  );
}
