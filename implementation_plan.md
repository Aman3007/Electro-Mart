# Implement Global Dark / Light Theme Toggle (UI Only)

We will introduce a light theme using CSS Custom Properties (Variables) to allow dynamic toggling without changing existing HTML/JSX classes throughout the application. 

## User Review Required
> [!IMPORTANT]
> The theme toggle feature requires dynamically changing the foundational colors defined in `tailwind.config.js`. We achieve this without breaking existing components by switching hex values to CSS variables targeting `rgba()`.

## Proposed Changes

### Configuration
#### [MODIFY] tailwind.config.js
- Replace fixed hex color codes in the `dark` color palette with `rgb(var(--color-...))` syntax to support CSS variables and Tailwind opacity modifiers.
- Override the default `white` color with a CSS variable. This allows `text-white` utility classes (used everywhere) to automatically become a dark text color (e.g. slate-900) when the light theme is active.

### Styling
#### [MODIFY] index.css
- Define the default CSS variables for dark mode using the exact RGB components of the current hex codes in the `:root` pseudo-class.
- Create a new `[data-theme='light']` CSS block with lighter palette colors (slate/white equivalents) that invert the dark background colors and text colors globally.
- Explicitly scope elements that must *stay* white in light mode (e.g. text on `.btn-danger` and `.btn-primary` if needed).
- Add CSS transitions on background colors for a smooth theme switch.

### Components logic
#### [MODIFY] App.jsx (Or main.jsx)
- Insert logic to check `localStorage.getItem('theme')` on initialization and set `document.documentElement.setAttribute('data-theme', theme)` to avoid a dark flash on light mode reload.

#### [MODIFY] Dashboard.jsx
- Add a new "Dark/Light Theme Toggle" button in the dashboard header, alongside the user profile and "Create New Listing" button.
- Implement the toggle state and `onClick` handler that updates the `data-theme` attribute on `document.documentElement` and persists the selection in `localStorage`.

## Open Questions

None. This approach robustly fulfills all constraints.

## Verification Plan

### Manual Verification
- After executing, I will run the dev server and use the browser tool to navigate the application.
- I will click the Theme Toggle switch on the Dashboard page and verify the entire screen immediately turns light without any page reload.
- I will verify text remains readable (the white text has effectively turned to dark slate).
- I will verify `localStorage` persistence across a simulated refresh.
- I will navigate to other sub-pages and ensure they adopt the light theme gracefully.
