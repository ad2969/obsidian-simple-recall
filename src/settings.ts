interface FilePath {
	path: string;
	basename: string;
}

export const SORT_ORDER_SETTINGS_OPTIONS = [
    {
        key: 'NEW_TO_OLD',
        desc: 'Sort by date from newer to older',
    },
    {
        key: 'OLD_TO_NEW',
        desc: 'Sort by date from older to newer',
    },
]

export interface PluginSettings {
	// doWatchVaultChange: boolean;
	daysToTrack: number;
	excludedPaths: string[];
	recentFiles: FilePath[];
	doLimitNumberOfFiles: boolean;
	maximumNumberOfFiles: number;
    sortOrder: string;
	doReloadOnFileChange: boolean;
	enableAddToAnki: boolean;
	ankiConnectPort: number;
	ankiDestinationDeck: string;
	openAiApiKey: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	// doWatchVaultChange: true,
	daysToTrack: 7,
	excludedPaths: [],
	recentFiles: [],
	doLimitNumberOfFiles: false,
	maximumNumberOfFiles: 10,
    sortOrder: SORT_ORDER_SETTINGS_OPTIONS[0].key,
	doReloadOnFileChange: false,
	enableAddToAnki: false,
	ankiConnectPort: 8765,
	ankiDestinationDeck: '',
	openAiApiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
}
