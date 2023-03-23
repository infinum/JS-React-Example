import { createClient } from '@/datx/create-client';
import { createFactory } from '@datx/test-data-factory';

const client = createClient();

export const factory = createFactory(client);
