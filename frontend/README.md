# Storefront

## Configure the API

The storefront needs `VITE_API_URL`, the origin of the shared backend (for example, `https://your-api.onrender.com`). Vite embeds this value into the JavaScript bundle at build time.

For local development, copy `.env.example` to `.env` and keep the local backend URL:

```text
VITE_API_URL=http://localhost:3000
```

For a Vercel deployment, open the storefront project's **Settings → Environment Variables**, add `VITE_API_URL` with the deployed backend origin, and apply it to the environments you deploy. Then trigger a new deployment; changing the variable does not update an already-built bundle.

Do not include a trailing path such as `/api`, and do not put backend secrets in frontend variables. The browser's storefront domain is sent to the backend to resolve the vendor.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```
