import { findPathMatch, ParsedPathItemObject, parsePathPattern, parsePathsObject } from './openApiUtils';
import { OpenAPIV3 } from 'openapi-types';

describe('OpenApi Utility tests', () => {
	describe('a path pattern parser', () => {
		it('parses a pattern-path and matches paths', () => {
			expect(parsePathPattern('/myPath').test('/myPath')).toBe(true);
			expect(parsePathPattern('/myPath').test('/myPath/')).toBe(false);
			expect(parsePathPattern('/myPath').test('/myPath/somethingelse')).toBe(false);

			expect(parsePathPattern('/myPath/{param1}').test('/myPath/param1')).toBe(true);
			expect(parsePathPattern('/myPath/{param1}').test('/myPath/')).toBe(false);
			expect(parsePathPattern('/myPath/{param1}').test('/myPath/param1/param2')).toBe(false);

			expect(parsePathPattern('/myPath/{param1}/{param2}').test('/myPath/param1/param2')).toBe(true);
		});

		it('parses pattern-path with arguments and matches them', () => {
			const match1 = parsePathPattern('/myPath').exec('/myPath');

			expect(match1).not.toBeUndefined();
			expect(match1?.groups).toBeUndefined();

			const match2 = parsePathPattern('/myPath/{param1}').exec('/myPath/value1');
			expect(match2).not.toBeUndefined();
			expect(match2?.groups).toMatchObject({ param1: 'value1' });

			const match3 = parsePathPattern('/myPath/{param1}/{param2}').exec('/myPath/value1/value2');
			expect(match3).not.toBeUndefined();
			expect(match3?.groups).toMatchObject({ param1: 'value1', param2: 'value2' });
		});
	});

	describe('a path matcher', () => {
		const simplePath = '/myPath',
			path1Param = '/myPath/{param1}',
			path2params = '/myPath/{param1}/{param2}';

		const pathsObject: OpenAPIV3.PathsObject = {
			[simplePath]: {},
			[path1Param]: {
				/*...*/
			},
			[path2params]: {
				/*...*/
			},
		};

		const parsedPathItemObjects: ParsedPathItemObject[] = parsePathsObject(pathsObject);

		it('finds and matches a path', () => {
			const foundPathMatch = findPathMatch('/myPath', parsedPathItemObjects);

			expect(foundPathMatch).not.toBeUndefined();
			expect(foundPathMatch?.parsedPathItemObject.pathItemObject).toStrictEqual(pathsObject[simplePath]);
		});

		it('finds and matches a path with a param', () => {
			const foundPathMatch = findPathMatch('/myPath/aParameter', parsedPathItemObjects);

			expect(foundPathMatch).not.toBeUndefined();
			expect(foundPathMatch?.parsedPathItemObject.pathItemObject).toStrictEqual(pathsObject[path1Param]);
			expect(foundPathMatch?.parameters).toMatchObject({ param1: 'aParameter' });
		});

		it('finds and matches a path with multiple params', () => {
			const foundPathMatch = findPathMatch('/myPath/aParameter/otherParam', parsedPathItemObjects);

			expect(foundPathMatch).not.toBeUndefined();
			expect(foundPathMatch?.parsedPathItemObject.pathItemObject).toBe(pathsObject[path2params]);
			expect(foundPathMatch?.parameters).toMatchObject({
				param1: 'aParameter',
				param2: 'otherParam',
			});
		});
	});
});
