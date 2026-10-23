import { Image } from 'expo-image';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { AuthColors } from './tokens';

type AuthFieldProps = {
  label: string;
  icon: number;
  helper?: string;
  style?: TextInputProps['style'];
} & Omit<TextInputProps, 'style'>;

export function AuthField({ label, icon, helper, ...inputProps }: AuthFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <TextInput
          placeholderTextColor={AuthColors.textMuted}
          {...inputProps}
          style={styles.input}
        />
        <Image source={icon} style={styles.icon} contentFit="contain" />
      </View>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: AuthColors.textMuted,
  },
  box: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    backgroundColor: AuthColors.surface,
    borderWidth: 1,
    borderColor: AuthColors.border,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 15,
    color: AuthColors.text,
  },
  icon: {
    width: 19,
    height: 19,
  },
  helper: {
    fontSize: 11,
    lineHeight: 16,
    color: AuthColors.textMuted,
  },
});
