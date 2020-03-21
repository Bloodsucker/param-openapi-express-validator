import { OpenAPIV3 } from 'openapi-types';

export namespace openApiUtils {
    class PathMatch {
        readonly parsedPathItemObject: ParsedPathItemObject;
        readonly parameters: {[name: string]: string};

        constructor(parsedPathItemObject: ParsedPathItemObject, parameter: {[name: string]: string}) {
            this.parsedPathItemObject = parsedPathItemObject;
            this.parameters = parameter;
        }
    }

    export class ParsedPathItemObject {
        readonly pathRegex: RegExp;
        readonly pathPattern: string;
        readonly pathItemObject: OpenAPIV3.PathItemObject;
        readonly commonPathParameters: {[name: string]: OpenAPIV3.SchemaObject};

        constructor(pathRegex: RegExp, pathPattern: string, pathItemObject: OpenAPIV3.PathItemObject) {
            this.pathRegex = pathRegex;
            this.pathPattern = pathPattern;
            this.pathItemObject = pathItemObject;

            this.commonPathParameters = {};

            this.processPathParameters();
        }

        private processPathParameters() {
            if(!this.pathItemObject.parameters) return;

            for(const parameterObject of this.pathItemObject.parameters) {
                if('name' in parameterObject) {
                    if(parameterObject.in == "path" && parameterObject.name) {
                        if(parameterObject.schema && 'type' in parameterObject.schema) {
                            this.commonPathParameters[parameterObject.name] = parameterObject.schema;
                        } else if(parameterObject.schema && '$ref' in parameterObject.schema) {
                            // TODO $ref
                        } else { // If parameter was defined in path but doesn't have ObjectSchema
                            this.commonPathParameters[parameterObject.name] = {
                                type: 'string' // this will match anything
                            };
                        }
                    }
                } else {
                    // TODO $ref, but confirm how this is supposed to work.
                }
            }
        }
    }

    export function parsePathsObject(pathsObject: OpenAPIV3.PathsObject): ParsedPathItemObject[] {
        const parsedPathItemObjects:ParsedPathItemObject[] = [];

        for (const pathPattern in pathsObject) {
            const regex = parsePathPattern(pathPattern);

            parsedPathItemObjects.push(new ParsedPathItemObject(regex, pathPattern, pathsObject[pathPattern]));
        }

        return parsedPathItemObjects;
    }

    export function findPathMatch(path: string, parsedPathItemObjects: openApiUtils.ParsedPathItemObject[]): PathMatch | undefined {
        for(const parsedPathItemObject of parsedPathItemObjects) {
            const match = parsedPathItemObject.pathRegex.exec(path);

            if(match) {
                return new PathMatch(parsedPathItemObject, match.groups || {});
            }
        }
    }

    export function parsePathPattern(path:string): RegExp {
        let safePathRegexStr = path.replace(/{(.+?)}/g, function(match:string, varName: string) {
            return `(?<${varName}>[^\\/]+)`;
        }).replace(/\//, "\\$&");

        safePathRegexStr = `^${safePathRegexStr}$`;

        return new RegExp(safePathRegexStr);
    }
}
