import { View } from 'react-native';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

export const Section = ({ children, className = '' }: SectionProps) => {
  return <View className={`mb-6 ${className}`}>{children}</View>;
};
