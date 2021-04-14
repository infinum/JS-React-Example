import * as React from 'react';
import { Global } from '@emotion/react';

export const Fonts = () => (
	<Global
		styles={`
			@font-face {
				font-family: 'GT Haptik';
				font-style: normal;
				font-weight: 400;
				src: url('/fonts/GT-Haptik-Regular.ttf') format('truetype');
			}
			@font-face {
				font-family: 'GT Haptik';
				font-style: normal;
				font-weight: 700;
				src: url('/fonts/GT-Haptik-Bold.ttf') format('truetype');
			}
		`}
	/>
);
