import { Router } from 'express';
import { createValidator } from 'express-joi-validation';
import { ListingDataController } from './listingDataController';
const router = Router();
import listingDataValidations from './listingData.validations';
import { hppWhiteListParamsMiddleWare } from '@app/middleWares/hppwhiteList.middleWare';
const validator = createValidator({ passError: true });

router.get(
	'/search',
	hppWhiteListParamsMiddleWare('propertyTypes'),
	validator.query(listingDataValidations.getSuburbData),
	ListingDataController.getSuburbData.bind(ListingDataController)
);

export { router };
