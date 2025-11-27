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
import {Colors, Spacing, Radius, TextPresets, FontSize} from '../theme';
import {login} from '@/state/user/userSlice';
import {initDB, findUserByEmail, createUserIfNotExists} from '@/services/db';

const DEFAULT_USER = {
  email: 'user@mail.com',
  password: 'pass123',
  displayName: 'CareQueue User',
};

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
      Alert.alert(t('login.errorEmpty'));
      return;
    }

    try {
      setLoading(true);
      const db = await initDB();

      // 1) ensure default user exists
      await createUserIfNotExists(db, DEFAULT_USER);

      // 2) find user
      const user = await findUserByEmail(db, cleanEmail);

      if (!user || user.password !== cleanPassword) {
        Alert.alert(t('login.errorInvalid'));
        return;
      }

      // 3) Redux login
      dispatch(
        login({
          email: user.email,
          displayName: user.displayName ?? '',
        }),
      );
    } catch (e) {
      console.error('[Login] error', e);
      Alert.alert('Error', 'Login failed.');
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

      <View style={styles.helper}>
        <Text style={styles.helperText}>
          {/* small hint for interview/demo */}
          user@mail.com / pass123
        </Text>
      </View>
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
    fontWeight: '600',
    color: '#FFFFFF',
  },
  helper: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  helperText: {
    ...TextPresets.Caption,
    color: Colors.textMuted,
  },
});

export default LoginScreen;
