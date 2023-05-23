/*
 * Fixer.js
 *
 * Copyright © 2022 JEDLSoft
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
import Fix from "./Fix.js";

/**
 * Class that applies fixes produced by rules onto the intermediate representation
 * @abstract
 * @template {IntermediateRepresentation} IR Representation which should be modified
 */
export class Fixer {
    /**
     * Modify the Intermediate Representation instance by applying provided fixes.
     * Fix can be anything as long as the Fixer knows how to apply it onto the IR,
     * as described in {@link Fix}.
     * 
     * Fixer should know to avoid applying conflicting fixes
     * (i.e. those that would modify the same part of the underlying representation)
     * or to offset subsequent fixes after applying one of them.
     * 
     * Example scenario:
     * 
     * Take an IntermediateRepresentation with type `string`
     * which stores content of a file verbatim:
     * ```text
     * birds are not real birds are not real birds are not real
     * ```
     * and a Rule (type `string`) which ensures that the word `birds`
     * should always be surrounded by quotes.
     * 
     * The following fixes have been produced:
     * 1. insert `"` at 0 and 5
     * 2. insert `"` at 19 and 24
     * 3. insert `"` at 38 and 43
     * 
     * Expected fixed string is:
     * ```text
     * "birds" are not real "birds" are not real "birds" are not real
     * ```
     * Which contains quotes at 0, 6, 21, 27, 42, 48. In this scenario, fixer needs to know
     * that after every time it inserted some string into the IR, it needs to offset indices
     * of the remaining insertion points appropriately.
     * 
     * Take another Rule which ensures that the file should always begin with an exclamation mark.
     * It would produce the following fix:
     * 1. insert `!` at 0
     * 
     * This fix overlaps with fix from the other rule (insert `"` at 0 and 5) because the fixer
     * can't tell which symbol goes first (`"!birds"` or `!"birds"`). One of those fixes
     * needs to be skipped.
     * 
     * @abstract
     *
     * @param {IR} ir Intermediate Representaion instance which will be modified by the fixer
     * when the fixes are applied
     * @param {Fix[]} fixes Array of fixes which Fixer should attempt to apply
     * @returns {void}
     */
    applyFixes(ir, fixes) {
        throw new NotImplementedError();
    }
    
    /**
     * Unique identifier which allows to dynamically match 
     * the Fixer to its corresponding IntermediateRepresentation
     * onto which it should apply the supplied Fixes.
     * 
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass should define this property
    type;

    /**
     * @param {any} [options] Placeholder for options that should be provided upon the Fixer subclass instantiation
     */
    constructor(options = undefined) {}
}

export default Fixer;