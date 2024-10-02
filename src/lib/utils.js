/**
 * Formats a given date using the specified date style and locale.
 * @param {Date} date - The date to format.
 * @param {string} [dateStyle='medium'] - The style of the date. Defaults to 'medium'.
 * @param {string} [locales='en'] - The locale to use for formatting. Defaults to 'en'.
 * @returns {string} The formatted date.
 */
export function formatDate(date, dateStyle = 'medium', timeStyle = 'short', locales = 'fr') {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}
	// Safari is mad about dashes in the date
	const dateFormatter = new Intl.DateTimeFormat(locales, {
		dateStyle,
		timeStyle,
		timezone: 'UTC'
	});
	return dateFormatter.format(date);
}
/**
 * Creates an accordion effect on the specified node.
 * @param {HTMLElement} node - The HTML element to apply the accordion effect to.
 * @param {boolean} isOpen - Specifies whether the accordion is initially open or closed.
 * @returns {Object} - An object with an `update` method to control the accordion state.
 */
export function accordion(node, isOpen) {
	node.style.overflow = 'hidden';
	node.style.height = isOpen ? 'auto' : '0';
	node.classList.add('accordion');
	return {
		update(isOpen) {
			let animation = node.animate(
				[
					{
						height: node.scrollHeight + 'px'
					},
					{
						height: 0
					}
				],
				{ duration: Math.max(node.scrollHeight, 150), fill: 'both' }
			);
			animation.pause();
			if (!isOpen) {
				animation.play();
			} else {
				animation.reverse();
			}
			// Used for nested accordions
			animation.onfinish = () => {
				animation.cancel();
				node.style.height = isOpen ? 'auto' : '0';
			};
		}
	};
}

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Appends strings of classes. If non-truthy values are passed, they are ignored.
 * Uses tailwind-merge to merge tailwind classes.
 */
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

/**
 * Generates formatted text by highlighting specific parts of a word based on the provided options.
 *
 * @param {string} word - The word to be formatted.
 * @param {Object} [options={}] - The formatting options.
 * @param {Array<string>} [options.sep=['<b>', '</b>']] - The separators used to highlight the text.
 * @param {number} [options.fixationPoint=5] - The fixation point used to determine the length of the highlighted text.
 * @param {boolean} [options.ignoreHtmlTag=true] - Specifies whether to ignore HTML tags when formatting the text.
 * @returns {string} The formatted text.
 */
export function generateFormattedText(word, options = {}) {
	const DEFAULT_SEP = ['<b class="bionic-reading">', '</b>'];
	const FIXATION_BOUNDARY_LIST = [
		[0, 4, 12, 17, 24, 29, 35, 42, 48],
		[1, 2, 7, 10, 13, 14, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49],
		[1, 2, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49],
		[
			0, 2, 4, 5, 6, 8, 9, 11, 14, 15, 17, 18, 20, 0, 21, 23, 24, 26, 27, 29, 30, 32, 33, 35, 36,
			38, 39, 41, 42, 44, 45, 47, 48
		],
		[
			0, 2, 3, 5, 6, 7, 8, 10, 11, 12, 14, 15, 17, 19, 20, 21, 23, 24, 25, 26, 28, 29, 30, 32, 33,
			34, 35, 37, 38, 39, 41, 42, 43, 44, 46, 47, 48
		]
	];

	// Utility functions
	const isEmpty = (value) => value == null || value === '';
	const omitBy = (obj, filter) =>
		Object.keys(obj).reduce((result, key) => {
			if (!filter(obj[key])) result[key] = obj[key];
			return result;
		}, {});
	const defaults = (obj, defaultValues) => ({ ...defaultValues, ...omitBy(obj, isEmpty) });

	// Get fixation length based on word length and fixation point
	const getFixationLength = (word, fixationPoint) => {
		const wordLength = word.length;
		const fixationBoundary = FIXATION_BOUNDARY_LIST[fixationPoint - 1] || FIXATION_BOUNDARY_LIST[0];
		const fixationLengthFromLast = fixationBoundary.findIndex((boundary) => wordLength <= boundary);
		let fixationLength = wordLength - fixationLengthFromLast;
		if (fixationLengthFromLast === -1) fixationLength = wordLength - fixationBoundary.length;
		return Math.max(fixationLength, 0);
	};

	// Highlight text with the given separators
	const getHighlightedText = (word, sep) =>
		typeof sep === 'string' ? `${sep}${word}${sep}` : `${sep[0]}${word}${sep[1]}`;

	// Regex and HTML tag processing
	const HTML_TAG_REGEX = /(<!--[\s\S]*?-->)|(<[^>]*>)/g;

	const useCheckIsHtmlTag = (text) => {
		const htmlTagMatchList = text.matchAll(HTML_TAG_REGEX);
		const htmlTagRangeList = Array.from(htmlTagMatchList)
			.map((match) => [match.index, match.index + match[0].length - 1])
			.reverse();
		return (match) => {
			const startIndex = match.index;
			const tagRange = htmlTagRangeList.find(([rangeStart]) => startIndex > rangeStart);
			return tagRange && startIndex < tagRange[1];
		};
	};

	const CONVERTIBLE_REGEX = /(\p{L}|\p{Nd})*\p{L}(\p{L}|\p{Nd})*/gu;

	if (!word || !word.length) return '';
	const { fixationPoint, sep, ignoreHtmlTag } = defaults(options, {
		sep: DEFAULT_SEP,
		fixationPoint: 5,
		ignoreHtmlTag: true
	});

	const convertibleMatchList = word.matchAll(CONVERTIBLE_REGEX);
	let result = '';
	let lastMatchedIndex = 0;
	let checkIsHtmlTag = ignoreHtmlTag ? useCheckIsHtmlTag(word) : null;

	for (const match of convertibleMatchList) {
		if (checkIsHtmlTag && checkIsHtmlTag(match)) continue;
		const [matchedWord] = match;
		const startIndex = match.index;
		const endIndex = startIndex + getFixationLength(matchedWord, fixationPoint);
		result += word.slice(lastMatchedIndex, startIndex);
		if (startIndex !== endIndex)
			result += getHighlightedText(word.slice(startIndex, endIndex), sep);
		lastMatchedIndex = endIndex;
	}

	result += word.slice(lastMatchedIndex);
	return result;
}
