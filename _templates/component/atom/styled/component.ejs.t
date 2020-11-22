---
to: src/components/ui/atoms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
-%>
import { chakra } from '@chakra-ui/system';
import { __DEV__ } from '@chakra-ui/utils';

export interface I<%= ComponentName %>Props {}

export const <%= ComponentName %> = chakra<'div', I<%= ComponentName %>Props>('div', {
  baseStyle: {
    // common styles
  },
});

if (__DEV__) {
  <%= ComponentName %>.displayName = '<%= ComponentName %>';
}