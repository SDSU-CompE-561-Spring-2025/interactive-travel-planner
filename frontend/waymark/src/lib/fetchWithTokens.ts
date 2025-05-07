import { useUserStore } from '@/store/userStore';

export async function fetchWithToken(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = useUserStore.getState().token;

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
