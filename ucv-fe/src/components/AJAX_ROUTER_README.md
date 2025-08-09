# AJAX Router Implementation

This implementation provides smooth page transitions similar to Astro's view transitions, improving the perceived performance of the React application.

## Components

### 1. `useAjaxRouter` Hook
- **Location**: `src/hooks/useAjaxRouter.ts`
- **Purpose**: Manages navigation state and intercepts link clicks
- **Features**:
  - Automatic link click interception
  - Progress tracking
  - Smooth transitions
  - External link handling
  - Same-page navigation prevention

### 2. `LoadingBar` Component
- **Location**: `src/components/LoadingBar.tsx`
- **Purpose**: Shows navigation progress at the top of the page
- **Features**:
  - Animated progress bar
  - Shimmer effect
  - Gradient styling
  - Smooth fade in/out

### 3. `PageTransition` Component
- **Location**: `src/components/PageTransition.tsx`
- **Purpose**: Handles page content transitions
- **Features**:
  - Smooth opacity and scale transitions
  - Content preservation during navigation
  - Minimal blur effect for smoothness

### 4. `AjaxRouter` Component
- **Location**: `src/components/AjaxRouter.tsx`
- **Purpose**: Main wrapper that combines all functionality
- **Usage**: Wraps the entire Routes component in App.tsx

### 5. `AjaxLink` Component (Optional)
- **Location**: `src/components/AjaxLink.tsx`
- **Purpose**: Enhanced Link component with immediate feedback
- **Features**: Can be used as a replacement for regular anchor tags

## How It Works

1. **Automatic Interception**: The router automatically intercepts all link clicks in the application
2. **Smart Filtering**: Only internal navigation is handled via AJAX; external links work normally
3. **Visual Feedback**: Users see immediate loading feedback via the progress bar
4. **Smooth Transitions**: Pages transition with subtle animations (scale, opacity, blur)
5. **Performance**: Prevents full page reloads, keeping the JavaScript state intact

## Benefits

- **Faster Navigation**: No full page reloads
- **Better UX**: Smooth transitions and immediate feedback
- **State Preservation**: React state and context are maintained
- **SEO Friendly**: Still works with browser back/forward buttons
- **Progressive Enhancement**: Falls back to normal navigation if JavaScript fails

## Configuration

The router is automatically configured in `App.tsx`. All existing navigation continues to work without changes to individual components.

### Timings (Customizable)
- Progress animation: 50ms intervals
- Transition duration: 200ms
- Complete transition: 150ms

### Excluded Links
- External URLs (http/https)
- Email links (mailto:)
- Phone links (tel:)
- Hash links (#)
- Links with target="_blank"
- Links with modifier keys (Ctrl/Cmd/Shift)

## Usage

The router works automatically with existing navigation. No changes needed to existing code. The system will:

1. Intercept all `<a>` tag clicks
2. Show loading progress
3. Navigate using React Router
4. Apply smooth transitions
5. Complete the navigation

For special cases, you can use the `AjaxLink` component or the `useAjaxRouter` hook directly in your components.
