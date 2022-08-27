import {
	App,
	ButtonComponent,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting
} from 'obsidian';

interface FilePath {
	path: string;
	basename: string;
}
interface PluginSettings {
	daysToTrack: number;
	excludedPaths: string[];
	recentFiles: FilePath[];
	doLimitNumberOfFiles: boolean;
	maximumNumberOfFiles: number;
	doWatchVaultChange: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
	daysToTrack: 7,
	excludedPaths: [],
	recentFiles: [],
	doLimitNumberOfFiles: false,
	maximumNumberOfFiles: 10,
	doWatchVaultChange: true,
}

export default class SimpleRecallPlugin extends Plugin {
	settings: PluginSettings;
	
	async onload() {
		await this.loadSettings();
		
		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');
		
		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}
					
		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });
		
		this.addSettingTab(new SimpleRecallSettingTab(this.app, this));
		
		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });
		
		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	// handleVaultChange(file: any) {
	// }

	// registerVaultWatchers() {
	// 	if (this.settings.doWatchVaultChange) {
	// 		this.registerEvent(this.app.vault.on("modify", this.handleVaultChange));
	// 		this.registerEvent(this.app.vault.on("delete", this.handleVaultChange));
	// 	} else {
	// 		this.app.vault.off("modify", this.handleVaultChange);
	// 		this.app.vault.off("delete", this.handleVaultChange);
	// 	}
	// }
	
	onunload() {
		
	}
	
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	
	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class ExcludedPathsSettingModal extends Modal {
// 	plugin: MyPlugin;
// 	pathText: string;
// 	excludedPaths: string[];
	
// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app);
// 		this.plugin = plugin;
// 		this.excludedPaths = plugin.settings.excludedPaths;
// 	}

// 	async onSubmit(newPaths: string[]) {
// 		this.plugin.settings.excludedPaths = newPaths
// 		await this.plugin.saveSettings();
// 	}
	
// 	onOpen(): void {
// 		const { contentEl } = this;
// 		contentEl.createEl("h1", { text: "Paths excluded from recall" });
		
// 		new Setting(contentEl)
// 			.setName("Path")
// 			.addSearch(searchComponent => searchComponent
// 				.setPlaceholder('Enter path or "/regex"..')
// 				.onChange((value) => {
// 					this.pathText = value;
// 				})
// 			)
// 			.addButton(ButtonComponent => ButtonComponent
// 				.setButtonText("Add")
// 				.onClick(() => {
// 					this.excludedPaths.push(this.pathText)
// 				})
// 			);
			
// 		new Setting(contentEl)
// 			.addButton((btn) => btn
// 				.setButtonText("Done")
// 				.setCta()
// 				.onClick(() => {
// 					this.close();
// 					this.onSubmit(this.excludedPaths);
// 				})
// 			);
// 	}
		
// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }
	
	class SimpleRecallSettingTab extends PluginSettingTab {
		plugin: SimpleRecallPlugin;
		
		constructor(app: App, plugin: SimpleRecallPlugin) {
			super(app, plugin);
			this.plugin = plugin;
		}
		
		display(): void {
			const {containerEl} = this;
			
			containerEl.empty();
			
			containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});
			
			new Setting(containerEl)
			.setName('Tracking (days)')
			.setDesc('Number of Days to Track')
			.addSlider(numberComponent => numberComponent
				.setValue(this.plugin.settings.daysToTrack)
				.onChange(async (value) => {
					this.plugin.settings.daysToTrack = value;
					await this.plugin.saveSettings();
				}));
				
			// new Setting(containerEl)
			// 	.setName('Excluded Paths')
			// 	.addButton(buttonComponent => buttonComponent
			// 		.onClick(() => new ExcludedPathsSettingModal(this.app, this.plugin).open()))
		}
	}
			