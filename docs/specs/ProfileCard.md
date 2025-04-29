# Profile Card Component Requirements

## Purpose
Create a **professional, dramatic, and modern** profile card for a personal portfolio site that immediately captures attention and conveys key information clearly.

## Technical Stack
- **Framework**: React (with TypeScript)
- **Styling**: TailwindCSS
- **Animation**: Subtle hover interactions and effects

## Functional Requirements
- **Profile Picture**: Displays a gravatar or placeholder image (user configurable).
- **Text Content**:
  - Full Name
  - Professional Title (Label)
  - Short Summary
  - Location (optional)
- **Contact Information**:
  - Primary email link with subtle styling.
- **Action Buttons**:
  - Configurable list of buttons (e.g., "View Resume", "Contact Me"), each tied to a click handler.
- **Animations**:
  - Subtle hover scale and glowing border effect.
  - Smooth transitions on hover interactions.
- **Responsiveness**:
  - Mobile-friendly
  - Centered layout with max-width for readability

## Configurability
- All content (name, label, email, summary, buttons) must be passed via **props**.
- Design to support **dynamic data** loading (e.g., JSON Resume standard or similar).

## Design Aesthetic
- Clean, elegant, and striking
- Gradient backgrounds (dark neutrals with slight color highlights)
- High-end, professional firm aesthetic (not overly playful)

## Extensibility
- Should allow easy future expansion (e.g., show deeper resume information upon interaction)
- Buttons can be tied to navigation or modal opening actions
