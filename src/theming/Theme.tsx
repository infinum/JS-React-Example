import React from 'react';
import { css, Global } from '@emotion/core';
import styled, { CreateStyled } from '@emotion/styled';
import emotionNormalize from 'emotion-normalize';

export interface ITheme {
	colors: {
		primary: string;
	};
	spacings: {
		l: string;
	};
}

export const theme: ITheme = {
	colors: {
		primary: 'lightblue',
	},
	spacings: {
		l: '1rem',
	},
};

export const GlobalStyles = () => (
	<Global
		styles={css`
			// e.g. font families registered here

			${emotionNormalize}

			* {
				box-sizing: border-box;
			}

			html,
			body {
				padding: 0;
				margin: 0;
				font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
					Droid Sans, Helvetica Neue, sans-serif;
			}

			a {
				color: inherit;
				text-decoration: none;
			}

			header a {
				margin-right: 10px;
			}
		`}
	/>
);

export default styled as CreateStyled<ITheme>;
