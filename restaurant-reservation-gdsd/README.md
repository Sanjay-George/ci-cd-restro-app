# Restaurant Reservation System
This repository is for building a restaurant reservation system for the module Global Distributed Software Development at Hochschule Fulda

## Team members
* Utsav Shrestha | Team Lead, Frontend Lead | utsav.shrestha@informatik.hs-fulda.de | utsav170
* Muhammad Bilal | Frontend Developer | muhammad.bilal@informatik.hs-fulda.de | muhammadbilal14111
* Sanjay George | Backend Lead, DevOps | sanjay.varkey-george@informatik.hs-fulda.de | Sanjay-George
* Omer Zogubi | Backend Developer, GitHub Admin | omer.zogubi@informatik.hs-fulda.de | omerzogubi
* Parthiv Jani | Frontend Developer | parthiv-yogesh-kumar.jani@informatik.hs-fulda.de | j-parthiv
* Kristijan Lazeski | Backend Developer, Database admin | kristijan.lazeski@informatik.hs-fulda.de | kikolazeski


## Setup MySQL
1. Install MySQL
2. Ensure user='root' and the port is default 3306
3. Set mysql password in your environment variable `MYSQL_PASSWORD`


## Tech Stack
1. Node.js
2. MySQL
3. ReactJS (JavaScript), HTML, CSS

## Code management
### Branching strategy
We will use the **GitHub Flow** branching strategy.

* `master` will be our main branch. This branch should be **production-ready** at any point of time. 
* We will create `feature` branches from master, create `Pull Requests`, and merge back into master.

### Pull Requests
All PRs will need to pass the following checks before merging into master:
1. Approval by at least 1 code owner (TBD: set codeowners)
2. Passing static code analysis (TBD: setup Codacy)

**Note:** branch protection rules will be set on `master` to prevent direct pushes to master. Always create a new branch and a PR to merge into master.

### Branch naming 
We will follow a simple naming convention for branches:
* features: `f-feature-name` (prefix with `f-`)

eg: `f-build-about-page`

* bug fix: `b-bug-name` (prefix with `b-`)

eg: `b-fix-navbar-scroll`

### Commit messages
For commit messages, a good naming convention is to describe what you do in the form `This commit will <your commit message here>`.

Examples
* `Add Navbar component` (_This commit will_ Add Navbar component)
* `Fix failing tests for AmazingComponent` (_This commit will_ Fix failing tests for AmazingComponent)

## Project management
We will use GitHub `Projects`, `Issues` and `Milestones` to manage our development.

[Link to Project dashboard](https://github.com/users/Sanjay-George/projects/8/views/1?visibleFields=%5B%22Title%22%2C%22Assignees%22%2C%22Status%22%2C%22Milestone%22%2C21334131%2C%22Labels%22%5D)
