import { createContext, ReactNode, useContext, useState } from "react";
import { CustomAlert } from "../UI";

interface StatusType {
  loading: boolean | null;
  message: string | null;
  severity: string | null;
};

interface StatusContextType {
  status: StatusType | undefined;
  setStatus: (user: StatusType | undefined) => void;
};

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const useStatus = () => {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export function StatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<StatusType | undefined>();

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
      <CustomAlert />
    </StatusContext.Provider>
  );
}
