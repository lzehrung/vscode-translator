# vscode-translator README

Translate text selections using GPT-4o (bring your own API key).

## Features

- highlight text -> translate
- detects case (ie. camelCase) and splits by word

## Settings

```json
"translateText.apiKey": {
  "type": "string",
  "default": "",
  "description": "An OpenAI API key."
},
"translateText.outputLanguage": {
  "type": "string",
  "default": "",
  "description": "Translate to this language."
}
```

## Development

- clone this repository
- `npm install`

then:

- `npm run compile`
- `F5` to open a new window with your extension loaded

or:

- `npm run package`
- install the generated .vsix file
