import { css, StyleObjectOrFn } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { FC } from 'react';

export interface IGlobalStylesProps {
	styles: StyleObjectOrFn;
}

export const GlobalStyles: FC<IGlobalStylesProps> = ({ styles }) => {
	return <Global styles={(theme) => css(styles)(theme)} />;
};
