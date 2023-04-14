import { FC, ReactNode } from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

export interface IFlightListSection {
	children?: ReactNode;
}

export const FlightListSection: FC<IFlightListSection> = ({ children }) => {
	const { t } = useTranslation(['flight-list-section']);

	return (
		<Container py={10} size="xl">
			<Box as="section">
				<Heading as="h1" mb={3} size="lg">
					{t('flight-list-section:title')}
				</Heading>

				{children}
			</Box>
		</Container>
	);
};
