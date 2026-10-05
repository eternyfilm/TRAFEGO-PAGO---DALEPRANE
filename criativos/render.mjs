// Uso: node render.mjs exemplos/exemplo-medio.json [vertical|feed|todos]
// Gera out/<arquivo>-vertical.mp4 e out/<arquivo>-feed.mp4.
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

const [arquivo, formato = 'todos'] = process.argv.slice(2);
if (!arquivo) {
	console.error('Uso: node render.mjs <criativo.json> [vertical|feed|todos]');
	process.exit(1);
}

const props = JSON.parse(readFileSync(arquivo, 'utf8'));
const nome = path.basename(arquivo, '.json');
const ids = {vertical: ['Vertical'], feed: ['Feed'], todos: ['Vertical', 'Feed']}[formato];
if (!ids) {
	console.error(`Formato inválido: ${formato}`);
	process.exit(1);
}

// Na nuvem o Remotion não consegue baixar o navegador dele: usa o do Playwright se existir.
const PLAYWRIGHT = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = process.env.REMOTION_BROWSER ?? (existsSync(PLAYWRIGHT) ? PLAYWRIGHT : null);

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});

for (const id of ids) {
	const composition = await selectComposition({serveUrl, id, inputProps: props, browserExecutable});
	const outputLocation = `out/${nome}-${id.toLowerCase()}.mp4`;
	let ultimo = -1;
	await renderMedia({
		composition,
		serveUrl,
		codec: 'h264',
		crf: 18,
		inputProps: props,
		outputLocation,
		browserExecutable,
		onProgress: ({progress}) => {
			const p = Math.floor(progress * 10);
			if (p !== ultimo) {
				ultimo = p;
				process.stdout.write(`\r${id}: ${p * 10}%`);
			}
		},
	});
	console.log(`\n${outputLocation} (${(composition.durationInFrames / composition.fps).toFixed(1)}s)`);
}
