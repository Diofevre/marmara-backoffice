import useSWR from 'swr';
import axios from "axios"

// Créer une instance Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

// Fetcher pour SWR
const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useUnreadNotifications() {
  const { data, error } = useSWR('/api/order/unread-notifications-count', fetcher);
  console.log(data)

  return {
    count: data?.count,
    isLoading: !error && !data,
    isError: error,
  };
}

// export function usemarkAsReadNotifications() {
//   const { data, error } = useSWR('/api/order/mark-notifications-read', fetcher2);
//   console.log(data);

//   return {
//     count: data,
//     isLoading: !error && !data,
//     isError: error,
//   };
// }

export const markAsReadNotifications = async () => {
  const response = await api.put(`/api/order/mark-notifications-read`);
  return response;
};