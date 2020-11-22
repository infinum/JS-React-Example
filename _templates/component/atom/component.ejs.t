---
to: src/components/ui/atoms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
-%>
import {
  chakra,
  forwardRef,
  ThemingProps,
  omitThemingProps,
  useStyleConfig,
  HTMLChakraProps,
} from '@chakra-ui/react';
import { __DEV__ } from '@chakra-ui/utils';
import React from 'react';

export interface I<%= ComponentName %>Props extends HTMLChakraProps<'div'>, ThemingProps {}

export const <%= ComponentName %> = forwardRef<I<%= ComponentName %>Props, 'div'>(function <%= ComponentName %>(
  props,
  ref,
) {
  const styles = useStyleConfig('<%= ComponentName %>', props);

  const {
    // extract components props here
    ...rest
  } = omitThemingProps(props);

  const componentStyles = {
    // place to add common styles
    ...styles,
  };

  return <chakra.div ref={ref} __css={componentStyles} {...rest} />;
});

if (__DEV__) {
  <%= ComponentName %>.displayName = '<%= ComponentName %>';
}