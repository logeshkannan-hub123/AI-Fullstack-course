# Daily Diary

## Day 1 (1/7/2026)

Printed a sample "Hello World!" using HTML, and wrote a function that counts how many words are in a string and displays the result in a `<p>` tag.

## Day 2 (2/7/2026)

Learned the difference between tags, elements, and attributes. Then learned about semantic tags and created the basic HTML skeleton for the portfolio. Also created `readme.md` (daily learning notes) and `ai-log.md` (log of every prompt and response).

## Day 3 (3/7/2026)

Learned about the CSS box model, Flexbox, Grid, and responsive design. Also learned the difference between Claude.ai and Claude Code in VS Code.

Built the CSS for the sample portfolio HTML, practicing how to prompt Claude Code in VS Code to identify and fix issues properly. Now feeling a bit more confident using Claude Code to prompt, identify issues, and fix them.

## Day 4 (4/7/2026)

Today learned some basic JavaScript topics: variables, data types, arrays, objects, functions, loops (`for`, `while`, `for...of`), and conditionals (`if`, `if...else`).

Practiced these topics in small programs, then used Claude to explain the code and surface edge cases, which I then fixed.

## Day 5 (6/7/2026)

Today learned a bit more advanced JavaScript: Dynamic DOM, Form Events, and Event Delegation. Also learned higher-level Git and GitHub concepts: Git branches and GitHub Pages — how to create a new branch, switch branches, merge into the current branch (while on `main`), delete a merged branch, check which branch you're on, and view a visual branch history in the terminal.

```bash
git branch                        # list all local branches
git branch feature/dark-mode      # create a branch
git checkout feature/dark-mode    # switch to branch
git checkout -b feature/dark-mode # create AND switch (most common)
git switch -c feature/dark-mode   # newer syntax for same thing
git merge feature/dark-mode       # merge into current branch (be on main first)
git branch -d feature/dark-mode   # delete merged branch
git status                        # shows which branch you are on
git log --oneline --graph         # visual branch history in terminal
```

## Day 6 (7/72026)

Today learn about Destructuring, Spread & Rest, ES Modules, Promises, async/await fetch API. OPTIONAL CHAINING ?. & NULLISH COALESCING ?? , ?. matrum ?? — null/undefined bugs avoid panna. || — replaces any falsy value (0, "", false).

## Day 7 (8/7/26)

Today I will learnn REST,Status Code, API docs, Nested JSON, Error handling. newly i will learn the API docs for how check the goelocation and using latitude and longitude get the weather. use this api will build the weather check app.

## Day 8 (9/7/26)

Today i will learn about react components, Props, vite. how to install react app using vite and create component then how use props.

## Day 9 (10/7/26)

Today i will learn useState, Controlled inputs, useEffect, Lifting state up. i will use those react state and hooks to built the todo list app.

## Day 10 (11/7/26)

Today i will learn Lists & keys, Conditional rendering, Forms . the last three day lean about react its usefull to me. then i will create the simple mini project **Movie Search: Search a title, see a results list, click one for a detail view.**.

## Day 11 (13/7/26)

Today i will learn about Node.js fundamentals. Node runtime, npm & package.json, Modules, File System. learn how to read the file and read the file using the. File system operations are handled by Node.js using its built-in node:fs module.

## Day 12 (14/07/26)

Today learned Express.js fundamentals: project setup, routing, and middleware, and used them to build a CRUD API. Created sample movie data as a JavaScript array in `movie_details.js`, exported it, and imported it into `server.js`, then built the full set of API endpoints (`GET`, `POST`, `PUT`, `DELETE`) to fetch, add, update, and delete movies.

## Day 13 (15/07/26)

Today learned MongoDB Atlas, Mongoose schemas, validation, and real persistence. Used MongoDB to store the movie data, then created, updated, and deleted records through the `GET`, `POST`, `PUT`, and `DELETE` API methods, and checked schema validation on the data.

## Day 14 (17/07/26)

Today learned bcrypt hashing, JWTs, auth middleware, and secrets, then used them to build signup and login routes with hashed passwords and token-based authentication in the Express CRUD API.

## Day 15 (17/07/26)

Today did a security review of the signup and login code, checking for plaintext password storage, missing input validation, and routes accessible without auth that shouldn't be. Found and fixed a few real issues: `PUT /movies/:id` and `PUT /recipes/:id` were missing ownership checks (any logged-in user could edit someone else's data), `/login` and `/users` accepted non-string input that could enable NoSQL injection, signup allowed very weak passwords, and `/login` leaked account existence through different HTTP status codes. Applied fixes for all of these directly in `server.js`.
