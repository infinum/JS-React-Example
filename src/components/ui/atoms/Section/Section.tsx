import { chakra, forwardRef, omitThemingProps, ThemingProps, useStyleConfig, HTMLChakraProps } from '@chakra-ui/core';
import { cx, __DEV__ } from '@chakra-ui/utils';
import React from 'react';

export interface ISectionProps extends HTMLChakraProps<'div'>, ThemingProps {}

export const Section = forwardRef<ISectionProps, 'div'>(function Section(props, ref) {
	const styles = useStyleConfig('Section', props);

	const { className, ...rest } = omitThemingProps(props);

	const _className = cx('Section', className);

	return <chakra.div ref={ref} className={_className} {...rest} __css={styles} />;
});

if (__DEV__) {
	Section.displayName = 'Section';
}
