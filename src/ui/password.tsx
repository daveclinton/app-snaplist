import { Eye, EyeOff } from 'lucide-react-native';
import React from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { Pressable } from 'react-native';

import { Input, type NInputProps, type RuleType } from '@/ui';
import { View } from '@/ui';

interface PasswordInputProps<T extends FieldValues>
  extends Omit<NInputProps, 'secureTextEntry'> {
  name: Path<T>;
  control: Control<T>;
  rules?: RuleType<T>;
}

export function ControlledPasswordInput<T extends FieldValues>({
  name,
  control,
  rules,
  testID,
  ...inputProps
}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);

  const { field, fieldState } = useController({ control, name, rules });

  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <View className="relative mb-4">
      <Input
        testID={testID}
        ref={field.ref}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        secureTextEntry={!showPassword}
        onChangeText={field.onChange}
        value={(field.value as string) || ''}
        {...inputProps}
        error={fieldState.error?.message}
      />
      <Pressable
        testID={testID ? `${testID}-toggle` : undefined}
        onPress={togglePasswordVisibility}
        className="absolute inset-y-0 right-4 flex items-center justify-center"
        style={{
          // Adjust based on whether there's a label or error message
          marginTop: inputProps.label ? 28 : 0,
          marginBottom: fieldState.error?.message ? 20 : 0,
        }}
      >
        {showPassword ? (
          <EyeOff
            className="size-5 text-neutral-500 dark:text-neutral-400"
            aria-label="Hide password"
          />
        ) : (
          <Eye
            className="size-5 text-neutral-500 dark:text-neutral-400"
            aria-label="Show password"
          />
        )}
      </Pressable>
    </View>
  );
}
