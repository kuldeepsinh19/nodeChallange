import { RevBaseExpressService } from '@realestateview/avesta-backend-core';
import { IlistingDataFromQuery } from './listingData.interface';

import { listingDataRepo } from './listingDataRepo';

export class ListingData {
	iRevBase: RevBaseExpressService;
	userData: IlistingDataFromQuery;
	iListingData: listingDataRepo;
	constructor(aRevBase: RevBaseExpressService, userData: IlistingDataFromQuery) {
		this.iRevBase = aRevBase;
		this.userData = userData;
		this.iListingData = new listingDataRepo(this.iRevBase);
	}

	getListings = async () => {
		if (!this.userData.size) {
			return;
		}
		const userSize = this.userData.size;
		const locationId = await this.getSuburbDataByStatePostcodeAndSuburbNameSlug(this.userData);
		if (!locationId) {
			return;
		}
		const locationBounds = await this.getLocationBoundsUsingLocationId(locationId);
		const collectIds = await this.usingBoundsGetFullGridId(locationBounds);
		if (!collectIds) {
			return;
		}
		const listingData = [];
		const idUsedForListings:string[]= []
	 
		let totalListing = 0;
		while (totalListing < 100) {
			if(collectIds.length === 0 ){
				break	
			}
			const randomIds = await this.getRandomIdFromFullGridId(collectIds , idUsedForListings );
			idUsedForListings.push(...randomIds)
			const mysize = userSize - totalListing;
			const listings = await this.getListingsByFullGridCellId(randomIds, locationId, mysize);
			listingData.push(listings);
			totalListing += listings.length;
		}
		return listingData;
	};
     
	getSuburbDataByStatePostcodeAndSuburbNameSlug = async (userData: IlistingDataFromQuery) => {
		const getLocationId = await this.iListingData.getSuburbDataRecords(userData);
		console.log(getLocationId);

		if (getLocationId.length === 0) {
			return;
		}
 
		const locationId = getLocationId[0].locationId;

		return locationId;
	};

	getLocationBoundsUsingLocationId = async (locationId: number) => {
		const locationBoundsData = await this.iListingData.getLocationBounds(locationId);

		const locationBounds: number[][] = locationBoundsData[0].bounds.coordinates;

		return locationBounds;
	};

	usingBoundsGetFullGridId = async (locationBounds: number[][]) => {
		const fullGridCellIds = await this.iListingData.usingBoundsGetFullGridIds(locationBounds);
		console.log(fullGridCellIds);

		if (fullGridCellIds.length === 0) {
			return;
		}
		const collectIds: string[] = [];

		fullGridCellIds.forEach((Element) => {
			collectIds.push(Element.fullGridCellId);
		});

		console.log(collectIds);
		return collectIds;
	};

	getListingsByFullGridCellId = async (
		collectIds: string[],
		locationId: number,
		mysize: number
	) => {
		const params = this.userData;
	
			return await this.iListingData.fetchListingsByFullGridCellId(
				collectIds,
				locationId,
				mysize,
				params
			);
		}
	


	getRandomIdFromFullGridId = async (collectIds: string[] , idUsedForListings:string[]) => {

		const randomIds: string[] = [];
	
		while (randomIds.length < 5) {
			if(collectIds.length === 0){
				console.log(collectIds.length)
				break
			}
			const index = Math.floor(Math.random() * collectIds.length);
			const id = collectIds[index];
			if (!idUsedForListings.includes(id)) {
				randomIds.push(id);
			
			}
		}
		return randomIds;
	}
}
