# Showreel

Source for the 30-second hero video on the resume site (`../showreel.mp4`), built with [Remotion](https://www.remotion.dev/).

```bash
npm install
npm run studio   # live preview + scrubbing in the browser
npm run render   # writes ../showreel.mp4
npm run poster   # writes ../showreel-poster.jpg (outro frame)
```

- Scene timing lives in `src/theme.ts` (`T`), colors mirror the site's dark-theme tokens.
- Each scene is a file in `src/scenes/`. All copy comes from the resume — update both together.
- `public/` holds the logos, headshot, and screenshots of Cart Jockey and Band Rise.
  Bitcoin Portfolio is drawn as an illustration on purpose, so no personal financial data ever appears in the video.
