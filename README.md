# Translate Highlighted Text (vscode-translator)

Simple extension to translate text selected/highlighted in VSCode using `gpt-4o-mini`.

Will split names from code selections by case and translate the resulting phrase: `isFeatureEnabled` => `is feature enabled`.

## Usage

- highlight/select code/text
- `ctrl+shift+p` -> `Translate Selected Text`
- a notification will appear in the bottom right with the translated text

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
