import { api } from './api';
import type { InboxResponse } from '@/types/contracts/notification';

export const getInbox = (page = 1, limit = 10) =>
  api<InboxResponse>(
    `/notifications/inbox?page=${page}&limit=${limit}`,
  );