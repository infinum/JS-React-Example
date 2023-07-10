import { Box, Container, Heading } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { FC, ReactNode } from 'react';

export interface IFlightListSection {
	children?: ReactNode;
}

export const FlightListSection: FC<IFlightListSection> = ({ children }) => {
	const { t } = useTranslation('flight-list-section');

	return (
		<Container py={10} size="xl">
			<Box as="section">
				<Heading as="h1" mb={3} size="lg">
					{t('title')}
				</Heading>

				{children}
			</Box>
		</Container>
	);
};
