import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		query: { slug },
	} = req;

	const response = await fetch(
		`https://jsonapiplayground.reyesoft.com/v2/${(slug as Array<string>).join('/')}`
	).then((res) => res.json());

	res.status(200).json(response);
};
