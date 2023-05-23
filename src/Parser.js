/*
 * Parser.js - common SPI for parser plugins
 *
 * Copyright © 2022-2023 JEDLSoft
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
 * @class common API for parser plugins
 * @abstract
 * @template T
 */
class Parser {
    /**
     * Construct a new plugin.
     *
     * @param {Object} [options] options to the constructor
     * @param {string} [options.filePath] path to the file that should be parsed
     * @param {object} [options.settings] additional settings that can be passed to the parser
     * @param {((name: string) => any)} [options.getLogger] a callback function provided by
     * the linter to retrieve the log4js logger
     */
    constructor(options) {
        if (this.constructor === Parser) {
            throw new Error("Cannot instantiate abstract class Plugin directly!");
        }
        this.filePath = options?.filePath;
        this.getLogger = options?.getLogger;
    }

    /** a callback function provided by
     * the linter to retrieve the log4js logger
     * @type {((name: string) => any)|undefined}
     */
    getLogger;

    /**
     * Initialize the current plugin.
     * @abstract
     */
    init() {}

    /** name of this type of parser
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass should define this property
    name;

    /**
     * Return the name of this type of parser.
     * Subclasses should assign `this.name` in their constructor.
     *
     * @returns {String} return the name of this type of parser
     */
    getName() {
        return this.name;
    }

    /** description of what this parser does and what kinds of files it
     * handles for users who are trying to discover whether or not to use it
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass should define this property
    description;

    /**
     * Return a description of what this parser does and what kinds of files it
     * handles for users who are trying to discover whether or not to use it.
     *
     * @returns {String} a description of this parser.
     */
    getDescription() {
        return this.description;
    }

    /** list of extensions of the files that this parser handles.
     * The extensions are listed without the dot. eg. ["json", "jsn"]
     * @readonly
     * @abstract
     * @type {string[]}
     */
    // @ts-expect-error: subclass should define this property
    extensions;

    /**
     * Return the list of extensions of the files that this parser handles.
     * The extensions are listed without the dot. eg. ["json", "jsn"].
     * Subclasses should assign `this.extensions` in their constructor.
     *
     * @returns {Array.<String>} a list of file name extensions
     */
    getExtensions() {
        return this.extensions;
    }

    /**
     * Parse the current file into an intermediate representation. This
     * representation may be anything you like, as long as the rules you
     * implement also can use this same format to check for problems.<p>
     *
     * Many parsers produce an abstract syntax tree. The tree could have
     * a different style depending on the programming language, but
     * generally, each node has a type, a name, and an array of children,
     * as well as additional information that depends on the type of
     * the node.<p>
     *
     * Other types of intermediate representation could include:<p>
     *
     * <ul>
     * <li>lines - just split the file into an array of lines in order
     * <li>string - treat the whole file like a big string
     * <li>concrete syntax tree - a tree the represents the actual
     *   syntactical elements in the file. This can be converted to
     *   an abstract syntax tree afterwards, which would be more useful
     *   for checking for problems.
     * <li>resources - array of instances of Resource classes as
     *   defined in {@link https://github.com/ilib-js/ilib-tools-common}.
     *   This is the preference intermediate representation for
     *   resource files like Java properties or xliff. There are many
     *   rules that already know how to process Resource instances.
     * </ul>
     *
     * @abstract
     * @returns {IntermediateRepresentation<T>[]} the intermediate representation
     */
    parse() {
        throw new NotImplementedError();
    }

    /** type of intermediate representation that this parser
     * produces. The type should be a unique name that matches with
     * the rule type for rules that process this intermediate representation
     *
     * There are three types that are reserved, however:<p>
     *
     * - `resource` - the parser returns an array of Resource instances as
     *   defined in {@link https://github.com/ilib-js/ilib-tools-common}.
     * - `line` - the parser produces a set of lines as an array of strings
     * - `string` - the parser doesn't parse. Instead, it just treats the
     *   the file as one long string.
     *
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass should define this property
    type;

    /**
     * Return the type of intermediate representation that this parser
     * produces. The type should be a unique name that matches with
     * the rule type for rules that process this intermediate representation.
     *
     * @see {@link Parser.type}
     *
     * @abstract
     * @returns {String} the name of the current type of intermediate
     * representation.
     */
    getType() {
        return this.type;
    }

    /**
     * Write out the intermediate representation back into the file.
     *
     * Override this method and {@link Parser.canWrite} if You want to
     * allow `Rule`s to auto-fix errors.
     *
     * After obtaining the representation from {@link Parser.parse},
     * Rules are able to apply fixes by modifying the `ir` object.
     * Subsequently, in order to commit these fixes to the actual file
     * `Parser` needs to write out the transformed `IntermediateRepresentation`
     * instance back to a file from which it was originally parsed
     * (overwriting it in process).
     *
     * Ideally, when provided with an unchanged `ir`, this method
     * should produce an unchanged file (or an equivalent of it).
     *
     * @param {IntermediateRepresentation<T>} ir Modified representation to write out
     * @return {void}
     */
    write(ir) {
        throw new NotImplementedError();
    }

    /**
     * Defines whether this parser is able to write out
     * an intermediate representation back to the file.
     *
     * Override this flag as `true` and implement {@link Parser.write}
     * to allow `Rule`s to auto-fix errors.
     *
     * @readonly
     * @type {boolean}
     */
    canWrite = false;
}

export default Parser;
