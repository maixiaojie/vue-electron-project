const path = window.require('path');

const Conf = window.require('conf');

const electron = window.require('electron');

class ElectronStore extends Conf {
	constructor(options) {
		const defaultCwd = (electron.app || electron.remote.app).getPath('userData');
        console.log(defaultCwd)
		options = {
			name: 'config',
			...options
		};

		if (options.cwd) {
			options.cwd = path.isAbsolute(options.cwd) ? options.cwd : path.join(defaultCwd, options.cwd);
		} else {
			options.cwd = defaultCwd;
		}

		options.configName = options.name;
		delete options.name;
		super(options);
	}

	openInEditor() {
		// TODO: Remove `electron.shell.openItem` when targeting Electron 9.`
		const open = electron.shell.openItem || electron.shell.openPath;
		open(this.path);
	}
}

export default ElectronStore;
