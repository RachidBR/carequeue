import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {login} from '@/state/user/userSlice';
import {Colors, Spacing, Radius, TextPresets, FontSize, FontWeight} from '../theme';
import {getDB, ensureDefaultUser, validateUserCredentials} from '@/services/db';

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [email, setEmail] = useState('user@mail.com');
  const [password, setPassword] = useState('pass123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert(t('common.error'), t('login.errors.missing'));
      return;
    }

    try {
      setLoading(true);
      const db = await getDB();
      // make sure demo user exists
      await ensureDefaultUser(db);

      const dbUser = await validateUserCredentials(
        db,
        cleanEmail,
        cleanPassword,
      );

      if (!dbUser) {
        Alert.alert(
          t('login.errors.invalidTitle'),
          t('login.errors.invalidMessage'),
        );
        return;
      }

      // success -> update Redux
      dispatch(
        login({
          email: dbUser.email,
          // if your userSlice login only expects {email}, this still works.
          displayName: dbUser.displayName ?? 'User',
        } as any),
      );
    } catch (e) {
      console.error('[Login] error', e);
      Alert.alert(t('common.error'), t('login.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('login.title')}</Text>
      <Text style={styles.subtitle}>{t('login.subtitle')}</Text>

      <Text style={styles.label}>{t('login.emailLabel')}</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder={t('login.emailPlaceholder')}
      />

      <Text style={styles.label}>{t('login.passwordLabel')}</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder={t('login.passwordPlaceholder')}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? '...' : t('login.button')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...TextPresets.H1,
    textAlign: 'center',
  },
  subtitle: {
    ...TextPresets.Caption,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  label: {
    ...TextPresets.Label,
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
  button: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  buttonText: {
    ...TextPresets.Body,
    fontWeight: FontWeight.SEMI_BOLD,
    color: Colors.white,
  },
});

export default LoginScreen;
