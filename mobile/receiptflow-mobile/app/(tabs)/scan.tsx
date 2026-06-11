import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { invoicesApi } from '../../api/invoices';
import { AppTopBar } from '../../components/app-top-bar';
import { getApiErrorMessage } from '../../lib/api-errors';
import {
  MediaTypeOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from '../../lib/image-picker';

export default function ScanScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef<unknown>(null);

  const pickImage = async (useCamera: boolean) => {
    try {
      setError('');
      setSuccess(false);

      let res;
      if (useCamera) {
        const { status } = await requestCameraPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Camera permission required');
        }
        res = await launchCameraAsync({ quality: 0.8 });
      } else {
        const { status } = await requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Gallery permission required');
        }
        res = await launchImageLibraryAsync({
          mediaTypes: MediaTypeOptions.Images,
          quality: 0.8,
        });
      }

      if (!res.canceled && res.assets && res.assets[0]) {
        setImageUri(res.assets[0].uri);
        void uploadImage(res.assets[0].uri);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to pick image');
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setLoading(true);
      const data = await invoicesApi.upload(uri);
      resultRef.current = data;
      setSuccess(true);
      setError('');
    } catch (e: any) {
      setSuccess(false);
      setError(getApiErrorMessage(e, 'Upload failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppTopBar title="Scan" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>Scan</Text>
        <Text style={styles.title}>Upload invoice</Text>
        <Text style={styles.subtitle}>
          Pick a receipt from your camera roll or capture one now.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => pickImage(true)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => pickImage(false)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#60a5fa" />
            <Text style={styles.loadingText}>Uploading invoice...</Text>
          </View>
        )}

        {success ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>Done! Invoice uploaded successfully</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 28,
  },
  kicker: {
    color: '#60a5fa',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: '#111827',
  },
  loadingBox: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  loadingText: {
    color: '#cbd5e1',
    marginTop: 12,
  },
  successBox: {
    backgroundColor: '#0f2f28',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#14532d',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  successText: {
    color: '#86efac',
    fontWeight: '700',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#7f1d1d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  errorText: {
    color: '#fca5a5',
  },
});
