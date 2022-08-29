# Simple Recall Plugin for OBsidian

After using [Obsidian.md](https://obsidian.md/) as my main notetaking application for [personal knowledge management](https://en.wikipedia.org/wiki/Personal_knowledge_management), I've developed a habit of taking LOTS of notes daily, whether this be:
- Creating new notes
- Updating old notes
- Linking existing notes with each other

While my use of Obsidian.md has been extremely useful for inboxing and keeping all my thoughts in one place, one thing I struggled with was with remembering the many notes I take. Because I use notetaking as a supplement to my personal learning, I needed a way to track the notes I make in a day/week/month in order to [strengthen recall](https://psycnet.apa.org/record/1974-11941-001). 

This plugin provides basic functionality that is similar to a changelog - keeping track of notes that were modified within a given time.

### Plugin Information

The plugin has not been submitted to https://github.com/obsidianmd/obsidian-releases

## How to use

- Clone this repo.
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

### Scripts
- `npm version patch`, `npm version minor`, `npm version major` - updates the plugin version based on the `minAppVersion` in the `manifest.json` file. The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`.

- `eslint .\src\` - runs eslint on the source code to create a report with suggestions for code improvement

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

### Obsidian.md API Documentation

See https://github.com/obsidianmd/obsidian-api
