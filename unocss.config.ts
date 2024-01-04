import type { Preset, Rule } from 'unocss';
import presetWeapp from 'unocss-preset-weapp';
import {
  defaultAttributes,
  extractorAttributify,
  transformerClass
} from 'unocss-preset-weapp/transformer';
import { presetAttributify, presetIcons, presetUno } from 'unocss';

import presetRemToRpx from './preset-rem-to-rpx';
const { presetWeappAttributify, transformerAttributify } = extractorAttributify(
  {
    attributes: [...defaultAttributes, 'b']
  }
);

const sizeMapping: Record<string, string> = {
  fs: 'font-size'
};

function getSizeRules(Mapping: Record<string, string>): Rule<{}>[] {
  return Object.keys(Mapping).map((key) => {
    const value = Mapping[key];
    return [new RegExp(`^${key}-(\\d+)$`), ([, d]) => ({ [value]: `${d}rpx` })];
  });
}

export default {
  presets: [
    presetWeapp(),
    presetWeappAttributify(),
    presetAttributify(),
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true
    }),
    presetRemToRpx({
      baseFontSize: 4
    }) as Preset
  ],
  theme: {
    preflightRoot: ['page,::before,::after']
  },
  rules: getSizeRules(sizeMapping),
  shortcuts: [
    // 动态颜色
    [
      /^s-btn-(.*)$/,
      ([, c]) =>
        `bg-${c}-400 text-${c}-100  py-2 px-4  font-semibold rounded-lg shadow-md  border-none  cursor-pointer text-center`
    ],

    // flex样式布局
    [
      /^f-((c|s|e)(-(c|s|e|b|a))*)$/,
      ([, , g1, , g2]) => {
        let style = ``;
        const temps = [
          { k: 'c', v: 'center' },
          { k: 's', v: 'start' },
          { k: 'e', v: 'end' },
          { k: 'b', v: 'between' },
          { k: 'a', v: 'around' }
        ];

        const r1 = temps.find((i) => i.k === g1);
        style = `flex items-${r1?.v || 'center'} content-${r1?.v || 'center'}`;

        if (g2) {
          const r2 = temps.find((i) => i.k === g2);
          style += ` justify-${r2?.v || 'center'}`;
        }

        return style;
      }
    ]
  ],
  transformers: [
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass()
  ]
};
