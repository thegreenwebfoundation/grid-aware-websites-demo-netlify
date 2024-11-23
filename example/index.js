import { gridAwarePower } from "https://esm.sh/@greenweb/grid-aware-websites@latest";
import { netlify } from "https://esm.sh/@greenweb/grid-aware-websites@latest/plugins/edge";

export default async (request, context) => {
	
	// Get the location of the user from the Netlify request object
  	let location = netlify.getLocation(context);
	let { country } = location;

	// If the country is not found, then we return the response with an error message in the header
    if (!country) {
      const response = await context.next();
			return new Response(response, {
				headers: {
					...response.headers,
					'grid-aware': 'Error - Country not found',
				},
			});
		}

	// Fetch the grid data for the country using the @greenweb/grid-aware-websites package
    const gridData = await gridAwarePower(country, Netlify.env.get("EMAPS_API_KEY"));

	// If there is an error in fetching the grid data, then we return the response with an error message in the header
    if (gridData.status === 'error') {
			const response = await context.next();
			return new Response(response, {
				headers: {
					'grid-aware': 'Error - Unable to fetch grid data',
				},
			});
		}

    // If the gridAware value is set to true, then let's modify the page
		if (gridData.gridAware) {
			let gridAwarePage = await context.next();

			/*
				Here you can use the HTMLRewriter API, or you can
				use other methods such as redirecting the user to a different page,
				or using a regular expression to change the CSS file used by the page.

				You can also import other libraries like Cheerio or JSDOM to modify the page
				if you are more comfortable with those.

				For this example, we will use the HTMLRewriter API to add a banner to the top of the page
				to show that this is a modified page. **Remember to import the HTMLRewriter API at the top of the file**

				return new Response(new HTMLRewriter().on('html', {
					element(element) {
						element.prepend('<div>This is a modified page</div>', { html: true });
					},
				}).transform(response).body, {
					...response,
					contentType: 'text/html',
				});
			*/

			return new Response(gridAwarePage.body, {
				contentType: 'text/html',
				headers: {
					...gridAwarePage.headers,
					// We can also add some of the grid-aware data to the headers of the response
					'grid-aware': 'false',
					'grid-aware-zone': gridData.region,
					'grid-aware-power-mode': gridData.data.mode,
					'grid-aware-power-minimum': gridData.data.minimumPercentage,
					'low-carbon-percentage': gridData.data['low-carbon percentage'],
					'renewable-percentage': gridData.data['renewable percentage'],
				},
			});
		}
    

		// If the gridAware value is set to false, then return the response as is.
		const response = await context.next();
		return new Response(response, {
			headers: {
				// We can also add some of the grid-aware data to the headers of the response
				'grid-aware': 'false',
				'grid-aware-zone': gridData.region,
				'grid-aware-power-mode': gridData.data.mode,
				'grid-aware-power-minimum': gridData.data.minimumPercentage,
				'low-carbon-percentage': gridData.data['low-carbon percentage'],
				'renewable-percentage': gridData.data['renewable percentage'],
			},
		});
}


// Set the configuration for this edge function to only run on the /example path
export const config = {
  path: "/example",
}