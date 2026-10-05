import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fontes dentro do projeto (licença OFL, subset latin cobre acentos do português):
// o render não depende de rede nem do Google Fonts.
// Serifada editorial pro que é emoção (gancho, destaque, CTA). Sans enxuta pro que é informação.
export const SERIF = 'Instrument Serif';
export const SANS = 'Inter Tight';

loadFont({family: SERIF, url: staticFile('fontes/InstrumentSerif-Regular.woff2'), weight: '400', style: 'normal'});
loadFont({family: SERIF, url: staticFile('fontes/InstrumentSerif-Italic.woff2'), weight: '400', style: 'italic'});
loadFont({family: SANS, url: staticFile('fontes/InterTight-Variable.woff2'), weight: '100 900', style: 'normal'});
