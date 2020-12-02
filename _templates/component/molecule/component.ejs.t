---
to: src/components/ui/molecules/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
-%>
import React, { FC } from 'react';

interface I<%= ComponentName %>Props {
}

export const <%= ComponentName %>: FC<I<%= ComponentName %>Props> = ({ children }) => {
  return <div>{children}</div>;
};
