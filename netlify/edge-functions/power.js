import { gridAwarePower } from "https://esm.sh/@greenweb/grid-aware-websites@latest";
import { getLocation } from "https://esm.sh/@greenweb/gaw-plugin-netlify-edge@latest";
import { gridAwareRewriter, regularRewriter } from "./utils/index.js";

export default async (request, context) => {
  let location = getLocation(context);
	let { country } = location;

    if (!country) {
      const response = await context.next();
			return new Response(response, {
				headers: {
					...response.headers,
					'grid-aware': 'Error - Country not found',
				},
			});
		}

    const gridData = await gridAwarePower(country, Netlify.env.get("EMAPS_API_KEY"));

    if (gridData.status === 'error') {
			const response = await context.next();
			return new Response(response, {
				headers: {
					'grid-aware': 'Error - Unable to fetch grid data',
				},
			});
		}

    // If the gridAware value is set to true, then we need to edit the "data-theme" attribute of the HTML tag to "dark" using the HTmlRewriter
		if (gridData.gridAware) {
			// Create a new HTMLRewriter instance
			// Also add a banner to the top of the page to show that this is a modified page

			const rewriter = gridAwareRewriter(gridData, "gridAwarePower");

			// Return the response with the rewriter applied
			return rewriter.transform(await context.next());
		}
    
		const rewriter = regularRewriter(gridData, "gridAwarePower");

		return rewriter.transform(await context.next());
}



export const config = {
  path: "/power-breakdown",
  excludedPath: ["/static/*"],
}