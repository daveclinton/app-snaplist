import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const CaretDown = ({ ...props }: SvgProps) => (
  <Svg
    width={14}
    height={14}
    fill="#000"
    {...props}
    className="stroke-black dark:stroke-white"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 4.744 6 8.494l-3.75-3.75"
    />
  </Svg>
);
