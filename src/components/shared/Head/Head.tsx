import React, { FC } from 'react';
import NextHead from 'next/head';

interface IHeadProps {
	title?: string;
	description?: string;
}

export const Head: FC<IHeadProps> = ({
	title = 'React Example | Infinum',
	description = 'Javascript React Example project landing page ',
}) => {
	return (
		<NextHead>
			<title>{title}</title>
			<meta id="meta-description" name="description" content={description} />
			<link rel="icon" href="/favicon.ico" />
		</NextHead>
	);
};
