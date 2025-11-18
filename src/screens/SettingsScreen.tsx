import React, {useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {RootState, AppDispatch} from '@/state/store';
import {setLanguage} from '@/state/settings/settingsSlice';
import i18n, {AppLanguage, SUPPORTED_LANGUAGES} from '@/i18n';

type LanguageItem = {
  code: AppLanguage;
  label: string;
};

const LANG_LABELS: Record<AppLanguage, string> = {
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
};

const SettingsScreen: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const currentLanguage = useSelector<RootState, AppLanguage>(
    state => state.settings.language,
  );

  const languages: LanguageItem[] = SUPPORTED_LANGUAGES.map(code => ({
    code,
    label: LANG_LABELS[code],
  }));

  const handleLanguagePress = useCallback(
    (code: AppLanguage) => {
      dispatch(setLanguage(code));
      i18n.changeLanguage(code);
    },
    [dispatch],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.screenTitle')}</Text>
      <Text style={styles.description}>
        {t('settings.languageDescription')}
      </Text>

      <FlatList
        style={styles.list}
        data={languages}
        keyExtractor={item => item.code}
        renderItem={({item}) => {
          const selected = item.code === currentLanguage;
          return (
            <TouchableOpacity
              style={[styles.row, selected && styles.rowSelected]}
              onPress={() => handleLanguagePress(item.code)}>
              <Text style={styles.languageLabel}>{item.label}</Text>
              <Text style={styles.radio}>{selected ? '●' : '○'}</Text>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: '700', marginBottom: 8},
  description: {fontSize: 14, color: '#555', marginBottom: 16},
  list: {marginTop: 8},
  row: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowSelected: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  languageLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  radio: {
    fontSize: 18,
    color: '#2563EB',
  },
  separator: {height: 8},
});

export default SettingsScreen;
