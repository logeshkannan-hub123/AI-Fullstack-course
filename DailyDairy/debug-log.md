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

## Day 7 (8/7/26) — `fetchgeolocation()` (`api.js` + `main.js`)

Reviewed a two-step `fetch()` chain (city name → coordinates via geocoding, then coordinates → weather) feeding a form-driven weather-app UI, then interrogated it for edge cases.

- Both requests correctly check `response.ok` before parsing, since neither the geocoding nor the weather API throws on its own for HTTP error statuses (404/500).
- The geocoding "no results" case (`data.results` empty or missing) is correctly turned into a thrown, catchable error instead of crashing later on `data.results[0]`.
- **Bug found: empty/whitespace-only city input wasn't checked before calling the API.** `fetchgeolocation("")` or `fetchgeolocation("   ")` would fire an unnecessary geocoding request instead of failing fast.
  - **Fixed:** `api.js` now trims the input and throws `"Please enter a city name."` up front if it's empty, before any `fetch()` runs.
- **Bug found: `main.js` had no client-side input validation**, so non-city input (numbers, symbols) would also trigger a wasted API round-trip before the "not found" error came back.
  - **Fixed:** `main.js` now validates with `cityRegex = /^[A-Za-z\s]+$/` before submitting, so only letter/space input reaches `fetchgeolocation()`.
- Design change from the original prompt: the original returned `null` on failure, which gave callers no error detail. **Fixed:** `api.js` now returns `{ error: error.message }` instead, so `main.js` can render the actual failure reason (e.g. `"City not found."`) rather than a generic message.
- Still open: **multiple cities sharing a name** (e.g. "Springfield") silently resolve to the first geocoding match (`count=1`) — no way for the user to pick the right one.
- Still open: **no timeout/abort handling** on either `fetch()` call — if either API hangs, the request waits indefinitely with no `AbortController`/timeout in place.
- Still open: **API response shape isn't defensively checked** — `const { latitude, longitude, name, country } = data.results[0]` assumes those fields exist; a schema change upstream would silently produce `undefined` values rather than a clear error.
- Still open: **rate limiting / temporary server errors** fall into the same generic `catch` path as every other failure, so the UI can't distinguish "try again in a moment" from "city doesn't exist."

## Day 8 — (9/7/26)

**Follow-up edge-case audit (same function, later in the session)** — re-reviewed `fetchgeolocation()` against a fuller edge-case table. Confirmed the previously-fixed cases (empty/whitespace input, city-not-found, HTTP errors on either API, missing `current_weather`, network failure, invalid JSON) all still hold correctly. Surfaced additional gaps — discuss-only, nothing below has been applied to `fetchgeolocation.js` yet:

- Still open: **numeric-only input** (e.g. `"12345"`) isn't rejected client-side — it's sent to the geocoding API and only fails there with the generic `"City not found."`. Recommended: `if (/^\d+$/.test(city)) throw new Error("City name cannot contain only numbers.")`.
- Still open: **special-character input** (e.g. `"@@@###"`) has the same gap — falls through to a generic "not found" instead of a clear validation message. Recommended: `if (!/^[A-Za-z\s-]+$/.test(city)) throw new Error("Please enter a valid city name.")`.
- Still open: **no max-length check** — an arbitrarily long string is still sent as a request instead of being rejected early. Recommended: reject input over ~50 characters before fetching.
- Still open: **internal duplicate whitespace isn't collapsed** — `city.trim()` only strips leading/trailing spaces, so `"New   Delhi"` is sent with the extra internal spaces intact. Recommended: `city = city.trim().replace(/\s+/g, " ")`.
- Still open: **no request timeout/abort** — same gap noted above; still no `AbortController`, so a hung server blocks the UI indefinitely with the spinner showing.
- Still open: **no re-entrancy guard on the Search button** — rapid repeated clicks can fire multiple concurrent requests, since nothing disables the button while `loading` is `true`. Recommended: `<button disabled={loading}>Search</button>`.

## Day 9 — (10/7/26) — React To-Do List app

Planned a React To-Do List (add task with trim, render as a list, complete/undo, delete) and asked for edge cases up front, before/while building `to-do-list/src/component/`. Checked each against the component code as it now stands.

- Bug found: **empty, whitespace-only, and multi-space input** (e.g. `"   "`, `"Buy      milk"`) wasn't blocked or normalized. **Fixed:** `addTask` now runs `taskText.trim().replace(/\s+/g, " ")` and returns early if the cleaned result is empty, so blank submissions are silently ignored and internal spacing is collapsed.
- Bug found: **no length limit on pasted text.** **Fixed:** `addTask` rejects (via `alert`) anything over 100 characters; the `<input>` also has `maxLength={100}`, and the Add button is `disabled` while the trimmed value is empty.
- Design choice: **duplicate tasks.** **Fixed (opinionated):** case-insensitive duplicate check via `tasks.some(...)` blocks a second identical task with an `alert` — took the "prevent duplicates" option over "allow duplicates" from the discussion.
- Edge case: **Enter key should behave like clicking Add, without reloading the page.** **Fixed:** `handleKeyDown` calls `handleAdd()` on `Enter`; not applicable since the input isn't inside a `<form>`, so there's no default submit behavior to prevent.
- Edge case: **deleting the last task should show a "no tasks" message instead of an empty list.** **Fixed:** renders `<p>No tasks available.</p>` when `tasks.length === 0`, otherwise the `<ul>`.
- Bug found: **refreshing the page cleared the task list** — `useState([])` only holds state in memory, so a reload reset `tasks` back to `[]`. **Fixed:** `App.jsx` now lazily initializes `tasks` from `localStorage.getItem("tasks")` (parsed with `JSON.parse`) inside the `useState` initializer, and a `useEffect` keyed on `[tasks]` calls `localStorage.setItem("tasks", JSON.stringify(tasks))` on every change, so the list persists across refreshes.
