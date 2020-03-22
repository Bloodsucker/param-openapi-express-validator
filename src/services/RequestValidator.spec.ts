import { RequestValidator } from './RequestValidator';
import { ParameterValidatorManager } from './ParameterValidatorManager';
import { OpenAPIV3 } from 'openapi-types';
import { integerSchemaObjectValidator, stringSchemaObjectValidator } from 'openapi-data-type-validators';
import * as openApiUtils from '../utils/openApiUtils';

describe('RequestValidator that validates requests', () => {
	const requestValidator = new RequestValidator(
		new ParameterValidatorManager({
			integerSchemaObjectValidator: integerSchemaObjectValidator,
			stringSchemaObjectValidator: stringSchemaObjectValidator,
		}),
	);

	it('validates simple path arguments', () => {
		const pathsObject: OpenAPIV3.PathsObject = {
			'/myPath/{var}': {
				parameters: [
					{
						in: 'path',
						name: 'var',
						schema: {
							type: 'string',
						},
					},
				],
			},
		};

		const parsedPathItemObjects = openApiUtils.parsePathsObject(pathsObject);

		expect(requestValidator.validatePath('/myPath/myStringParameter', parsedPathItemObjects)).toBe(true);
		expect(requestValidator.validatePath('/myPath/12345', parsedPathItemObjects)).toBe(true);
		expect(requestValidator.validatePath('/myPath/', parsedPathItemObjects)).toBe(false);
		expect(requestValidator.validatePath('/this/is/incorrect/path', parsedPathItemObjects)).toBe(false);
	});

	it('validates path without path parameters', () => {
		const pathsObject: OpenAPIV3.PathsObject = {
			'/myPath/subPath': {},
		};

		const parsedPathItemObjects = openApiUtils.parsePathsObject(pathsObject);

		expect(requestValidator.validatePath('/myPath/subPath', parsedPathItemObjects)).toBe(true);
	});
});
