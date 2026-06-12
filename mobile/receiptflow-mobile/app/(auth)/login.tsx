import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { authApi } from '@/api/auth';
import { getApiErrorMessage } from '@/lib/api-errors';
import { useAuthStore } from '@/store/auth.store';

import { useGoogleAuth } from "../../auth/useGoogleAuth";






export default function LoginScreen() {
   const { promptAsync } = useGoogleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    try {
   
      setError('');

if (!email || !password) {
  setError("Email and password are required");
  return;
}
   setLoading(true);
      const session = await authApi.login({
        email,
        password,
      });

      await setAuth(session);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Login failed.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#64748b"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#64748b"
        autoCapitalize="none"
        autoComplete="password"
        secureTextEntry
        textContentType="password"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Link href="/(auth)/register" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Don&apos;t have an account? Register</Text>
        </TouchableOpacity>
      </Link>

<TouchableOpacity
  style={styles.googleButton}
  onPress={() => promptAsync()}
>
  <Text style={styles.googleIcon}>G</Text>
  <Text style={styles.googleText}>Continue with Google</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#0a0f1a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#94a3b8',
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
  },

  
  googleButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#111827',
  borderWidth: 1,
  borderColor: '#334155',
  padding: 14,
  borderRadius: 12,
  marginTop: 16,
},

googleIcon: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#ffffff',
  marginRight: 10,
},

googleText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: '600',
},
});
