---
description: Create a UI component following the classifications in src\app\(DashboardLayout)\components\
argument-hint: Component type | Component name | Component summary
---

## Context

Parse $ARGUMENTS to ge the following values:

- [type]: Component type following te "Component Types Classification" below from $ARGUMENTS
- [name]: Component name from $ARGUMENTS, converted to pascal
- [summary]: component summary from $ARGUMENTS

## Task

Make a single UI component according to [type], [name] and [summary]

## Component Types Classification

# 1. Functional Components

Since these are the modern standard, the goal is clarity and conciseness.

Keep them small: If a component exceeds 100 lines, it’s usually time to split it up.

Use Destructuring: Instead of using props.name, destructure directly in the function signature: const User = ({ name, age }) => { ... }.

Avoid Inline Functions in JSX: For complex logic, define the function outside the return statement to keep the UI markup readable.

# 2. Presentational (Dumb) Components

These should be the most "boring" parts of your code—and that’s a good thing.

No Side Effects: They should never fetch data or modify global state. They just take props and emit events (via callback functions).

Prop Types/TypeScript: Since these rely entirely on props, strictly define what those props are. This acts as documentation for other developers.

Style Agnostic: Avoid hardcoding margins or positions that might make them hard to reuse in different layouts. Use a className prop to allow external styling.

# 3. Container (Smart) Components

These are the "managers" of your application.

Separation of Concerns: A container should fetch the data and then immediately pass it to a presentational component. Do not mix heavy logic and complex HTML in the same file.

Name them clearly: Often, developers use a naming convention like UserListContainer.js for the logic and UserList.js for the UI.

Use Custom Hooks: If the logic inside your container gets too bulky (e.g., complex API calls), move that logic into a Custom Hook.

# 4. Higher-Order Components (HOCs)

HOCs are powerful but can make your component tree difficult to follow if overused.

Don't Mutate the Original Component: Use composition. Return a new component that wraps the old one.

Pass Through Props: Ensure that the HOC passes all unrelated props through to the wrapped component so you don't "break" the underlying component's functionality.

Static Methods: If the original component has static methods, they must be manually copied over to the HOC, as they won't automatically transfer.
