import { FC } from 'react';
import { Container, Heading } from '@chakra-ui/layout';
import { useTranslation } from 'next-i18next';

export const TodoLists: FC = () => {
	const { t } = useTranslation('common');

	return (
		<Container py={5}>
			<Heading>{t('removeMe')}</Heading>
		</Container>
	);
};
