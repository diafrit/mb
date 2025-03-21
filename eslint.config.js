import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...pluginVue.configs['flat/essential'],
	{
		ignores: ['node_modules', 'dist', 'public', '.nuxt'],
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-reserved-component-names': 'off',
			'vue/block-order': [
				'error',
				{
					order: ['template', 'script', 'style']
				}
			]
		}
	},
	eslintConfigPrettier
]
