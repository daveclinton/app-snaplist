import { View } from 'react-native';

type RowProps = {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const Row = ({ children, spacing = 'md', className = '' }: RowProps) => {
  const spacingStyles = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <View className={`flex-row items-center ${spacingStyles[spacing]} ${className}`}>
      {children}
    </View>
  );
};
