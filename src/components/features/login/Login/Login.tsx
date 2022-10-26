import { FC } from 'react';
import NextLink from 'next/link';
import { Button, Container, Heading, HStack, Image, Stack, Text, chakra } from '@chakra-ui/react';
import { LoginForm } from '@/components/shared/auth/LoginForm/LoginForm';
import { useTranslation } from 'next-i18next';
import { Card } from '@/components/core/Card/Card';

export interface ILoginProps {}

export const Login: FC<ILoginProps> = () => {
	const { t } = useTranslation('login');

	return (
        <Container minW="container.sm" px={{ base: 3, sm: 8 }} py={{ base: '12', md: '10' }}>
			<Stack spacing="8">
				<Stack spacing="6">
					<Stack textAlign="center" spacing={{ base: '2', md: '3' }}>
						<Heading size="lg">{t('heading')}</Heading>
						<HStack justify="center" spacing="1">
							<Text color="muted">{t('registerMessage')}</Text>
							<NextLink href="/register" passHref legacyBehavior>
								<Button as="a" colorScheme="red" variant="link">
									{t('signUp.label')}
								</Button>
							</NextLink>
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
