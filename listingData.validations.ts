import Joi from 'joi';
import { IgetListingDataValidation } from './listingData.interface';
import { EPropertyTypes } from '@realestateview/avesta-js-core';

const listingDataValidations: IgetListingDataValidation = {
	getSuburbData: Joi.object({
		state: Joi.string().required(),
		postcode: Joi.number().required(),
		suburbNameSlug: Joi.string().required(),
		bedrooms: Joi.number(),
		bathrooms: Joi.number(),
		carparks: Joi.number(),
		propertyTypes: Joi.array().items(...Object.values(EPropertyTypes)),
		size:Joi.number()
	})
};

export default listingDataValidations;
