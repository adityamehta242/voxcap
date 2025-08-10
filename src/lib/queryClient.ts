import { QueryClient } from '@tanstack/react-query';

declare global {
  var queryClient: QueryClient | undefined;
}

// Reuse the same QueryClient across HMR in development
export const queryClient = globalThis.queryClient || new QueryClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.queryClient = queryClient;
}

export default queryClient;
