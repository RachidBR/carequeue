import { TextStyle } from 'react-native';
import { Colors } from './colors';
import { Spacing } from './dimensions';

export const FontFamily = {
    ARIAL: 'Arial',
    SYSTEM: 'System',
} as const;

export const FontSize = {
    SMALL: 12,
    MEDIUM: 14,
    LARGE: 16,
    EXTRA_LARGE: 20,
} as const;

export const FontWeight = {
    LIGHT: '300',
    REGULAR: '400',
    MEDIUM: '500',
    SEMI_BOLD: '600',
    BOLD: '700',
} as const;

type TextPreset = TextStyle;

export const TextPresets: Record<string, TextPreset> = {
    H1: {
        fontFamily: FontFamily.ARIAL,
        fontSize: FontSize.EXTRA_LARGE,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    H2: {
        fontFamily: FontFamily.ARIAL,
        fontSize: FontSize.LARGE,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    Body: {
        fontFamily: FontFamily.SYSTEM,
        fontSize: FontSize.MEDIUM,
        color: Colors.text,
    },
    Caption: {
        fontFamily: FontFamily.SYSTEM,
        fontSize: FontSize.SMALL,
        color: Colors.textMuted,
    },
    Label: {
        fontFamily: FontFamily.SYSTEM,
        fontSize: FontSize.MEDIUM,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
};
