# Prepr Next.js SSG example

This Next.js project is an SSG example with demo content from Prepr.

Look at the [Next.js caching strategies guide](https://docs.prepr.io8/connecting-a-front-end-framework/nextjs/caching-strategies#prepr-nextjs-ssg-example) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Add the environment file
Copy the `.env.example` file in this directory to a new `.env` file by running the following command:
```bash
cp .env.example .env
```

## Update the environment file
In the .env file, replace `{YOUR_GRAPHQL_URL}` with the *API URL* of the Prepr *GraphQL* access token from your Acme Lease demo environment.

![preview API URL](https://assets-site.prepr.io//35k5a4g45wuy-preview-access-token.png)


## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Deploy and add webhooks

Deploy the app in your preferred deployment tool. You need the deployed URL to set up the corresponding webhooks in Prepr.
Check out the [deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more information.

Configure two webhooks in Prepr like in the images below to listen for changed and published content and trigger your site to reset the cache.

![Example webhook - changed content](https://assets-site.prepr.io/7ibro5u053dl//revalidate-cache-webhook-changed-content.png)

Set the **URL** value to `{YOUR_DEPLOYMENT_URL}/api/post-updated`, choose `content-item.changed` for **Events**  and choose `Post` for **Models**.

![Example webhook - published content](https://assets-site.prepr.io/2m8a63xejq2//revalidate-cache-webhook-published.png)

Set the **URL** value to `{YOUR_DEPLOYMENT_URL}/api/post-published`, choose `content-item.published` for **Events**,  and choose `Post` for **Models**.

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

