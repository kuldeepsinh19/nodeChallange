// import { StringInput } from 'aws-sdk/clients/inspector2';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import Joi from 'joi';
// import { ELocationTypes } from '@app/entities/listingSeoDiscription';
import { EPropertyTypes } from '@realestateview/avesta-js-core';
export interface IValidationRequestQuerySchema<T> extends ValidatedRequestSchema {
	[ContainerTypes.Query]: T;
}

export interface IgetListingDataValidation {
	getSuburbData: Joi.ObjectSchema<IlistingDataFromQuery>;
}
export interface IlistingDataFromQuery {
	state: string;
	postcode: number;
	suburbNameSlug: string;
	bathrooms?: number;
	bedrooms?: number;
	carparks?: number;
	propertyTypes?: string[];
	size?:number
}

export interface locationId {
	locationId: number;
}
export interface locationBounds {
	locationBounds: number[][];
}

export interface getSuburbData {
	locationId: number;
	_id: string;
}
export interface locationBoundsData {
	bounds: {
		coordinates: number[][];
		type: string;
	};
}
export interface fullGridCellId {
	fullGridCellId: string;
}
export interface IlistingIds {
    smallGridId : string
}