/*
 * ParseException.js - thrown when encountering an exception while
 * parsing a file
 *
 * Copyright © 2023 JEDLSoft
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

/**
 * @class A class that represents exceptions during parsing
 */
class ParseException extends Error {
    constructor(message, fileName, lineNumber) {
        super(message, fileName, lineNumber);
        this.results = [];
    }

    /**
     * Add a result instance to the list of problems for this file.
     * @param {Result} result the result to add
     */
    addResult(result) {
        if (result) this.results.push(result);
    }

    /**
     * Return the array of result instances that give more information
     * about the current exception.
     * @returns {Array.<Result>} the array of results
     */
    getResults() {
        return this.results;
    }
}

export default ParseException;
