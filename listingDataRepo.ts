import { RevBaseExpressService } from '@realestateview/avesta-backend-core';

import { RevEsService } from '@app/entities/repositories/revEsService';
import {
	IlistingDataFromQuery,
	IlistingIds,
	fullGridCellId,
	locationBounds,
	locationBoundsData,
	locationId
} from './listingData.interface';
// import { string } from 'joi';
import { ListingDataEsQuery } from './listingDataEsQuery';
// import { EPropertyTypes } from '@realestateview/avesta-js-core';

export class listingDataRepo {
	iRevBase: RevBaseExpressService;
	iRevEsService: RevEsService;
	constructor(aRevBase: RevBaseExpressService) {
		this.iRevBase = aRevBase;
		this.iRevEsService = new RevEsService(this.iRevBase);
	}

	getSuburbDataRecords = async (userData: IlistingDataFromQuery) => {
		const query = ListingDataEsQuery.getSuburbDataEsQuery(userData);

		return this.iRevEsService.revEsSearchQuery<locationId>({
			index: 'locations-view',

			query: { query: query, _source: 'locationId' },

			queryIdentifier: 'get-suburb-data'
		});
	};

	getLocationBounds = async (locationId: number) => {
		const query = ListingDataEsQuery.getLocationBoundsUsingLocationIdEs(locationId);

		return this.iRevEsService.revEsSearchQuery<locationBoundsData>({
			index: 'location-boundaries-view',

			query: { query: query, _source: ['bounds'] },

			queryIdentifier: 'get-bounds-data'
		});
	};
	usingBoundsGetFullGridIds = async (locationBounds: number[][]) => {
		const query = ListingDataEsQuery.getFullGridIdUsingBoundsEsQuery(locationBounds);

		return this.iRevEsService.revEsSearchQuery<fullGridCellId>({
			index: 'listings-on-market-grid-search-view',

			query: {
				query: query,

				_source: ['fullGridCellId']
			},
			size: 100,
			queryIdentifier: 'get-bounds-data'
		});
	};
	fetchListingsByFullGridCellId = async(
		collectIds: string[],
		locationId: number,
		mysize:number,
	params:IlistingDataFromQuery
	) => {
		const query = ListingDataEsQuery.getListingsByFullGridCellId(
			collectIds,
			locationId,
		params
		);

		return this.iRevEsService.revEsSearchQuery<IlistingIds>({
			index: 'listings-on-market-small-view',

			query: { query: query ,
				 _source:['smallGridId'] 
				},
			size: mysize,
			queryIdentifier: 'get-listing-data'
		});
	};
}
