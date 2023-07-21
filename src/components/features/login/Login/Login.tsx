import { Card } from '@/components/core/Card/Card';
import { LoginForm } from '@/components/shared/auth/LoginForm/LoginForm';
import { Button, Container, ContainerProps, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { FC } from 'react';

export const Login: FC<ContainerProps> = (props) => {
	const { t } = useTranslation('login');

	return (
		<Container minW="container.sm" px={{ base: 3, sm: 8 }} py={{ base: '12', md: '10' }} {...props}>
			<Stack spacing="8">
				<Stack spacing="6">
					<Stack textAlign="center" spacing={{ base: '2', md: '3' }}>
						<Heading as="h1" size="lg">
							{t('heading')}
						</Heading>
						<HStack justify="center" spacing="1">
							<Text color="muted">{t('registerMessage')}</Text>
							<Button as={NextLink} colorScheme="red" href="/register" variant="link">
								{t('signUp.label')}
							</Button>
						</HStack>
					</Stack>
				</Stack>
				<Card py={{ base: '0', sm: '8' }} px={{ base: '4', sm: '10' }}>
					<LoginForm />
				</Card>
			</Stack>
		</Container>
	);
};
