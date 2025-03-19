
import { useState, useEffect } from 'react';
import { ConfirmationModal } from '../../UI';
import { EventsService } from '../../services';
import { useStatus } from '../../hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const eventsService = new EventsService()
export function EventItem(props) {
  const [event, setEvent] = useState(props.event)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false)
  const { setStatus } = useStatus()
  const [isExpired, setIsExpired] = useState(false);
  const queryClient = useQueryClient()

  const { mutate: deleteTodo } = useMutation({
    mutationKey: ['deleteEvent'],
    mutationFn: () => eventsService.deleteEventById(event.id),
    onMutate: () => setStatus(eventsService.autoSetStatus(true, 'Очікування відповіді від сервера', 'info')),
    onSuccess: () => {
      queryClient.fetchInfiniteQuery({
        queryKey: ['events'],
        initialPageParam: undefined
      })
      setStatus(eventsService.autoSetStatus(false, 'Задачу видалено', 'success'))
    },
    onError: (error) => setStatus(eventsService.autoSetStatus(false, error.message, 'error')),
    onSettled: () => setModalIsOpen(false),
  })

  const { mutate: changeName } = useMutation({
    mutationKey: ['changeTodo'],
    mutationFn: () => eventsService.updateEvent(event.id, event),
    onMutate: () => setStatus(eventsService.autoSetStatus(true, 'Очікування відповіді від сервера', 'info')),
    onSuccess: () => {
      queryClient.fetchInfiniteQuery({
        queryKey: ['todos'],
        initialPageParam: undefined
      })
      setStatus(eventsService.autoSetStatus(false, 'Задачу успішно оновлено', 'success'))
    },
    onError: (error) => setStatus(eventsService.autoSetStatus(false, error.message, 'error')),
    onSettled: () => setIsEditMode(false),
  })

  const { mutate: changeToDone } = useMutation({
    mutationKey: ['changeTodo'],
    mutationFn: () => eventsService.updateEvent(event.id, {...event, isDone: true}),
    onMutate: () => setStatus(eventsService.autoSetStatus(true, 'Очікування відповіді від сервера', 'info')),
    onSuccess: () => {
      queryClient.fetchInfiniteQuery({
        queryKey: ['todos'],
        initialPageParam: undefined
      })
      setStatus(eventsService.autoSetStatus(false, 'Задачі змінено статус', 'success'))
    },
    onError: (error) => setStatus(eventsService.autoSetStatus(false, error.message, 'error')),
  })

  useEffect(() => {
    if (event.dueDate) {
      const currentDate = new Date();
      const todoDate = new Date(event.date);
      setIsExpired(todoDate < currentDate)
    }
    setEvent(props.event);
  }, [props.event]);

  const changeEvent = (event) => {
    setEvent((prev) => ({...prev, name: event.target.value}))
  }

  const toggleEditMode = () => { isEditMode ? changeName(): setIsEditMode(true) }

  return (
    <div style={{ backgroundColor: event.isDone ? 'green' : isExpired ? 'purple' : '' }}>
      {
        !isEditMode ? <h1>{event.name}</h1> : 
        <input value={event.name} onChange={changeEvent}></input>
      }
      <div>
        <button onClick={toggleEditMode} disabled={event.isDone || isExpired}>{ isEditMode ? '\u2713' : '\u270F' }</button>
        <div>
          <button onClick={changeToDone} disabled={event.isDone || isExpired}>&#10003;</button>
          <button onClick={() => setModalIsOpen(true)}>&#x2715;</button>
        </div>
        <ConfirmationModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} onConfirm={deleteTodo} text={"Ви дійсно хочете видалити дію"} isDelete={true}/>
      </div>
    </div>
  );
}
