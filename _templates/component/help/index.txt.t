---
message: |
    hygen component [ACTION] [NAME]

    Generates a React component, a storybook, and a test.

      [ACTION]         One of generator actions (required).
      [NAME]           The component name (required).

    Actions:

      atom             Atom is smallest possible components, such as button,
                       label, avatar.

      atom:styled      Atom is smallest possible componentsusing chakra styled
                       component helper.

      molecule         Molecules are the composition of one or more components
                       of atoms.

      organism         Organisms are the combination of molecules that work
                       together or even with atoms that compose more elaborate
                       interfaces.

      template         Templates create relationships between the organisms and
                       others components through positions and placements.
---