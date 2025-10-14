# Modern Login Page Styling

## Overview
This CSS styling creates a modern, clean login page that matches the aesthetic shown in the provided image. The design features a two-panel layout with a dark blue branding section and a white form section.

## Key Features

### Design Elements
- **Two-Panel Layout**: Dark blue branding panel on the left, white form panel on the right
- **Rounded Corners**: Consistent use of border-radius for modern appearance
- **Soft Shadows**: Subtle drop shadows for depth and elevation
- **Clean Typography**: Modern sans-serif fonts with proper hierarchy
- **Responsive Design**: Adapts to mobile and desktop screens

### Color Palette
- **Primary Blue**: `#2C3E8F` - Main brand color
- **Light Gray Background**: `#F5F5F5` - Page background
- **White**: `#FFFFFF` - Form panel background
- **Text Colors**: Various shades of gray for hierarchy

### Interactive Elements
- **Hover States**: Smooth transitions on buttons and inputs
- **Focus States**: Clear visual feedback for accessibility
- **Loading States**: Spinner animations for form submissions
- **Error/Success Messages**: Color-coded feedback

## CSS Classes

### Main Container
- `.login-container` - Full-screen container with light gray background
- `.login-card` - Main card with two-panel layout

### Branding Panel
- `.login-branding` - Dark blue left panel with pattern overlay
- `.branding-content` - Content wrapper with proper spacing
- `.brand-logo` - Logo and brand name
- `.brand-heading` - Main heading
- `.brand-description` - Descriptive text

### Form Panel
- `.login-form-panel` - White right panel
- `.form-header` - Welcome message and subtitle
- `.login-form` - Form container with proper spacing

### Form Elements
- `.form-group` - Input group wrapper
- `.form-label` - Input labels
- `.form-input` - Text inputs with icons
- `.input-with-icon` - Input with icon positioning
- `.checkbox-input` - Custom styled checkboxes

### Buttons
- `.btn-primary` - Primary action button (blue)
- `.btn-secondary` - Secondary button (outlined)
- `.toggle-button` - Method toggle buttons

### Messages
- `.error-message` - Error state styling
- `.success-message` - Success state styling
- `.loading-spinner` - Loading animation

## Responsive Breakpoints
- **Desktop**: Full two-panel layout
- **Tablet (768px)**: Stacked layout with reduced padding
- **Mobile (480px)**: Single column with optimized spacing

## Accessibility Features
- **Focus States**: Clear outline for keyboard navigation
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences
- **Semantic HTML**: Proper form structure and labels

## Usage
Import the CSS file in your Login component:

```jsx
import '../components/Login.css';
```

Then use the provided CSS classes in your JSX:

```jsx
<div className="login-container">
  <div className="login-card">
    <div className="login-branding">
      {/* Branding content */}
    </div>
    <div className="login-form-panel">
      {/* Form content */}
    </div>
  </div>
</div>
```

## Customization
The styling uses CSS custom properties (variables) for easy customization:

```css
:root {
  --primary-blue: #2C3E8F;
  --bg-light-gray: #F5F5F5;
  --radius-large: 20px;
  /* ... other variables */
}
```

Modify these variables to match your brand colors and preferences.
