import { FC } from 'react';
import { Button, HStack } from '@chakra-ui/react';

export interface IBasicPagination {
	current: number;
	total: number;
	onPrev?: () => void;
	hasPrev?: boolean;
	onNext?: () => void;
	hasNext?: boolean;
}

export const BasicPagination: FC<IBasicPagination> = ({ hasPrev, hasNext, onPrev, onNext, current, total }) => {
	return (
		<HStack p={50} spacing={2} justify="center">
			<Button isDisabled={!hasPrev} onClick={onPrev}>
				Previous
			</Button>
			<Button as="div">{`${current}/${total}`}</Button>
			<Button isDisabled={!hasNext} onClick={onNext}>
				Next
			</Button>
		</HStack>
	);
};
