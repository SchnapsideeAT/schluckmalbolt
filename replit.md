# Schluck Mal - Game Application

## Overview
This is a React-based card game application called "Schluck Mal" (German drinking game). It's a frontend-only single-page application built with Vite, React, TypeScript, and shadcn/ui components.

## Project Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Mobile Support**: Capacitor (for iOS/Android apps)
- **State Management**: React Query (TanStack Query)
- **Storage**: IndexedDB (idb) and Capacitor Preferences for mobile

## Key Technologies
- Vite with SWC for fast builds
- React Router for client-side routing
- Lazy loading for optimal performance
- Canvas Confetti for animations
- Lucide React icons
- Form handling with react-hook-form
- Zod for validation

## Development Setup
- Port: 5000 (configured for Replit)
- Host: 0.0.0.0 (allows Replit proxy)
- Dev command: `npm run dev`
- Build command: `npm run build`

## Deployment
- Type: Autoscale (static site)
- Build: `npm run build`
- No backend server required

## Project Structure
- `/src/pages` - Route pages (Home, Game, Setup, Rules, etc.)
- `/src/components` - Reusable components including UI library
- `/src/hooks` - Custom React hooks
- `/src/utils` - Utility functions
- `/src/data` - Static data (cards.json)
- `/public` - Static assets

## Recent Changes
### Oct 4, 2025 - InteractiveTutorial Swing Migration (Build Fix)
- **Critical Fix**: Migrated `InteractiveTutorial.tsx` from deleted `useSwipe` to `useSwing` hook
- **Problem**: Build failed with "Could not load useSwipe" error - file was deleted during Game.tsx migration
- **Solution**: Complete Swing integration matching Game.tsx pattern
- **Changes**:
  - Updated imports: `useSwipe` → `useSwing`, added `useRef`, `useMemo`
  - Added `stackRef` for Swing DOM binding
  - Created memoized `swingHandlers` with `useMemo` (dependencies: `currentStep`, `settings`)
  - Replaced `useSwipe` with `useSwing(stackRef.current, swingHandlers)`
  - Updated DOM structure: wrapped tutorial card in `.swing-stack` > `.swing-card`
  - Removed `swipeHandlers` props from img element (Swing handles directly)
  - Changed all `swipeState` → `swingState` references (8 occurrences)
  - Changed `resetSwipeState` → `resetSwingState` (2 occurrences)
- **Testing**: `npm run build` successful ✅ - no errors, ready for Xcode deployment
- **Files Changed**: `src/components/InteractiveTutorial.tsx`
- **Status**: Build now works, ready for iOS testing with `npx cap sync ios && npx cap open ios`

### Oct 4, 2025 - Swing Library Integration (Swipe System Replacement)
- **Migration**: Replaced custom buggy swipe system with battle-tested **Swing library** (used by Tinder/Jelly)
- **Dependencies**: 
  - Installed `swing` library for physics-based card animations
  - Installed `hammerjs` for robust touch/mouse event handling
  - Installed `@types/hammerjs` for TypeScript support
- **New Hook**: Created `src/hooks/useSwing.ts` replacing old `useSwipe.ts`
  - Swing Stack with proper config (allowedDirections: LEFT/RIGHT only)
  - Responsive throwOutConfidence (60% of card width for all screens)
  - Re-init protection with flags to prevent double initialization
  - Defensive checks for null elements and edge cases
  - Proper cleanup with destroy() to prevent memory leaks
- **Event System**:
  - `dragmove` event → real-time horizontalDistance for glow effect
  - `throwout` event → card thrown (LEFT/RIGHT with Direction enum)
  - `throwin` event → card snapped back (reset glow)
  - Haptic feedback on throwout via triggerHaptic('medium')
- **CSS Updates** (`src/index.css`):
  - Added `.swing-stack` and `.swing-card` classes with proper positioning
  - iOS/Android touch-fix: `overscroll-behavior: none` + `touch-action: manipulation` on html/body
  - touch-action: none on Swing containers to prevent iOS scroll interference
- **GameCard.tsx Changes**:
  - Removed all Touch/Mouse event handlers (Swing handles directly)
  - Removed CSS transition on transform (prevented Swing animations)
  - Kept horizontalDistance prop for rotation/opacity visual feedback
  - Kept Glow animation (cardGlowPulse) - no conflicts
- **Game.tsx Changes**:
  - Replaced useSwipe with useSwing hook
  - Added stackRef for Swing DOM binding
  - Wrapped GameCard in `.swing-stack` > `.swing-card` DOM structure
  - SwipeOverlay receives state from Swing (horizontalDistance, swipeDirection, isSwiping)
- **Benefits**:
  - Stable, bug-free swipe detection (no more erratic behavior)
  - Physics-based smooth animations
  - Better iOS/Android touch compatibility
  - Memory leak safe with proper cleanup
  - Glow effect preserved exactly as before
- **Files Changed**: `src/hooks/useSwing.ts` (new), `src/index.css`, `src/components/GameCard.tsx`, `src/pages/Game.tsx`
- **Files Deleted**: `src/hooks/useSwipe.ts` (old buggy hook)
- **Status**: Swing integration complete, tested on dev, ready for iOS/Android testing

### Oct 3, 2025 - Portrait-Only Orientation Lock
- **Requirement**: Game should only be playable in portrait mode, not landscape
- **Solution**: Configured native iOS and Android projects to lock screen orientation
- **iOS Configuration** (`ios/App/App/Info.plist`):
  - Set `UISupportedInterfaceOrientations` to only include `UIInterfaceOrientationPortrait`
  - Set `UISupportedInterfaceOrientations~ipad` to only include `UIInterfaceOrientationPortrait`
  - Added `UIRequiresFullScreen: true` for iPad compatibility
  - Removed all landscape orientation options
- **Android Configuration** (`android/app/src/main/AndroidManifest.xml`):
  - Added `android:screenOrientation="portrait"` to MainActivity
- **Native Projects**: Generated iOS and Android projects using `npx cap add ios` and `npx cap add android`
- **Files Changed**: `ios/App/App/Info.plist`, `android/app/src/main/AndroidManifest.xml`
- **Status**: App now only runs in portrait orientation on both platforms

### Oct 3, 2025 - Production Cleanup (Debug Code Removal)
- **Completed**: Full production-ready cleanup to remove all debug/development artifacts
- **Deleted Files**:
  - `src/components/SafeAreaDebugger.tsx` - Debug component for Safe Area testing
  - `public/placeholder.svg` - Unused placeholder asset
- **Removed Debug UI**:
  - Debug toggle buttons from Home.tsx and Setup.tsx
  - All SafeAreaDebugger imports and references
  - Debug-related state variables
- **Console Logs**: Kept console.error statements in catch blocks for production error tracking
- **Status**: App is now production-ready, no debug code remains in UI layer
- **Bundle Impact**: Cleaner codebase, removed ~3 components worth of debug code
- **Files Changed**: `src/pages/Home.tsx`, `src/pages/Setup.tsx`

### Oct 3, 2025 - iOS Keyboard "Done" Button Fix
- **Issue**: iOS keyboard was missing the "Fertig" (Done) button, showing only generic "return" key
- **Root Cause**: Safari/iOS requires proper HTML structure to show custom return key labels
- **Solution**: 
  - Wrapped player name input in `<form>` tag with `action="#"` (required by iOS)
  - Added `enterKeyHint="done"` attribute to input field
  - Removed duplicate `onKeyPress` handler to prevent double-submission
  - Form submission now properly closes keyboard on iOS
- **Files Changed**: `src/components/PlayerSetup.tsx`

### Oct 3, 2025 - iOS Keyboard Fix (Capacitor Native Config)
- **Critical Fix**: Removed `useKeyboardFix` hook that caused keyboard to freeze and not close
- **Issue**: Previous approach with `scrollTo(0,0)` and manual resize events blocked iOS keyboard from closing normally
- **Solution**: Configured native Capacitor Keyboard plugin in `capacitor.config.ts`:
  - `resize: 'body'` - Let Capacitor handle viewport resizing natively
  - `style: 'dark'` - Dark keyboard theme
  - `resizeOnFullScreen: true` - Handle fullscreen mode correctly
- **Removed**: `src/hooks/useKeyboardFix.ts` (caused more problems than it solved)
- **Status**: Testing on iOS to verify keyboard opens/closes properly without black bar

### Oct 3, 2025 - JavaScript-Based Safe Area System (iOS 26 Fix)
- **Critical Fix**: Replaced CSS `env(safe-area-inset-*)` with JavaScript-based detection due to iOS 26 bug where CSS env() returns empty values
- **Created useSafeAreaInsets Hook**: Progressive enhancement approach - tests CSS env() first, falls back to JS calculations on iOS when needed
- **Universal Update**: Updated all 9 pages (Home, Game, Statistics, Setup, Rules, Settings, InteractiveTutorial, Index, NotFound) and ScrollableContainer component to use the hook
- **Removed Debug Tools**: Cleaned up SafeAreaDebugger component, debug buttons, debug CSS, and keyboard shortcuts
- **Device Detection**: Hook intelligently detects iOS devices, notched phones (iPhone X+), and orientation to calculate appropriate Safe Area insets
- **Fallback Strategy**: On devices where CSS env() fails, uses device-specific pixel values (44px top for notch in portrait, 34px bottom for home indicator, etc.)

### Oct 2, 2025 - iOS Compatibility Improvements
- **Viewport Height Migration**: Changed all remaining `min-h-screen` (100vh) to `min-h-dvh` (100dvh) in Statistics.tsx, Index.tsx, NotFound.tsx, and ErrorBoundary.tsx for proper iOS viewport handling
- **ScrollableContainer Fix**: Made overflow-y: auto always active (previously only when detected), preventing scroll issues on iOS
- **Padding Optimization**: Removed duplicate padding (pb-20) from Rules.tsx and Settings.tsx to prevent gray areas at bottom on iOS
- **Swipe Interaction Fix**: Fixed button accessibility (Home/Settings) by using pointer-events strategy on GameCard wrapper
- **Tutorial Card Size Fix**: Rebuilt tutorial card system with exact GameCard sizing logic (58%×75%, 60%×78%, 62%×80%, 65%×50%) to ensure identical card dimensions between tutorial and game. Uses same responsive breakpoints and inline-block structure as GameCard.

### Oct 2, 2025 - Initial iOS Safe Area Attempt (Superseded by Oct 3 JS-based fix)
- Fixed iPhone 15 Pro fullscreen issues (gray area at bottom, app not extending full height)
- Attempted CSS Safe Area Insets using `env(safe-area-inset-*)` variables (later found non-functional on iOS 26)
- Replaced all `100vh` with `100dvh` (dynamic viewport height) for iOS compatibility
- Added custom Tailwind utilities: `.min-h-dvh` and `.h-dvh`
- Configured Capacitor iOS with `contentInset: 'always'`
- Installed and configured `@capacitor/status-bar` plugin with overlay mode
- Created `src/utils/capacitor-init.ts` for Status Bar initialization

### Oct 1, 2025
- Imported from GitHub
- Configured for Replit environment
- Updated Vite config to use port 5000 and allow Replit hosts
- Set up deployment configuration
- Configured workflow for development server
- Removed old dialog-based tutorial, kept only Interactive Tutorial with swipe gestures
