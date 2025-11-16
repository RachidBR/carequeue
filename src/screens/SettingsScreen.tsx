import * as React from 'react';
import {View, Text, Button} from 'react-native';
import i18n from '@/i18n';

export default function SettingsScreen() {
  return (
    <View style={{flex: 1, padding: 16, gap: 12}}>
      <Text style={{fontSize: 22, fontWeight: '700'}}>
        {i18n.t('settings.title')}
      </Text>
      <Text>{i18n.t('settings.language')}</Text>
      <View style={{flexDirection: 'row', gap: 8}}>
        <Button title="FR" onPress={() => i18n.changeLanguage('fr')} />
        <Button title="DE" onPress={() => i18n.changeLanguage('de')} />
        <Button title="EN" onPress={() => i18n.changeLanguage('en')} />
      </View>
    </View>
  );
}
