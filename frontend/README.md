This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Design system

The UI is built from the PJS Gym design system in `/design-system` (read its `readme.md` first). The app is built with `frontend/` as its root, so a copy lives in `src/design-system/`:

```bash
bun run sync:ds   # re-copy after any change in /design-system
```

- Import components from `@/design-system`. It is a client module, so use components with sub-parts (`TopBar.Action`, `Tabs.List`) inside client components.
- Tokens are also Tailwind utilities, defined in `src/app/globals.css`: `text-fg-2`, `bg-surface-raised`, `text-title-l`, `px-gutter`.
- Never edit `src/design-system/` by hand. ESLint skips it.

## Tests

```bash
bun test
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Video credits

`public/videos/` holds compressed cuts of eight clips from [Mixkit](https://mixkit.co), under the Mixkit Stock Video Free License:

- `welcome-1.mp4`: [Young fitness woman jumping a box in her workout](https://mixkit.co/free-stock-video/young-fitness-woman-jumping-a-box-in-her-workout-40246/)
- `welcome-2.mp4`: [Strong woman training lifting weights](https://mixkit.co/free-stock-video/strong-woman-training-lifting-weights-44433/)
- `welcome-3.mp4`: [A young woman performs squats](https://mixkit.co/free-stock-video/a-young-woman-wearing-a-black-sportswear-outfit-performs-squats-52106/)
- `welcome-4.mp4`: [Man doing push-ups using dumbbells](https://mixkit.co/free-stock-video/man-doing-push-ups-using-dumbbells-40248/)
- `tutorial-1.mp4`: [Man in a weightlifting session](https://mixkit.co/free-stock-video/man-in-a-weightlifting-session-100545/)
- `tutorial-2.mp4`: [Man working out on a lat pulldown machine](https://mixkit.co/free-stock-video/man-working-out-on-a-lat-pulldown-machine-100549/)
- `tutorial-3.mp4`: [People running on treadmills at the gym](https://mixkit.co/free-stock-video/people-running-on-treadmills-at-the-gym-100530/)
- `tutorial-4.mp4`: [Woman using a gym machine for strength training](https://mixkit.co/free-stock-video/woman-using-a-gym-machine-for-strength-training-100523/)
