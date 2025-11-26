import React, {useLayoutEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {Colors, Spacing, Radius, TextPresets} from '../theme';

const ProfileScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('profile.title'),
    });
  }, [navigation, t]);

  // Later you can replace this with real user data from Redux / backend
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Image
            // placeholder avatar
            source={{
              uri: 'https://ui-avatars.com/api/?name=JD&background=0D8ABC&color=fff',
            }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.accountSection')}</Text>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>{t('profile.editProfile')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>{t('profile.changeLanguage')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.otherSection')}</Text>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>{t('profile.aboutApp')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.row, styles.logoutRow]}>
          <Text style={styles.logoutLabel}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    // shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.border,
  },
  headerText: {
    flex: 1,
  },
  name: {
    ...TextPresets.h2,
    marginBottom: Spacing.xs,
  },
  email: {
    ...TextPresets.body,
    color: Colors.muted,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextPresets.caption,
    textTransform: 'uppercase',
    color: Colors.muted,
    marginBottom: Spacing.s,
  },
  row: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },
  rowLabel: {
    ...TextPresets.body,
  },
  logoutRow: {
    marginTop: Spacing.s,
    backgroundColor: Colors.errorSoft,
  },
  logoutLabel: {
    ...TextPresets.body,
    color: Colors.error,
    fontWeight: '600',
  },
});

export default ProfileScreen;
