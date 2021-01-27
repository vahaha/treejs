module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: 'eslint:recommended',
    plugins: ['prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'no-empty': 0,
        'arrow-parens': ['error', 'as-needed'],
        // indent: ["error", "tab", { SwitchCase: 1 }],
        'no-unused-vars': [
            'warn',
            { args: 'after-used', argsIgnorePattern: '^_|err' },
        ],
        'no-case-declarations': 'off',
        'no-async-promise-executor': 'warn',
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'ignore',
            },
        ],
        'no-const-assign': 'error',
        'prefer-const': ['error', { destructuring: 'all' }],
        'no-undef': 'warn',
        'no-redeclare': ['off', { builtinGlobals: true }],
        'linebreak-style': ['error', 'unix'],
        // quotes: ['error', 'double'],
        // semi: ['error', 'always'],
        'no-console': [
            'off',
            {
                allow: ['warn', 'error', 'info', 'debug'],
            },
        ],
        'no-mixed-spaces-and-tabs': 'off',
        'prettier/prettier': ['error'],
    },
}
