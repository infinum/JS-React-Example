import React, { FC } from 'react';
import { NextSeo, NextSeoProps } from 'next-seo';

export const Seo: FC<NextSeoProps> = (props) => {
	return <NextSeo titleTemplate="JS-React-Example | %s" {...props} />;
};
