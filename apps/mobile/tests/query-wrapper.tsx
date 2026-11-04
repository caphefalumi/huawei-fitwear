import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentType, ReactNode } from "react";
type WrapperProps = { children: ReactNode };

export function createQueryWrapper(
  Provider?: ComponentType<WrapperProps>,
  onClient?: (client: QueryClient) => void,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false, gcTime: 0 },
    },
  });
  onClient?.(queryClient);

  return function QueryWrapper({ children }: WrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        {Provider ? <Provider>{children}</Provider> : children}
      </QueryClientProvider>
    );
  };
}
