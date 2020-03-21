import {ParameterValidatorManager, ParameterValidators} from './ParameterValidatorManager';
import { integerSchemaObjectValidator, stringSchemaObjectValidator } from 'openapi-data-type-validators';
import { OpenAPIV3 } from 'openapi-types';

describe('Validate a parameter', () => {
    const parameterValidatorsMocks: ParameterValidators = {
        integerSchemaObjectValidator: jest.fn(integerSchemaObjectValidator),
        stringSchemaObjectValidator: jest.fn(stringSchemaObjectValidator)
    };
    const mockedparameterValidators: Record<keyof ParameterValidators, jest.Mock> = {
        integerSchemaObjectValidator: parameterValidatorsMocks.integerSchemaObjectValidator as jest.Mock,
        stringSchemaObjectValidator: parameterValidatorsMocks.stringSchemaObjectValidator as jest.Mock
    };

    const parameterValidatorManager = new ParameterValidatorManager(parameterValidatorsMocks);

    beforeEach(() => {
        mockedparameterValidators.integerSchemaObjectValidator.mockClear();
        mockedparameterValidators.stringSchemaObjectValidator.mockClear();
    });

    it('Parses and validates strings', () => {
        const schemaObject: OpenAPIV3.SchemaObject = {
            type: 'string'
        };

        expect(parameterValidatorManager.validate("myString", schemaObject)).toBe(true);

        expect(mockedparameterValidators.stringSchemaObjectValidator.mock.calls.length).toBe(1);
        expect(mockedparameterValidators.integerSchemaObjectValidator.mock.calls.length).toBe(0);
    });

    it('Parses and validates integers', () => {
        const schemaObject: OpenAPIV3.SchemaObject = {
            type: 'integer'
        };

        const integerValue: string = '1234';
        expect(parameterValidatorManager.validate("1234", schemaObject)).toBe(true);
        
        expect(mockedparameterValidators.integerSchemaObjectValidator.mock.calls.length).toBe(1);
        expect(mockedparameterValidators.integerSchemaObjectValidator.mock.calls[0][0]).toBe(parseInt(integerValue));
        expect(mockedparameterValidators.stringSchemaObjectValidator.mock.calls.length).toBe(0);
    });
});
