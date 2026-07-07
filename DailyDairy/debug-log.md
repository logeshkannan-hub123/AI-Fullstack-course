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

---

## Day 4 Homework — `celsiusToFahrenheit`, `calculate`, `filterEvenNumbersInArray`

Three separate hand-rolled utility functions, each walked through once for correctness and then interrogated for edge cases. No fixes were applied to the actual files — these were explain/discuss exchanges, so all bugs below are still open.

**`celsiusToFahrenheit(celsius)` — temperature converter**

- Core formula (`celsius * 9/5 + 32`) is correct; `celsiusToFahrenheit(37)` → `98.6` as expected.
- Bug found: **zero input validation.** Non-numeric input (`"abc"`, `undefined`, missing argument) silently returns `NaN` instead of an error.
- Bug found: no bound-checking — values below absolute zero (`-273.15°C`) compute without complaint.
- Minor: no rounding, so many inputs produce long floating-point decimals (e.g. `36.6` → `97.88000000000001`).
- Still open: add a `typeof`/`isNaN` guard and round the result, e.g. `Math.round(((celsius * 9) / 5 + 32) * 100) / 100`.

**`calculate(a, b, operator)` — calculator with guard-clause validation**

- Guard clauses correctly reject non-number operands, non-string operators, invalid operator symbols, and division by zero (`b === 0`, regardless of `a`).
- **Bug found: `NaN` and `Infinity` slip through validation.** `typeof NaN === "number"` and `typeof Infinity === "number"` are both `true`, so `calculate(NaN, 5, "+")` and `calculate(Infinity, 1, "+")` return `NaN`/`Infinity` instead of an error — the type check confirms _type_, not a _usable_ value.
- Minor: floating-point precision issues (`0.1 + 0.2` → `0.30000000000000004`) and silent overflow to `Infinity` on very large multiplications.
- Still open: tighten the operand check with `Number.isFinite(a) && Number.isFinite(b)` to close the `NaN`/`Infinity` gap.

**`filterEvenNumbersInArray(arr)` — even-number filter**

- Core loop/modulo logic is correct for well-formed numeric arrays, including negatives and empty arrays (`[]` → `0`, no crash).
- **Bug found: non-numeric elements coerce silently.** `"4"` (string) passes `% 2 === 0` and gets pushed as a string, not a number; `null` coerces to `0` and is wrongly treated as even; `[2]` coerces and gets pushed as an array. `undefined`/`{}`/`NaN` happen to get excluded, but only by coincidence of coercion, not real validation.
- Bug found: non-array input (`null`, `undefined`, a number) either throws (`Cannot read properties of ... 'length'`) or silently returns `0`, misleadingly implying "no evens" instead of "invalid input."
- Design gap: the function only **returns the count**, while the actual filtered array is only ever `console.log`'d — a caller has no way to retrieve the array itself.
- Still open: add an `Array.isArray(arr)` guard, replace the manual loop with `arr.filter(num => typeof num === "number" && Number.isFinite(num) && num % 2 === 0)`, and consider returning the array (or both array and count) instead of discarding it.

## Day 6 — `fetchPosts()` (`api.js` + `main.js`)

Reviewed a `fetch()`-based data-loading function (`api.js`) that feeds a DOM-rendering loop (`main.js`), then interrogated it for edge cases.

- `response.ok` check is correct: `fetch()` does **not** throw on HTTP error statuses (404, 500, etc.), so the explicit `if (!response.ok) throw new Error(...)` is required and present — non-2xx responses are correctly funneled into `catch`.
- **Bug found: `catch` block didn't return anything.** On any error (network down, HTTP error, invalid JSON), the function resolved to `undefined` instead of an array. Since `main.js` calls `posts.forEach(...)` directly on the result with no guard, this would throw `TypeError: Cannot read properties of undefined (reading 'forEach')` downstream.
  - **Fixed:** `catch` now returns `[]`, so `posts` is always an array and `main.js`'s `forEach` never crashes on the error path.
- Bug found (fixed): a stray `fetchPosts();` call at the bottom of `api.js` would double-fire the request if another module also imported and called it. Removed so the caller (`main.js`) is the only place that triggers the fetch.
- Still open: no timeout/abort handling — if the server hangs, `fetch()` waits indefinitely. Not addressed in `api.js`; would need an `AbortController` with a `setTimeout` to cancel after N seconds.
- Still open: an empty-array response (`[]`) is valid and doesn't throw, but `main.js` has no "no posts found" fallback — an empty grid renders silently with no user-facing message.
- Still open: invalid/non-JSON response body would throw inside `response.json()` and get caught, but only logged via `console.error` — no user-visible error state in the UI (`main.js` never checks for an empty/failed result before iterating).
