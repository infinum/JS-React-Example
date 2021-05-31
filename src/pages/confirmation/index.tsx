import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Heading, Text, useToast } from '@chakra-ui/react';
import { useDatx } from '@/libs/@datx/jsonapi-react';

import { AuthLayout } from '@/components/shared/layouts/AuthLayout/AuthLayout';
import { ConfirmUser } from '@/fetchers/confirmation';

export const Confirmation: NextPage = () => {
	const router = useRouter();
	const client = useDatx();
	const toast = useToast();

	async function handleConfirm() {
		try {
			await ConfirmUser(client, router.query.token as string);

			toast({
				title: 'Account confirmed',
				status: 'success',
			});
		} catch (errors) {
			if (errors?.error instanceof Array) {
				toast({
					title: errors.error[0].detail,
					status: 'warning',
				});
			} else {
				toast({
					title: 'Unexpected error occured!',
					status: 'warning',
				});
			}
		}
	}

	return (
		<AuthLayout>
			<Heading as="h1" mb={16}>
				Confirmation
			</Heading>
			<Text mb={8}>
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
				standard dummy text ever since the 1500s.
			</Text>
			<Button onClick={handleConfirm}>Confirm</Button>
		</AuthLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	if (!query?.token) {
		throw { code: 403 };
	}

	return { props: query };
};

export default Confirmation;
