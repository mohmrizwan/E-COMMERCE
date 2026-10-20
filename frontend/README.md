# Storefront

## Configure the API

The storefront needs `VITE_API_URL`, the origin of this client's deployed backend (for example, `https://your-api.onrender.com`). Vite embeds this value into the JavaScript bundle at build time.

Set `VITE_STORE_NAME` to customize storefront copy. Replace the storefront logo and imagery under `src/assets`, replace the vendor-panel logo at `vendor-panel/public/Copilot_20260831_214454.png`, and review contact details and legal copy before publishing each client build.

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
