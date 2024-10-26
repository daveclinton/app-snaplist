import { View } from 'react-native';

type ColumnProps = {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const Column = ({ children, spacing = 'md', className = '' }: ColumnProps) => {
  const spacingStyles = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return <View className={`flex-col ${spacingStyles[spacing]} ${className}`}>{children}</View>;
};
