import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const CameraSvg = ({ color = '#0C1A30', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.5 4H9.5L7 7H4c-.53 0-1.04.21-1.41.59C2.21 7.96 2 8.47 2 9v9c0 .53.21 1.04.59 1.41.37.38.88.59 1.41.59h16c.53 0 1.04-.21 1.41-.59.38-.37.59-.88.59-1.41V9c0-.53-.21-1.04-.59-1.41-.37-.38-.88-.59-1.41-.59h-3l-2.5-3z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 16c1.657 0 3-1.343 3-3 0-1.657-1.343-3-3-3-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
