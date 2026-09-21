This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Assets GLL (`public/images`)

| Archivo | Origen | Descripción |
| --- | --- | --- |
| `gll-player.gif` | `GLL.gif` (Descargas / raíz) | Animación original del reproductor *Windows Media Player GLL* (360×240, 219 frames) |
| `gll-player.jpg` | primer fotograma del GIF | Póster estático del reproductor (360×240) |
| `gll-banner.gif` | `lv_0_20260920233122.gif` (o cualquier `lv_0_*.gif`) | Banner animado; si el GIF dedicado no existe todavía, se usa `GLL.gif` |

Para volver a sincronizar los assets (por ejemplo, después de exportar un nuevo `lv_0_*.gif`):

```bash
npm run gll:assets
```

Uso en componentes (`public/` se sirve desde la raíz):

```tsx
<img src="/images/gll-player.gif" alt="Windows Media Player GLL" />
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
