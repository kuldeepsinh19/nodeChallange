import { RevBaseExpressService, UtilsService } from '@realestateview/avesta-backend-core';
import { NextFunction, Response } from 'express';
import {
	IlistingDataFromQuery,
	// IUnifiedSearchBody,
	IValidationRequestQuerySchema
} from './listingData.interface';
import { ListingData } from './listingData';

export class ListingDataController {
	static getSuburbData = async (
		aReq: IValidationRequestQuerySchema<IlistingDataFromQuery>,
		aRes: Response,
		aNext: NextFunction
	) => {
		const userData = aReq.query;
		const reqMetadata = UtilsService.getRequestMetadata(aReq);
		const iRevBase = new RevBaseExpressService(reqMetadata);

		try {
			const iListingData = new ListingData(iRevBase, userData);
			const response = await iListingData.getListings(
				
			);

			aRes.send({
				success: true,
				data: response
			});
		} catch (aError) {
			iRevBase.errorLog({
				data: aError,
				msg: 'Location search result'
			});
			return aNext(aError);
		}
	};
}
