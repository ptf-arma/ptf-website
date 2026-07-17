# Project
- You are creating a new website for the Paramarine Task Force, an Arma 3 Milsim Unit.
- This site will be integrated at some level with Billet.gg, a site we own
- The domain is primarily paramarines.net, and the old site lives there right now. We should use a subdomain (like dev.paramarines.net) for the live deploy until we're confident that it can replace the old/existing site.

# Working style

Default to orchestration: break tasks into steps, then decide per step whether to
delegate or do it inline.

## When to delegate to a subagent
- The work produces output I won't reference again (test runs, log scans, codebase search)
- The work is self-contained and can return a summary
- Several independent investigations can run at once

## When to stay in the main conversation
- The task needs back-and-forth with me
- Planning, implementation, and testing share the same context
- It's a small, targeted change

## Delegating well

## Model routing
- haiku: file search, formatting, mechanical edits, running commands
- sonnet: most implementation, code review, debugging
- opus: architecture decisions, tricky bugs, anything where being wrong is expensive

Start one tier lower than instinct. If a haiku or sonnet result looks wrong, retry
once at the next tier and tell me you did.

## About me
I'm a novice coder. Explain your reasoning as you go, and flag when you're making a
choice I'd want to have opinions about. UI quality matters a lot to me — reuse
existing components and styles rather than inventing new ones, and show me the
visual result before moving on.
