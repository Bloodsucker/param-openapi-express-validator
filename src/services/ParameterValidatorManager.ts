import { OpenAPIV3 } from 'openapi-types';

export class ParameterValidatorManager {
	private parameterValidators: ParameterValidators;

	constructor(parameterValidators: ParameterValidators) {
		this.parameterValidators = parameterValidators;
	}

	validate(value: string, schemaObject: OpenAPIV3.SchemaObject): boolean {
		switch (schemaObject.type) {
			case 'string':
				return this.parameterValidators.stringSchemaObjectValidator(value, schemaObject);
			case 'integer':
				return this.parameterValidators.integerSchemaObjectValidator(parseInt(value), schemaObject);
			default:
				return false; // Otherwise, type is unsupported.
		}
	}
}

export interface ParameterValidators {
	integerSchemaObjectValidator: (value: number, schemaObject: OpenAPIV3.SchemaObject) => boolean;
	stringSchemaObjectValidator: (value: string, schemaObject: OpenAPIV3.SchemaObject) => boolean;
}
