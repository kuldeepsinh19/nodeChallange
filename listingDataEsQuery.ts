import { IlistingDataFromQuery, locationId } from './listingData.interface';

export class ListingDataEsQuery {
	static getSuburbDataEsQuery(userData: IlistingDataFromQuery) {
		const query = {
			bool: {
				must: [
					{
						term: {
							state: userData.state
						}
					},
					{
						term: {
							postcode: userData.postcode
						}
					},
					{
						term: {
							suburbNameSlug: userData.suburbNameSlug
						}
					}
				]
			}
			// _source: "locationId"
		};
		return query;
	}

	static getLocationBoundsUsingLocationIdEs(locationId: number) {
		const query = {
			bool: {
				must: [
					{
						term: {
							locationId: locationId
						}
					}
				]
			}
			// _source: "locationId"
		};
		return query;
	}

	static getFullGridIdUsingBoundsEsQuery(locationBounds: number[][]) {
		const query = {
			bool: {
				must: [
					{
						term: {
							gridLevel: {
								value: 'small'
							}
						}
					}
				],
				filter: {
					geo_shape: {
						gridBound: {
							shape: {
								type: 'envelope',
								coordinates: locationBounds
							},
							relation: 'within'
						}
					}
				}
			}
		};
		return query;
	}

	static getListingsByFullGridCellId(
		collectIds: string[],
		locationId: number,
		params: IlistingDataFromQuery
	) {
		const query: Record<string, any> = {
			bool: {
				must: [
					{
						term: {
							suburbId: locationId
						}
					},
					{
						terms: {
							smallGridId: collectIds
						}
					}
				]
			}
		};
		if (params.bathrooms) {
			query.bool.must.push({
				range: {
					bathrooms: {
						gte: params.bathrooms
					}
				}
			});
		}

		if (params.bedrooms) {
			query.bool.must.push({
				range: {
					bedrooms: {
						gte: params.bedrooms
					}
				}
			});
		}

		if (params.carparks) {
			query.bool.must.push({
				range: {
					carparks: {
						gte: params.carparks
					}
				}
			});
		}

		if (params.propertyTypes) {
			query.bool.must.push({
				terms: {
					propertyTypes: params.propertyTypes
				}
			});
		}

		return query;
	}
}
