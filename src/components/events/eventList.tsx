import { EventItem } from '../../components';
import { useStatus } from '../../hooks';
import { EventsService } from '../../services';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { InfinitySpin } from 'react-loader-spinner';

const eventsService = new EventsService()
export function EventsList() {
  const { setStatus } = useStatus()
  const limitTodos = 10;
  const {data, isLoading, error, isSuccess, isError, isPending, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
    queryKey: ["events"],
    queryFn: ({pageParam = 1}) => {
      setStatus(eventsService.autoSetStatus(isLoading));
      return eventsService.getEvents(pageParam, limitTodos)},
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.currentPage + 1 : undefined
  })

  useEffect(() => {
    if (isSuccess && !isPending) {
      setStatus(eventsService.autoSetStatus(isLoading, 'Data loaded successfully', 'success'));
    }
    if (isError) {
      setStatus(eventsService.autoSetStatus(isLoading, error.message, 'error'));
    }
  }, [isSuccess, isError, hasNextPage]);

  const todos = data?.pages.flatMap(page => page.events) || []

  return (
    <div>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => fetchNextPage()}
        hasMore={hasNextPage && !isFetchingNextPage}
        loader={<InfinitySpin visible={true} width="200" color="#4fa94d" ariaLabel="infinity-spin-loading" />}
      >
        {todos.map((todo) => (
          <EventItem key={todo.id} todo={todo} />
      ))}
      </InfiniteScroll>
    </div>
  );
}

