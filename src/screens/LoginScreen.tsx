import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {login} from '@/state/user/userSlice';
import {Colors, Spacing, Radius, TextPresets, FontSize} from '../theme';

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      // could show translated error, keeping it simple
      return;
    }
    dispatch(login({email: email.trim()}));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CareQueue</Text>
      <Text style={styles.subtitle}>
        Simple login
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue</Text>
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
});

export default LoginScreen;
