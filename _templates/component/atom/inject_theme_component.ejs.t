---
to: src/styles/themes/default/index.ts
inject: true
after: hygen_inject - component registration
skip_if: <%= h.changeCase.pascal(name) %>,
---
    <%= h.changeCase.pascal(name) %>,
