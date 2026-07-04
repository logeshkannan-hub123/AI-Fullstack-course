# Debug Log

## Day 4 — `countWordsInString` function

Iteratively debugged/extended a hand-rolled word-counter (tracks word/non-word transitions with an `isWord` flag instead of using `.split()` or regex).

**Version 1 — space-only separator**

- Worked correctly for plain space-separated text, including multiple consecutive spaces and leading/trailing spaces.
- Bug found: only treated `" "` as a separator — tabs (`\t`) and newlines (`\n`) were not recognized as word breaks.

**Version 2 — added punctuation (`. , ! ? \t \n` `` ` ``)**

- Fixed the tab/newline gap from v1.
- Bug found: separator list was still incomplete — characters like `; : - " ' (` were not excluded, so e.g. `"hello;world"` was miscounted as 1 word instead of 2.

**Version 3 — added `" ( ) : ; - \_`**

- Extended the separator list further to cover the gaps from v2.
- **New bug introduced: syntax error.** The condition list ends with a trailing `&&` followed directly by the closing `)` (an empty line, then `) {`), which is invalid JavaScript (`Unexpected token )`) — the function would not run as pasted.
- Minor issue: `"\_"` is an unnecessary escape (`\_` isn't a special escape sequence, so it evaluates to a literal `_`, but the backslash is redundant).

**Version 4 — same code as v3**

- Re-pasted identical code to ask for another explanation; same trailing-`&&` syntax error still present, unresolved.

**Still open:** the dangling `&&` before the closing `)` needs to be removed (or the last condition needs a value after it) before this version will actually execute. Also worth switching to `\s` regex or a `Set` of separator chars instead of a long manual `!==` chain, to make adding more separators less error-prone.
