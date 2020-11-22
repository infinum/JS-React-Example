---
to: src/components/ui/templates/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.tsx
---
<%
  ComponentName = h.changeCase.pascal(name)
  ComponentNameHeader = h.changeCase.pascal(name) + 'Header'
  ComponentNameContent = h.changeCase.pascal(name) + 'Content'
  ComponentNameFooter = h.changeCase.pascal(name) + 'Footer'
-%>
import React, { FC } from 'react';

interface I<%= ComponentName %>Props {}

export const <%= ComponentName %>: FC<I<%= ComponentName %>Props> = ({ children }) => {
  return <div>{children}</div>;
};

interface I<%= ComponentNameHeader %>Props {}

export const <%= ComponentNameHeader %>: FC<I<%= ComponentNameHeader %>Props> = ({ children }) => {
  return <div>{children}</div>;
};

interface I<%= ComponentNameContent %>Props {}

export const <%= ComponentNameContent %>: FC<I<%= ComponentNameContent %>Props> = ({ children }) => {
  return <div>{children}</div>;
};

interface I<%= ComponentNameFooter %>Props {}

export const <%= ComponentNameFooter %>: FC<I<%= ComponentNameFooter %>Props> = ({ children }) => {
  return <div>{children}</div>;
};