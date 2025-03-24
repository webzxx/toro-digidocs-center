"use client";

import { QueryClient, QueryClientProvider, isServer} from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface QueryProviderProps {
    children: ReactNode
}

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000,
      }
    }   
  });
}

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;

}

const ReactQueryProvider: FC<QueryProviderProps> = ({children}) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
