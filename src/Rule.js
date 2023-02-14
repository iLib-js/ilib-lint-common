/*
 * Rule.js - Represent an ilib-lint rule
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

/**
 * @class Represent an ilib-lint rule.
 * @abstract
 */
class Rule {
    /**
     * Construct an ilib-lint rule. Rules in plugins should implement this
     * abstract class.
     *
     * @param {Object|undefined} options options for this instance of the
     * rule from the config file, if any
     */
    constructor(options) {
        if (this.constructor === Rule) {
            throw new Error("Cannot instantiate abstract class Rule directly!");
        }
        if (!options) return;
        this.sourceLocale = options.sourceLocale;
    }

    /**
     * Get the name of the rule. This should be a string with a dash-separated
     * set of words (kebab or dash case). Example: "resource-match-whitespace"
     *
     * @returns {String} the name of this rule
     */
    getName() {
        // make sure to define this.name in your implementation
        return this.name;
    }

    /**
     * Return a general description of the type of problems that this rule is
     * testing for. This description is not related to particular matches, so
     * it cannot be more specific. Examples:
     *
     * "translation should use the appropriate quote style"
     * "parameters to the translation wrapper function must not be concatenated"
     * "translation should match the whitespace of the source string"
     *
     * @returns {String} a general description of the type of problems that this rule is
     * testing for
     */
    getDescription() {
        return this.description;
    }

    /**
     * Return the optional web link that gives more complete explanation about the Rule
     * and how to resolve the problem.
     *
     * @returns {String} an URL to a web page that explains the problem this rule checks for
     */
    getLink() {
        return this.link;
    }

    /**
     * Return the type of intermediate representation that this rule can process. Rules can
     * be any type as long as there is a parser that produces that type. By convention,
     * there are two types that there are many parsers for already:
     *
     * - resource - This checks a translated Resource instances with a source string
     *   and a translation to a given locale. For example, a rule that checks that
     *   substitution parameters that exist in the source string also are
     *   given in the target string.
     * - line - This rule checks single lines of a file. eg. a rule to
     *   check the parameters to a function call.
     *
     * Typically, a full parser for a programming language will return something like
     * an abstract syntax tree as an intermediate format. However, the parser can return
     * anything it likes just as long as there are rules that know how to check it.
     *
     * @returns {String} a string that names the type of intermediate representation
     * that this rule knows how to check
     */
    getRuleType() {
        // default rule type. If your rule is different, override this method.
        return "line";
    }

    /**
     * Get the source locale for this rule.
     *
     * @returns {String} the source locale for this rule
     */
    getSourceLocale() {
        return this.sourceLocale || "en-US";
    }

    /**
     * Return whether or not this rule matches the input. The options object can
     * contain any of the following properties:
     *
     * <ul>
     * <li>locale - the locale against which this rule should be checked. Some rules
     * are locale-sensitive, others not.
     * <li>resource - the resource to test this rule against. For resource rules, this
     * is a required property.
     * <li>line - a single line of a file to test this rule against (for line rules)
     * <li>ir - intermediate representation from the parser. The parser type and the
     * rule type must be the same.
     * <li>pathName - the name of the current file being matched in multifile rules.
     * <li>parameters - (optional) parameters for this rule from the configuration file
     * </ul>
     *
     * The return value from this method when a rule matches is an instance of a {@see Result}
     * class.
     *
     * @abstract
     * @param {Object} options The options object as per the description above
     * @returns {Result|Array.<Result>|=} a Result instance describing the problem if
     * the rule check fails for this locale, or an array of such Result instances if
     * there are multiple problems with the same input, or `undefined` if there is no
     * problem found (ie. the rule does not match).
     */
    match(options) {
        throw new Error("Cannot call Rule.match() directly.");
    }
}

export default Rule;