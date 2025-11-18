import React, {useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

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
  container: {flex: 1, padding: 16, backgroundColor: 'white'},
  sectionTitle: {fontSize: 16, fontWeight: '600', marginBottom: 4},
  sectionSubtitle: {fontSize: 13, color: '#6b7280', marginBottom: 16},
  list: {marginTop: 8},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  rowActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  rowLabel: {fontSize: 14},
  check: {fontSize: 16, color: '#2563eb', fontWeight: '700'},
});

export default SettingsScreen;
