# Secure Booklet Viewer V3.1

This fixed version uses `react-pageflip` with React.forwardRef page components and guarded navigation controls.

It provides:
- Single front cover
- Real two-page spread after opening
- Hard cover behavior
- Page curl/turn animation
- Corner drag
- Mouse click navigation
- Touch swipe
- Page shadow
- Final single back cover
- Zoom control
- Fullscreen
- Local sample pages

Run:

npm install
npm run dev

Open:

http://localhost:3000/book/demo-book

The sample pages are in public/books/demo-book/.

Important:
This is a functional recreation of the physical-book interaction, not FlipHTML5's proprietary implementation or source code. Exact pixel-for-pixel reproduction of a third-party product is not something we should claim.


## Navigation fix
The page component forwards its DOM ref as required by react-pageflip, and Previous/Next controls wait for the flip engine to initialize.

## Verification note
The source was checked locally. A full npm build could not be completed in this environment because npm package installation timed out while contacting the package registry. Run `npm install && npm run build` locally to perform the final environment-specific build.


## V4 changes
- Larger fixed 520x736 page size for more consistent cover centering.
- First and last pages use `showCover` and remain single centered covers.
- Middle pages remain a two-page spread.
- Added a lightweight synthetic paper page-turn sound using Web Audio API.
- No external audio asset or CDN is required.
- Sound starts/works after user interaction, respecting browser autoplay restrictions.
