/*
 * Serializer.js - common SPI for serializer plugins
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

import IntermediateRepresentation from "./IntermediateRepresentation.js";
import NotImplementedError from "./NotImplementedError.js";

/**
 * @class common SPI for serializer plugins
 * 
 * A serializer converts IntermediateRepresentations into strings that
 * can be written back to files.
 * 
 * @abstract
 */
class Serializer {
    /**
     * Construct a new serializer instance.
     *
     * @param {Object} [options] options to the constructor
     * @param {Function} [options.getLogger] a callback function provided by
     * @param {object} [options.settings] additional settings that can be passed to the serializer
     * the linter to retrieve the log4js logger
     */
    constructor(options) {
        if (this.constructor === Serializer) {
            throw new Error("Cannot instantiate abstract class Plugin directly!");
        }
        this.getLogger = options?.getLogger;
    }

    /** a callback function provided by
     * the linter to retrieve the log4js logger
     * @type {Function | undefined}
     */
    getLogger;

    /**
     * Initialize the current plugin.
     */
    init() {}

    /** name of this type of serializer
     * 
     * Subclass must define this property.
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass must define this property
    name;

    /**
     * Return the name of this type of serializer.
     * Subclass must define {@link Serializer.name}.
     *
     * @returns {String} return the name of this type of serializer
     */
    getName() {
        return this.name;
    }

    /** description of what this serializer does and what kinds of files it
     * handles for users who are trying to discover whether or not to use it
     * 
     * Subclass must define this property.
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass must define this property
    description;

    /**
     * Return a description of what this serializer does and what kinds of files it
     * handles for users who are trying to discover whether or not to use it.
     * 
     * Subclass must define {@link Serializer.description}.
     *
     * @returns {String} a description of this serializer.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Serialize the given intermediate representation into a string.
     * 
     * @param {IntermediateRepresentation} representation the representation
     * to serialize
     * @abstract
     * @returns {string} the serialized form of the intermediate representation
     */
    parse(representation) {
        throw new NotImplementedError();
    }

    /**
     * Type of intermediate representation that this serializer
     * serializes. The type should be a unique name that matches with
     * the rule type for rules that process this intermediate representation
     *
     * There are three types that are reserved, however:
     *
     * - resource - the serializer returns an array of Resource instances as
     *   defined in {@link https://github.com/ilib-js/ilib-tools-common}.
     * - line - the serializer produces a set of lines as an array of strings
     * - string - the serializer doesn't parse. Instead, it just treats the
     *   the file as one long string.
     *
     * Subclass must define this property.
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass must define this property
    type;

    /**
     * Return the type of intermediate representation that this serializer
     * produces. The type should be a unique name that matches with
     * the rule type for rules that process this intermediate representation.
     *
     * Subclass must define {@link Parser.type}.
     *
     * @abstract
     * @returns {String} the name of the type of intermediate representation
     * that this serializer produces
     */
    getType() {
        return this.type;
    }
};

export default Serializer;
