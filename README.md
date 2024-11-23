# Grid-aware websites demo

This repo is a demo website for the Green Web Foundation's [Grid-aware Websites](https://github.com/thegreenwebfoundation/grid-aware-websites) project. It demonstrates grid-aware code being run in against routes using Netlify Edge Functions.

## Demo sites

You can see this code working on the public internet at: [https://grid-aware-demo.netlify.app/power-breakdown/](https://grid-aware-demo.netlify.app/power-breakdown/)

## How it works

This demo shows the `@greenweb/grid-aware-websites` package being used to check the state of the client's energy grid in order to determine if changes should be made to the returned web page. The code runs in two Netlify Edge Functions, one for each of the routes below:

- `/power-breakdown`: This worker checks to see if the current percentage of renewable energy being used on the client's electricity grid is below a set threshold (in our case 50%). If it is, then the `@greenweb/grid-aware-websites` library returns a value indicating that changes should be made to the returned web page to reduce the energy it might use on the client's device. These changes are applied using the `HTMLRewriter` API. [See the Worker source code.](/netlify/edge-functions/power.js).
- `/grid-breakdown`: This worker checks to see if the current grid carbon intensity (in grams CO2e/kilowatt-hour) of the client's electricity grid is above the last known annual average. If it is, then the `@greenweb/grid-aware-websites` library returns a value indicating that changes should be made to the returned web page to reduce the energy it might use on the client's device. These changes are applied using the `HTMLRewriter` API. [See the Worker source code.](/netlify/edge-functions/co2e.js).

For more information, see the [Grid-aware Websites](https://github.com/thegreenwebfoundation/grid-aware-websites) project repository.

## Example Worker

The [`example`](/example/) folder contains a boilerplate Netlify Edge Function script that can help you get started. To use it:

1. Copy the files to a folder on your Netlify project that contains your Edge Functions. Learn about [setting up Edge Functions](https://docs.netlify.com/edge-functions/overview/) in the Netlify Docs.
2. You will need to ensure that when using this file in a project, you set the `EMAPS_API_KEY` enivironment variable to your [Electricity Maps API Key](https://www.electricitymaps.com/free-tier-api).
3. Modify the `index.js` file as desired. It is setup to use the `gridAwarePower` function from the `@greenweb/grid-aware-websites` library. Remember to also modify the config at the bottom of the file.

## Running this site locally

This website is a minimal Eleventy site with some static assets. To run this project locally, you can:

1. Clone the repository
2. In the root folder for this project, run `npm install`.
3. Setup your netlify development environment using [Netlify CLI](https://docs.netlify.com/cli/get-started/). This includes:
   - Deploying this site to Netlify using `netlify deploy`
   - Linking this project to the newly deployed site using `netlify link`
   - Setting environment variables for the Edge Function using `netlify env:set EMAPS_API_KEY some_api_key_value`
4. Since you've installed Netlify CLI, you can run the site locally using the `netlify dev` command

## Deploying the site

You can deploy this site to Netlify by following their regular [deployment instructions](https://docs.netlify.com/get-started/).
