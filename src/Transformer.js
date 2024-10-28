/*
 * Transformer - common SPI for a transformer plugin
 *
 * Copyright © 2024 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import NotImplementedError from "./NotImplementedError.js";
import PipelineElement from "./PipelineElement.js";

// type imports
/** @ignore @typedef {import('./IntermediateRepresentation.js').default} IntermediateRepresentation */
/** @ignore @typedef {(category?: string) => import('log4js').Logger} LoggerFactory */

/**
 * @typedef TransformerOptions
 * @property {LoggerFactory} [getLogger] a callback function provided by the linter to retrieve the log4js logger
 * @property {unknown} [settings] additional settings that can be passed to the transformer through linter configuration
 */

/**
 * @ignore @typedef {new (options?: TransformerOptions) => Transformer} TransformerClass
 * 
 * A constructor function which must inherit from Transformer.
 * Note this is the class, not an instance of the class.
 * The linter may need to instantiate this transformer multiple times.
 * Its constructor must optionally accept a single argument of type {@link TransformerOptions}.
 * 
 * Note: This type definition is tagged with `@\ignore` because JSDoc does not support TypeScript-style type definitions,
 * nor does it allow to define a type for a constructor function differently - see https://github.com/jsdoc/jsdoc/issues/1349.
 */

/**
 * @class common SPI for transformer plugins
 *
 * A transformer is a plugin that takes an intermediate representation of a
 * file and transforms it in some way, and returns a new intermediate
 * representation that is a modified version of the original. For example,
 * a filter transformer might remove some of the entries in the intermediate
 * representation that match a certain pattern, or it might
 * add new entries to the intermediate representation.
 *
 * @abstract
 */
class Transformer extends PipelineElement {
    /**
     * Construct a new transformer instance.
     *
     * @param {TransformerOptions} [options] options to the constructor
     */
    constructor(options) {
        super(options);
        if (this.constructor === Transformer) {
            throw new Error("Cannot instantiate abstract class Transformer directly!");
        }
        this.getLogger = options?.getLogger;
    }

    /**
     * Transform the given intermediate representation and return a new
     * intermediate representation that is a modified version of the original.
     *
     * @abstract
     * @param {IntermediateRepresentation} representation the intermediate
     *   representation to transform
     * @returns {IntermediateRepresentation} the new intermediate representation
     *   that is the transformed version of the original
     */
    transform(representation) {
        throw new NotImplementedError();
    }
};

export default Transformer;
