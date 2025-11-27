import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {RootState} from '@/state/store';
import {updateProfile, logout} from '@/state/user/userSlice';
import {Colors, Spacing, Radius, TextPresets, FontSize, FontWeight} from '../theme';
import {initDB, updateUserDisplayName} from '@/services/db';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    const cleanName = displayName.trim();
    if (!cleanName) return;

    try {
      setSaving(true);
      const db = await initDB();
      await updateUserDisplayName(db, user.email, cleanName);
      dispatch(updateProfile({displayName: cleanName}));
    } catch (e) {
      console.error('[Profile] save error', e);
      Alert.alert('Error', 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.title')}</Text>

      <Text style={styles.label}>{t('profile.emailLabel')}</Text>
      <Text style={styles.value}>{user.email}</Text>

      <Text style={styles.label}>{t('profile.displayNameLabel')}</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {saving ? '...' : t('profile.saveButton')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t('profile.logoutButton')}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    ...TextPresets.H1,
    marginBottom: Spacing.lg,
  },
  label: {
    ...TextPresets.Label,
  },
  value: {
    ...TextPresets.Body,
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    fontSize: FontSize.MEDIUM,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveButtonText: {
    ...TextPresets.Body,
    color: Colors.white,
    fontWeight: FontWeight.SEMI_BOLD,
  },
  logoutButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  logoutText: {
    ...TextPresets.Body,
    color: Colors.textMuted,
  },
});

export default ProfileScreen;
