interface FilePath {
	path: string;
	basename: string;
}

export interface PluginSettings {
	// doWatchVaultChange: boolean;
	daysToTrack: number;
	excludedPaths: string[];
	recentFiles: FilePath[];
	doLimitNumberOfFiles: boolean;
	maximumNumberOfFiles: number;
    sortFromNewToOld: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	// doWatchVaultChange: true,
	daysToTrack: 7,
	excludedPaths: [],
	recentFiles: [],
	doLimitNumberOfFiles: false,
	maximumNumberOfFiles: 10,
    sortFromNewToOld: true,
}