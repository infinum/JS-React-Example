---
inject: true
to: stories/index.tsx
skip_if: src/components/ui/atoms/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.tsx
prepend: true
---
<%
  pascalName = h.changeCase.pascal(name)
-%>
import '@atoms/<%= pascalName %>/<%= pascalName %>.story'
