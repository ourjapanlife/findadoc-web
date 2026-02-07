# Storybook Documentation

## 1. What is Storybook?

Storybook is a tool for building UI components in isolation from the main app. Think of it as a workshop where you can develop, test, and document individual components without needing to run the entire Find A Doc app. It lets you see all the different states a component can be in (empty, filled, error states, etc.) and interact with them in real-time.

Storybook solves a few key problems:
- **Faster development:** Build components without navigating through the whole app to see changes.
- **Component documentation:** Automatically generates docs showing how each component works.
- **Testing capabilities:** Can test components in isolation and verify they work in different scenarios.
- **Design consistency:** Easy to see all the components in one place and ensure they follow the same patterns.

**What are stories?**
Stories are specific examples of how a component looks and behaves with different prop values. For example, a button component might have stories for "Default Button", "Disabled Button", "Primary Button", "Loading Button", etc. Each story shows the component in a particular state so you can see all the ways it can be used throughout the app.

### Resources:
- **Official Storybook documentation and Getting started with Storybook with Vue.js:** https://storybook.js.org/docs/get-started/frameworks/vue3-vite/?renderer=vue
- **Quick YouTube course to get you going:** https://www.youtube.com/watch?v=x-x47qHq3nY
- **Why Storybook?:** https://storybook.js.org/docs/get-started/why-storybook
- **Visual explanation of Storybook:** https://www.youtube.com/watch?v=p-LFh5Y89eM

---

## 2. How to start the server in the CLI? Navigating Storybook quickly.

Storybook runs alongside Find A Doc (or any other project) in its own live development server.

**To start Storybook run:**
```bash
yarn storybook
```

This opens Storybook in development mode on `http://localhost:6006` in your browser.

**Hot reloading:**
Storybook has hot module replacement (HMR) enabled, which means any code changes you make to components or story files are automatically reloaded in the browser without needing to manually refresh or restart the server. You'll see your changes reflected instantly as you save your files. However, sometimes you may still need to manually refresh Storybook in the browser if certain parts don't display correctly.

**Navigating Storybook:**
- Once open, you'll see all the components listed in the left sidebar.
- Click any component to view its documentation and different stories (the different states/variations it can be in).
- Use the Controls tab at the bottom to adjust prop/arg values in real-time and see how the component responds.
- The other tabs (Actions, Interactions, Accessibility) are built-in add-ons that help with testing and debugging (explained below).

## 3. Built-in add-ons explained

Storybook comes with several add-ons that make development easier:

**Controls**
- Dynamically adjust component props/args without editing code.
- Great for exploring different component states quickly.
- Example: Toggle a boolean prop or change text content to see immediate results.

**Actions**
- Logs events like clicks, form submissions, and other user interactions to the Actions panel.
- Helps verify that callbacks and event handlers are firing correctly.
- Example: Click a button and see the click event logged with all its details.

**Interactions**
- Allows you to write automated interaction tests that simulate user behavior.
- Tests run automatically when you view a story.
- Example: Automatically fill out a form and click submit to test the component's behavior.

**Accessibility**
- Tests the components against [WCAG accessibility standards](https://www.w3.org/TR/WCAG21/).
- Highlights potential a11y issues like missing labels, low contrast, or improper ARIA attributes.
- Shows issues directly in the Accessibility panel with suggestions on how to fix them.

## 4. Folder and file structure - where everything is and what each file does.

Most Storybook-related files live inside `/.storybook/`.

**Key configuration files:**
`main.ts`
- Main configuration file for Storybook.
- Defines which files are story files (using the stories glob pattern).
- Configures add-ons and framework settings.
- Important: If you change anything in main.ts, you need to restart the Storybook server for changes to take effect.

`preview.ts`
- Configures how stories are previewed/rendered.
- Sets up global decorators (wrappers for all stories).
- Defines global parameters like themes or backgrounds.
- Changes here support hot module replacement, so you can see updates without restarting the server.

**Story files:**
Story files use Component Story Format (CSF), which is Storybook's standard format for writing stories. CSF files are written in TypeScript and have a `.stories.ts` extension (e.g. `WelcomeScreen.stories.ts`).
- Story component files (ending with `.stories.ts`) are placed inside `/.storybook/components/`.
- Each story file corresponds to one Vue component from the main app.
- Stories define different states/variations of that component.

## 5. Adding New Components to Storybook

**Here's the workflow for adding a new component to Storybook:**
1. Identify the component you want to document (should already exist in `/components`).
2. Create a story file in `/.storybook/components/` following the naming pattern: `ComponentName.stories.ts`.
3. Define the `meta` object with component info, title, and tags. Inside the `title` property, use the folder structure you want Storybook to display it as in the sidebar (e.g. `'components/MemberComponent'`). Mirror the folder structure inside the main app's `/components` directory to keep things organized and easy to find.
4. Set up `argTypes` to document props and configure Controls.
5. Create stories for different component states (default, variants, edge cases).
6. Run Storybook `yarn storybook` to verify everything works.

## 6. Example: Static component with a default story

Here's a simple example for the `WelcomeScreen` component, which is a static onboarding component with no interactive props:

```typescript
import type { Meta, StoryObj } from '@storybook/vue3'
import WelcomeScreen from '../../components/onboarding/WelcomeScreen.vue'

const meta = {
    title: 'components/onboarding/WelcomeScreen',
    component: WelcomeScreen,
    tags: ['autodocs']
} satisfies Meta<typeof WelcomeScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {}
}
```

**What's happening here:**
- `Meta` and `StoryObj` types: TypeScript types from Storybook that provide autocomplete and type safety.
- `meta` object: Contains metadata about the component:
    - `title:` is where this component appears in the Storybook sidebar (follows the project's folder structure).
    - `component:` is the actual Vue component being documented.
    - `tags: ['autodocs']` tells Storybook to auto-generate documentation for this component.
- `satisfies Meta<typeof WelcomeScreen>` is a TypeScript operator that ensures the meta object matches the expected structure while preserving type inference. This gives you better type checking and autocomplete while writing stories.
- `export default meta` is required - this is how Storybook finds the component configuration.
- `type Story` is a helper type that links stories to the meta object for better type safety.
- `Default` story is a named export representing the default state of the component with empty args since this component has no props.

## 7 Example: Dynamic component with multiple stories and argTypes

Here's a more complex example for the `ModInputField` component, which is an input field component that accepts multiple props and has different use cases.

```typescript
import type { Meta, StoryObj } from '@storybook/vue3'
import ModInputField from '../../components/moderation-panel/ModInputField.vue'

const meta = {
    title: 'components/moderation-panel/ModInputField',
    component: ModInputField,
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
            description: 'Label text for the input field'
        },
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'tel', 'url'],
            description: 'HTML input type'
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text for the input'
        },
        required: {
            control: 'boolean',
            description: 'Whether the field is required'
        },
        invalidInputErrorMessage: {
            control: 'text',
            description: 'Error message shown when validation fails'
        },
        inputValidationCheck: {
            control: false,
            description: 'Validation function: `(value: string | undefined) => boolean`. Returns true if valid, false otherwise.'
        }
    }
} satisfies Meta<typeof ModInputField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your name',
        required: true
    }
}

export const Optional: Story = {
    args: {
        label: 'Middle Name',
        type: 'text',
        placeholder: 'Enter middle name',
        required: false
    }
}

export const EmailWithValidation: Story = {
    args: {
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter your email',
        required: true,
        invalidInputErrorMessage: 'Please enter a valid email address',
        inputValidationCheck: (value: string | undefined) => {
            if (!value) return false
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        }
    }
}

export const PasswordWithValidation: Story = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter password',
        required: true,
        invalidInputErrorMessage: 'Password must be at least 8 characters',
        inputValidationCheck: (value: string | undefined) => value ? value.length >= 8 : false
    }
}

export const PhoneWithValidation: Story = {
    args: {
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+81 123-4567-8900',
        required: true,
        invalidInputErrorMessage: 'Please enter a valid phone number',
        inputValidationCheck: (value: string | undefined) => {
            if (!value) return false
            return /^\+?\d{10,}$/.test(value.replace(/[\s\-()]/g, ''))
        }
    }
}
```

**What's happening here:**
`argTypes:` defines how props appear in the Controls panel and provides documentation:
- `control:` specifies the UI control type ('text', 'select', 'boolean', etc.).
- `options:` are for select controls, lists the available choices.
- `description:` shows up in the auto-generated docs to explain what the prop does.
- `control: false:` hides complex props (like functions) from Controls since they can't be edited in the UI.

Multiple stories: Each named export (`Default`, `Optional`, `EmailWithValidation`, etc.) represents a different use case or state:
- `Default` shows the typical use case.
- `Optional` demonstrates the component with `required: false`.
- `EmailWithValidation` shows email input with validation logic.
- `PasswordWithValidation` shows password input with character length validation.
- `PhoneWithValidation` shows phone input with custom regex validation.

The `args` object contains the actual prop values passed to the component for that specific story. Args can be adjusted in the Controls panel when viewing the story. Refer to each component's available props to add the appropriate ones to the args object, as props vary by component.

This structure makes it easy to see all the ways the `ModInputField` component can be used throughout the app.

## 8. Project-Specific Conventions

**File naming:**
- Story files must end with `.stories.ts` (e.g. `ModInputField.stories.ts`).
- Use the same name as the component file for consistency.

**Folder organization:**
- All story files go in `/.storybook/components/`.

**Import paths:**
- Use relative paths when importing components into story files (e.g. `../../components/moderation-panel/ModInputField.vue`).

**Story naming:**
- Use descriptive names for stories that explain what state they show (e.g. `EmailWithValidation` instead of `Story2`).
- First story is usually called `Default` to represent the most common use case.
