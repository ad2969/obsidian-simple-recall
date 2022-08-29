import {
    ExtraButtonComponent,
    ItemView,
    TFile,
    WorkspaceLeaf,
} from 'obsidian';

import {
    PluginSettings,
    SORT_ORDER_SETTINGS,
} from "./settings";

export const SIMPLE_RECALL_ICON = "clock";
export const SIMPLE_RECALL_TITLE = "Simple Recall";
export const SIMPLE_RECALL_VIEW_TYPE = "SIMPLE_RECALL";

interface FileGroups {
    [name: string]: {
        dateString: string;
        files: TFile[];
    };
}

export class SimpleRecallView extends ItemView {
    listContainer: HTMLElement;
    settings: PluginSettings;

    sortOrder: string;
    isReverseSort: boolean;
    rSortButton: ExtraButtonComponent;

    constructor(
        leaf: WorkspaceLeaf,
        settings: PluginSettings,
    ) {
        super(leaf);
        this.settings = settings;
        this.sortOrder = settings.sortOrder;
        this.isReverseSort = false;
    }

    getViewType(): string {
        return SIMPLE_RECALL_VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Simple Recall";
    }

    getIcon(): string {
        return SIMPLE_RECALL_ICON;
    }

    toggleSortOrder(): void {
        this.rSortButton.extraSettingsEl.toggleClass('is-active', !this.isReverseSort);
        this.isReverseSort = !this.isReverseSort;
        if (this.sortOrder === SORT_ORDER_SETTINGS[0].key) this.sortOrder = SORT_ORDER_SETTINGS[1].key;
        else this.sortOrder = SORT_ORDER_SETTINGS[0].key;
        this.renderRecallList();
    }

    onOpen(): Promise<void> {
		const { containerEl } = this;
		
		containerEl.empty();
        
        containerEl.addClasses(['view-content']);

        const navContainer = containerEl.createEl('div', { cls: 'nav-header' });
        const navButtonsContainer = navContainer.createEl('div', { cls: 'nav-buttons-container' });

        // NAV HEADER
        // refresh button
        const refreshButton = new ExtraButtonComponent(navButtonsContainer);
        refreshButton.setIcon('reset');
        refreshButton.onClick(() => { this.renderRecallList() });
        refreshButton.extraSettingsEl.addClasses(['nav-action-button', 'icon-button']);
        refreshButton.setTooltip('Refresh recall list');

        // reverse sort button
        this.rSortButton = new ExtraButtonComponent(navButtonsContainer);
        this.rSortButton.setIcon('switch');
        this.rSortButton.onClick(() => { this.toggleSortOrder() });
        this.rSortButton.extraSettingsEl.addClasses(['nav-action-button', 'icon-button']);
        this.rSortButton.setTooltip('Reverse sort order');

        // SCROLL CONTAINER
        const scrollPane = containerEl.createEl('div', { cls: 'scroll-pane horizontal-padding' });
		scrollPane.createEl('h4', { text: SIMPLE_RECALL_TITLE, cls: 'mt-0 mb-0' });
        this.listContainer = scrollPane.createDiv();

        // RENDER
        this.renderRecallList();
        return Promise.resolve();
    }

    renderRecallList(): void {
        // re-render if already exists
        if (this.listContainer) this.listContainer.empty();
        
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - this.settings.daysToTrack);

        // get files
        const files = this.app.vault.getMarkdownFiles();
        let recentlyEditedFiles = files
            .filter((file) => file.stat.mtime >= startDate.getTime());

        // sort files
        recentlyEditedFiles.sort((a, b) => this.sortOrder === SORT_ORDER_SETTINGS[0].key
            ? (a.stat.mtime < b.stat.mtime ? 1 : -1)
            : (a.stat.mtime > b.stat.mtime ? 1 : -1)
        );

        // limit number of files
        if (this.settings.doLimitNumberOfFiles) {
            recentlyEditedFiles = recentlyEditedFiles.slice(0, this.settings.maximumNumberOfFiles);
        }

        // group files
        const fileGroups = recentlyEditedFiles.reduce((groups: FileGroups, file: TFile) => {
            const date = new Date(file.stat.ctime).setHours(0, 0, 0, 0);
            if (!groups[date]) {
                groups[date] = {
                    dateString: new Date(date).toDateString(),
                    files: []
                };
            }
            groups[date].files.push(file);
            return groups;
        }, {});

        Object.values(fileGroups).map((group) => {
            this.listContainer.createEl('hr', { cls: 'vertical-padding' });
            this.listContainer.createEl('b', { text: group.dateString });
            group.files.map((file: TFile) => {
                this.listContainer.createEl('li', { text: file.name, cls: 't--clickable' }).onClickEvent((e) => {
                    // this.app.workspace.activeLeaf.openFile(file);
                    // const newLeaf = this.app.workspace.createLeafBySplit(this.app.workspace.getLeaf());
                    // const newLeaf = this.app.workspace.createLeafInParent(this.app.workspace.splitLeafOrActive(), 0);
                    let newLeaf = this.app.workspace.getLeaf();

                    if (e.ctrlKey || e.metaKey) {
                        newLeaf = this.app.workspace.createLeafBySplit(newLeaf);
                    }
                    newLeaf.openFile(file);
                })
            });
        });
    }

    onClose(): Promise<void> {
        return Promise.resolve();
    }
}