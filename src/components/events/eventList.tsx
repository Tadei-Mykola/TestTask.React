import { Badge, Box, Button } from '@mui/material';
import { DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { InfinitySpin } from 'react-loader-spinner';
import { EventItem } from '../../components';
import { useStatus } from '../../hooks';
import { EventsService } from '../../services';

const eventsService = new EventsService();

function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '🌚' : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export function EventsList({ filter, setDayForFilter }) {
  const { setStatus } = useStatus();
  const queryClient = useQueryClient();
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [currentMounth, setCurrentMounth] = useState(dayjs())
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(dayjs())
  const limitTodos = 10;
  const {
    data,
    isLoading,
    error,
    isSuccess,
    isError,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['events'],
    queryFn: ({ pageParam = 1 }) => {
      setStatus(eventsService.autoSetStatus(isLoading));
      return eventsService.getEvents(pageParam, limitTodos, filter);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.currentPage + 1 : undefined),
  });

  const { data: eventsDays } = useQuery({
    queryKey: ['eventsDays', currentMounth.format("YYYY-MM")],
    queryFn: () => eventsService.getDays(currentMounth),
  })

  const handleMonthYearChange = (date: Dayjs) => {
    setCurrentMounth(date)
  };

  const handleDayClick = (date: Dayjs) => {
    setSelectedDay(date);
    setDayForFilter(date.toISOString())
  };

  const cancelDay = () => {
    setSelectedDay(dayjs());
    setDayForFilter('');
  }

  useEffect(() => {
    queryClient.fetchInfiniteQuery({
      queryKey: ['events'],
      initialPageParam: undefined,
    });
  }, [filter]);


  useEffect(() => {
    if (isSuccess && !isPending) {
      setStatus(eventsService.autoSetStatus(isLoading, 'Data loaded successfully', 'success'));
    }
    if (isError) {
      setStatus(eventsService.autoSetStatus(isLoading, error.message, 'error'));
    }
  }, [isSuccess, isError, hasNextPage]);

  const events = data?.pages.flatMap((page) => page.events) || [];
 
  useEffect(() => {
    setHighlightedDays(eventsDays);
  }, [eventsDays])

  return (
    <Box display="flex" gap={3} width="100%">
      <Box sx={{ flex: 2 }}>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchNextPage()}
          hasMore={hasNextPage && !isFetchingNextPage}
          loader={<InfinitySpin width="200" color="#4fa94d" />}
        >
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </InfiniteScroll>
      </Box>
      <Box sx={{ flex: 1 }} display="flex" flexDirection={'column'}>
        <DateCalendar 
          onChange={handleDayClick}
          value={selectedDay}
          onMonthChange={handleMonthYearChange}
          onYearChange={handleMonthYearChange}
          slots={{
              day: ServerDay,
            }}
          slotProps={{
            day: {
              highlightedDays,
            } as any,
          }}/>
          { filter.dueDate && <Button onClick={cancelDay}>Скасувати день</Button>}
      </Box>
    </Box>
  );
}