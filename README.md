<p align="center">
  <img src="https://github.com/dbilgili/kasa/assets/22943912/d5ba9e49-2977-4b8c-abeb-09009d83b797" height="100" width="100">
  <h1 align="center">KASA</h1>
</p>

Kasa is a password manager that you can self-serve and access from virtually anywhere. It’s built as a responsive PWA to work specifically with [Vercel's KV storage](https://vercel.com/docs/storage/vercel-kv). However, feel free to fork and integrate other solutions for data storage.


## Getting started

To get started, create a KV storage on your Vercel project and make sure to add the environment variables to your project, which are listed in the `.env.example` file. `KV_KEY_NAME` is a unique environment variable that you need to set. This key stores the encrypted data. `STORAGE_TYPE` should be set to `vercel-kv`. It can also be set to `local` for local testing purposes. The rest of the environment variables comes from the KV storage itself.

<br/>

<p align="center">
<img src="https://github.com/dbilgili/kasa/assets/22943912/f498a7c2-003e-4216-82e9-05b4b0551d00" style="width: 100%; max-width: 1000px;">
</p>
