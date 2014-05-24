var util = require("util");
var gutil = require("gulp-util");
var map = require("map-stream");

var TEMPLATE = "var htmlTemplates = htmlTemplates || {};htmlTemplates[\'%s\'] = \'%s\';\n";

/**
 * Converts HTML files into JavaScript files and populates them into a
 * variable "htmlTemplates" in the global namespace.
 * This can them be used for example by angular-router as:
 *     template: htmlTemplates['/path/to/file.html']
 * Inspired by (and some portions copied from) Mark Lagendijk's gulp-ng-html2js
 * @param [options] - The plugin options
 * @param [options.stripPrefix] - The prefix which should be stripped from the file path
 * @param [options.prefix] - The prefix which should be added to the start of the url
 * @returns {stream}
 */
module.exports = function(options){
	"use strict";

	function jsifyHtmlTemplates(file, callback){
		if(file.isStream()){
			return callback(new Error("gulp-jsify-html-templates: Streaming not supported"));
		}

		if(file.isBuffer()){
			var filePath = getFileUrl(file, options);
			file.contents = new Buffer(generateModuleDeclaration(filePath, String(file.contents), options));
			file.path = gutil.replaceExtension(file.path, ".js");
		}

		return callback(null, file);
	}

	function generateModuleDeclaration(fileUrl, contents, options){
		var escapedContent = escapeContent(contents);
        return util.format(TEMPLATE, fileUrl, escapedContent);
	}

	/**
	 * Generates the url of a file.
     * Copied from http://github.com/marklagendijk/gulp-ng-html2js
     * @author Mark Lagendijk
	 * @param file - The file for which a url should be generated
	 * @param [options] - The plugin options
	 * @param [options.stripPrefix] - The prefix which should be stripped from the file path
	 * @param [options.prefix] - The prefix which should be added to the start of the url
	 * @param [options.rename] - A function that takes in the generated url and returns the desired manipulation.
	 * @returns {string}
	 */
	function getFileUrl(file, options){
		// Start with the relative file path
		var url = file.relative;

		// Replace '\' with '/' (Windows)
		url = url.replace(/\\/g, "/");

		// Remove the stripPrefix
		if(options && options.stripPrefix && url.indexOf(options.stripPrefix) === 0){
			url = url.replace(options.stripPrefix, "");
		}
		// Add the prefix
		if(options && options.prefix){
			url = options.prefix + url;
		}

		// Rename the url
		if(options && options.rename){
			url = options.rename(url);
		}

		return url;
	}

	/**
	 * Escapes the content of an string so it can be used in a Javascript string declaration
     * Copied from http://github.com/marklagendijk/gulp-ng-html2js
     * @author Mark Lagendijk
	 * @param {string} content
	 * @returns {string}
	 */
	function escapeContent(content){
		return content.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r?\n/g, "\\n' +\n    '");
	}

	return map(jsifyHtmlTemplates);
};
