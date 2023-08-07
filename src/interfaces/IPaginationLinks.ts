import { ILink } from '@datx/jsonapi/interfaces/JsonApi';

export type PaginationLinks = Record<'next' | 'prev', ILink>;
