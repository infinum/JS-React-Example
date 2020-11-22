import { chakra, forwardRef, omitThemingProps, ThemingProps, useStyleConfig, HTMLChakraProps } from '@chakra-ui/react';
import { cx, __DEV__ } from '@chakra-ui/utils';
import React from 'react';

export interface ISectionProps extends HTMLChakraProps<'section'>, ThemingProps {}

export const Section = forwardRef<ISectionProps, 'section'>(function Section(props, ref) {
	const styles = useStyleConfig('Section', props);

	const { className, ...rest } = omitThemingProps(props);

	const _className = cx('Section', className);

	return <chakra.section ref={ref} className={_className} {...rest} __css={styles} />;
});

if (__DEV__) {
	Section.displayName = 'Section';
}
