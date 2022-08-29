import {
    ItemView,
    TFile,
    WorkspaceLeaf,
} from 'obsidian';

import {
    PluginSettings,
} from "./settings";

export const SIMPLE_RECALL_ICON = "clock"
export const SIMPLE_RECALL_TITLE = "Simple Recall"
export const SIMPLE_RECALL_VIEW_TYPE = "SIMPLE_RECALL"

interface FileGroups {
    [name: string]: {
        dateString: string;
        files: TFile[]
    };
}

export class SimpleRecallView extends ItemView {
    listContainer: HTMLElement;
    settings: PluginSettings;

    constructor(leaf: WorkspaceLeaf, settings: PluginSettings) {
        super(leaf);
        this.settings = settings;
    }

    getViewType(): string {
        return SIMPLE_RECALL_VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Simple Recall"
    }

    getIcon(): string {
        return SIMPLE_RECALL_ICON
    }

    onOpen(): Promise<void> {
		const { containerEl } = this;
		
		containerEl.empty();
        containerEl.addClasses(['padded-container', 'y-scroll']);
		containerEl.createEl('h4', { text: 'Simple Recall' }).addClass('mt-0');

        this.listContainer = containerEl.createDiv();

        this.renderRecallList();
        return Promise.resolve();
    }

    renderRecallList(): void {
        if (this.listContainer) this.listContainer.empty();
        
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - this.settings.daysToTrack);

        // get files
        const files = this.app.vault.getMarkdownFiles();
        let recentlyEditedFiles = files
            .filter((file) => file.stat.mtime >= startDate.getTime());

        // sort files
        recentlyEditedFiles.sort((a, b) => (a.stat.mtime < b.stat.mtime ? 1 : -1));

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
            this.listContainer.createEl('hr', { cls: 'small-divider' });
        });
    }

    onClose(): Promise<void> {
        return Promise.resolve()
    }
}