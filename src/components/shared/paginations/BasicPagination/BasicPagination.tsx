import { FC } from 'react';
import { Button, HStack } from '@chakra-ui/react';

export interface IBasicPagination {
	hasPrev: boolean;
	hasNext: boolean;
}

export const BasicPagination: FC<IBasicPagination> = ({ hasPrev, hasNext }) => {
	return (
		<HStack p={50} spacing={2} justify="center">
			<Button isDisabled={!hasPrev}>Previous</Button>
			<Button>1</Button>
			<Button isActive>2</Button>
			<Button>3</Button>
			<Button>4</Button>
			<Button>5</Button>
			<Button isDisabled={!hasNext}>Next</Button>
		</HStack>
	);
};
