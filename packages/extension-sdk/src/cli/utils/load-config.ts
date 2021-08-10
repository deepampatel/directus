import path from 'path';
import fse from 'fs-extra';

const CONFIG_FILE_NAMES = ['extension.config.js', 'extension.config.cjs'];

export default async function loadConfig(): Promise<Record<string, any>> {
	for (const fileName of CONFIG_FILE_NAMES) {
		if (await fse.pathExists(fileName)) {
			return require(path.join(process.cwd(), fileName));
		}
	}

	return {};
}
