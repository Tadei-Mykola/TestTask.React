import './App.scss'
import { Layout } from './layout'
import { UserProvider } from './hooks';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

export default function App() {
  const queryClient = new QueryClient()

  return ( 
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Layout/>
    </UserProvider>
   </QueryClientProvider>
  );
} 