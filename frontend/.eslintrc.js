module.exports = {
	"globals": {
		"moment": false,
		"sap": false,
		"require": false,
		"google": false
	},
	"env": {
		"browser": true,
		"es6": true,
		"jquery": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 2017
	},
	"rules": {
		"no-var": [
			"error"
		],
		"indent": [
			1,
			"tab"
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		],
		"camelCase": {
			"properties": "always"
		}
	}
};