import {
	App,
	Plugin,
	PluginSettingTab,
	Setting
} from 'obsidian';

import {
	PluginSettings,
	DEFAULT_SETTINGS,
	SORT_ORDER_SETTINGS_OPTIONS,
} from "./settings";

import {
	SIMPLE_RECALL_ICON,
	SIMPLE_RECALL_TITLE,
	SIMPLE_RECALL_VIEW_TYPE,
	SimpleRecallView,
	SimpleRecallViewInterface,
} from "./view";

import { isPositiveInteger } from "./utils/isInteger";

export default class SimpleRecallPlugin extends Plugin {
	settings: PluginSettings;
	leafId: string;
	
	async onload() {
		await this.loadSettings();
		
		const ribbonIconEl = this.addRibbonIcon(
			SIMPLE_RECALL_ICON,
			SIMPLE_RECALL_TITLE,
			(evt: MouseEvent) => { this.activateView() }
		);
		ribbonIconEl.addClass('simple-recall-plugin-ribbon-class');
		
		this.addSettingTab(new SimpleRecallSettingTab(this.app, this));

		this.registerView(
			SIMPLE_RECALL_VIEW_TYPE,
			(leaf) => new SimpleRecallView(
				leaf,
				this.settings,
			)
		);

		this.app.workspace.on("editor-change", () => {
			if (this.settings.doReloadOnFileChange) {
				this.refreshSimpleRecallView();
			}
		})
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(SIMPLE_RECALL_VIEW_TYPE);
	
		const chosenLeaf = await this.app.workspace.getRightLeaf(false);
		await chosenLeaf.setViewState({
			type: SIMPLE_RECALL_VIEW_TYPE,
			active: true,
		});
	
		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(SIMPLE_RECALL_VIEW_TYPE)[0]
		);
	}
	
	onunload() {
		this.app.workspace.detachLeavesOfType(SIMPLE_RECALL_VIEW_TYPE);
	}
	
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	
	async saveSettings() {
		await this.saveData(this.settings);
		this.refreshSimpleRecallView();
	}

	refreshSimpleRecallView() {
		const currViews = this.app.workspace.getLeavesOfType(SIMPLE_RECALL_VIEW_TYPE);
		const currLeaf = currViews.length ? currViews[0].view : false;
		
		if (currLeaf) {
			(currLeaf as SimpleRecallViewInterface).loadSettings(this.settings);
			(currLeaf as SimpleRecallViewInterface).renderRecallList();
		}
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
	maxFilesSetting: Setting;
	
	constructor(app: App, plugin: SimpleRecallPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}
	
	display(): void {
		const { containerEl } = this;
		
		containerEl.empty();
		containerEl.createEl('h2', { text: 'Simple Recall Settings.' });
		
		new Setting(containerEl)
			.setName('Tracking (days)')
			.setDesc('Number of days to track')
			.addText(numberComponent => numberComponent
				.setValue(String(this.plugin.settings.daysToTrack))
				.onChange(async (value) => {
					if (!isPositiveInteger(value)) return;
					this.plugin.settings.daysToTrack = Number(value);
					await this.plugin.saveSettings();
				})
			);
			
		// new Setting(containerEl)
		// 	.setName('Excluded Paths')
		// 	.addButton(buttonComponent => buttonComponent
		// 		.onClick(() => new ExcludedPathsSettingModal(this.app, this.plugin).open())
		// 	);

		new Setting(containerEl)
			.setName('Limit Number of Files?')
			.setDesc('Should the number of files be limited?')
			.addToggle(toggleComponent => toggleComponent
				.setValue(this.plugin.settings.doLimitNumberOfFiles)
				.onChange(async (value) => {
					this.plugin.settings.doLimitNumberOfFiles = value;
					await this.plugin.saveSettings();
					this.display();
				})
			);
		
		this.maxFilesSetting = new Setting(containerEl)
			.setName('Maximum Number of Files')
			.setDesc('Total number of files to limit per recall')
			.setDisabled(!this.plugin.settings.doLimitNumberOfFiles)
			.setClass(this.plugin.settings.doLimitNumberOfFiles ? 'sub-text-1' : 'sub-text-1--disabled')
			.addText(textComponent => textComponent
				.setPlaceholder('Number of files')
				.setValue(String(this.plugin.settings.maximumNumberOfFiles))
				.setDisabled(!this.plugin.settings.doLimitNumberOfFiles)
				.onChange(async (value) => {
					if (!isPositiveInteger(value)) return;
					this.plugin.settings.maximumNumberOfFiles = Number(value);
					await this.plugin.saveSettings();
				})
			);
		
		new Setting(containerEl)
			.setName('Sort Order')
			.setDesc('Determine the order to sort pages')
			.addDropdown(dropdownComponent => dropdownComponent
				.addOption(SORT_ORDER_SETTINGS_OPTIONS[0].key, SORT_ORDER_SETTINGS_OPTIONS[0].desc)
				.addOption(SORT_ORDER_SETTINGS_OPTIONS[1].key, SORT_ORDER_SETTINGS_OPTIONS[1].desc)
				.setValue(this.plugin.settings.sortOrder)
				.onChange(async (value) => {
					this.plugin.settings.sortOrder = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('[WARNING - EXPERIMENTAL] Reload on File Change')
			.setDesc('Automatically reload simple recall list on every file change')
			.addToggle(toggleComponent => toggleComponent
				.setValue(this.plugin.settings.doReloadOnFileChange)
				.onChange(async (value) => {
					this.plugin.settings.doReloadOnFileChange = value;
					await this.plugin.saveSettings();
					this.display();
				})
			);
	}
}
