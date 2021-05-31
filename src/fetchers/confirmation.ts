import { AppCollection } from '@/store';

export const ConfirmUser = async (client: AppCollection, token: string) => {
	await client.request('confirmations', 'PATCH', {
		data: {
			type: 'confirmation',
			id: '',
			attributes: {
				confirmationToken: token,
			},
		},
	});
};
