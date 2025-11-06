import { createPublicEnv } from 'next-public-env';
import { publicEnv } from './validate-env.client';

const env = publicEnv();

export const { getPublicEnv, PublicEnv } = createPublicEnv(env);
