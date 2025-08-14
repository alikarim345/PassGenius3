import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Default fetch function for queries
const defaultQueryFn = async ({ queryKey }: { queryKey: readonly unknown[] }): Promise<any> => {
  const response = await fetch(queryKey[0] as string);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

queryClient.setDefaultOptions({
  queries: {
    queryFn: defaultQueryFn,
  },
});

// Helper function for API requests (POST, PUT, DELETE)
export const apiRequest = async (url: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export { queryClient };