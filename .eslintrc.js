module.exports = {
	extends: "airbnb-base",
	env: { "node": true },
	"parserOptions": {
		"ecmaVersion": 2018
	},
	rules: {
		"no-console": "off",
		"no-tabs": "off",
		"no-shadow": "error",
		"no-unused-expressions": "error",
		"guard-for-in": "warn",
		"key-spacing": ["warn", { "beforeColon": false, "afterColon": true }],
		"no-lonely-if": "warn",
		"indent": ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		"no-multi-spaces": "warn",
		"semi-spacing": ["warn", { "before": false, "after": true }],
		"space-infix-ops": "warn",
		"no-unused-vars": ["error", { "args": "none" }],
		"comma-dangle": ["error", "always-multiline"],
		"object-curly-newline": ["error", { "multiline": true }],
		"no-multiple-empty-lines": "error",
	}
};
