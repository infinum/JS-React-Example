import { Box, Heading } from '@chakra-ui/react';
import { FC } from 'react';
import { LoginForm } from '@/components/shared/auth/LoginForm/LoginForm';
import { useTranslation } from 'next-i18next';

export interface ILoginProps {}

export const Login: FC<ILoginProps> = () => {
	const { t } = useTranslation('login');

	return (
		<Box>
			<Heading as="h1">{t('heading')}</Heading>
			<LoginForm />
		</Box>
	);
};
