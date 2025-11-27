import React, {useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {Colors, Spacing, Radius, TextPresets, FontWeight} from '../theme';

const languageOptions = [
  {code: 'fr', key: 'settings.languages.fr'},
  {code: 'en', key: 'settings.languages.en'},
  {code: 'de', key: 'settings.languages.de'},
];

const SettingsScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('settings.title'),
    });
  }, [navigation, t]);

  const current = i18n.language;

  const handleChangeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('settings.languageTitle')}</Text>
      <Text style={styles.sectionSubtitle}>
        {t('settings.languageDescription')}
      </Text>

      <View style={styles.list}>
        {languageOptions.map(option => {
          const isActive = current.startsWith(option.code);
          return (
            <TouchableOpacity
              key={option.code}
              style={[styles.row, isActive && styles.rowActive]}
              onPress={() => handleChangeLanguage(option.code)}>
              <Text style={styles.rowLabel}>{t(option.key)}</Text>
              {isActive && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  sectionTitle: {
    ...TextPresets.H2,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...TextPresets.Body,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  list: {
    marginTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
  },
  rowActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  rowLabel: {
    ...TextPresets.Body,
  },
  check: {
    ...TextPresets.Body,
    color: Colors.primary,
    fontWeight: FontWeight.BOLD,
  },
});

export default SettingsScreen;
