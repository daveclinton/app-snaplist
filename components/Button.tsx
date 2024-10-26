import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';

const buttonVariants = cva(
  'items-center justify-center rounded-[28px] shadow-md p-4 flex-row space-x-2',
  {
    variants: {
      variant: {
        default: 'bg-indigo-500 active:bg-indigo-600',
        destructive: 'bg-red-500 active:bg-red-600',
        outline: 'bg-white border-2 border-gray-200 active:bg-gray-50',
        secondary: 'bg-gray-200 active:bg-gray-300',
        ghost: 'bg-transparent shadow-none active:bg-gray-100',
      },
      size: {
        default: 'p-4',
        sm: 'p-2',
        lg: 'p-6',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

const buttonTextVariants = cva('font-semibold text-center', {
  variants: {
    variant: {
      default: 'text-white',
      destructive: 'text-white',
      outline: 'text-gray-900',
      secondary: 'text-gray-900',
      ghost: 'text-gray-900',
    },
    size: {
      default: 'text-lg',
      sm: 'text-base',
      lg: 'text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ButtonProps = {
  title: string;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & VariantProps<typeof buttonVariants> &
  TouchableOpacityProps;

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      title,
      isLoading = false,
      loadingText,
      variant = 'default',
      size = 'default',
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...touchableProps
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        disabled={isDisabled}
        className={`
          ${buttonVariants({ variant, size, fullWidth })}
          ${isDisabled ? 'opacity-50' : 'opacity-100'}
          ${className || ''}
        `}>
        {isLoading ? (
          <View className="flex-row items-center space-x-2">
            <ActivityIndicator
              color={variant === 'outline' || variant === 'ghost' ? '#1F2937' : 'white'}
              size={size === 'sm' ? 'small' : 'large'}
            />
            {loadingText && (
              <Text
                className={`
                  ${buttonTextVariants({ variant, size })}
                  ${isDisabled ? 'opacity-50' : 'opacity-100'}
                `}>
                {loadingText}
              </Text>
            )}
          </View>
        ) : (
          <View className="flex-row items-center space-x-2">
            {leftIcon && <View>{leftIcon}</View>}
            <Text
              className={`
                ${buttonTextVariants({ variant, size })}
                ${isDisabled ? 'opacity-50' : 'opacity-100'}
              `}>
              {title}
            </Text>
            {rightIcon && <View>{rightIcon}</View>}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
