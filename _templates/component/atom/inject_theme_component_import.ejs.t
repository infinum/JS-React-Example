---
to: src/styles/themes/default/index.ts
inject: true
after: hygen_inject - component imports
skip_if: /components/<%= h.changeCase.param(name) %>
---
import <%= h.changeCase.pascal(name) %> from './components/<%= h.changeCase.param(name) %>';
