---
to: src/components/ui/atoms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.tsx
---
<%
  pascalName = h.changeCase.pascal(name)
-%>
import React, { FC } from 'react';

interface I<%= pascalName %>Props {
}

export const <%= pascalName %>: FC<I<%= pascalName %>Props> = ({ children }) => {
  return <div>{children}</div>;
};
