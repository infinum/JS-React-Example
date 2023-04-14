import { FC } from 'react';
import { Button, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { CollectionResponse } from '@datx/swr';
import { IPaginationMeta } from '@/interfaces/IPaginationMeta';
import { PaginationLinks } from '@/interfaces/IPaginationLinks';
import { ILink } from '@datx/jsonapi/interfaces/JsonApi';

export interface IPagination {
	hasNext?: boolean;
	hasPrevious?: boolean;
	currentPage?: number;
	totalPages?: number;
}

export const getPagination = (response?: CollectionResponse) => {
	if (response) {
		const { meta, links } = response;
		const { next, prev } = links as PaginationLinks;
		const { currentPage, totalPages } = meta as IPaginationMeta;

		return {
			hasNext: Boolean(next),
			hasPrevious: Boolean(prev),
			currentPage: currentPage,
			totalPages: totalPages,
		};
	}

	return {};
};

export interface IBasicPagination {
	pagination: IPagination;
}

export const BasicPagination: FC<IBasicPagination> = ({ pagination }) => {
	const { query } = useRouter();
	const { hasNext, hasPrevious, currentPage = 1, totalPages } = pagination;

	return (
		<HStack justify="center" p={50} spacing={2}>
			<Button
				as={hasPrevious ? NextLink : undefined}
				href={{ query: { ...query, page: currentPage - 1 } }}
				isDisabled={!hasPrevious}
			>
				Previous
			</Button>
			<Button as="div">{`${currentPage}/${totalPages}`}</Button>
			<Button
				as={hasNext ? NextLink : undefined}
				href={{ query: { ...query, page: currentPage + 1 } }}
				isDisabled={!hasNext}
			>
				Next
			</Button>
		</HStack>
	);
};
