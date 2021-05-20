import React, { FC } from 'react';
import Head from 'next/head';

interface IHeadProps {
	title?: string;
	description?: string;
}

export const Meta: FC<IHeadProps> = ({
	title = 'React Example | Infinum',
	description = 'Javascript React Example project landing page ',
}) => {
	return (
		<Head>
			<title>{title}</title>
			<meta id="meta-description" name="description" content={description} />
			<link rel="icon" href="/favicon.ico" />
		</Head>
	);
};
