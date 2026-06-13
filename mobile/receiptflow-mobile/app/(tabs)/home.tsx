import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { invoicesApi, resolveInvoiceImageUrl, type InvoiceListItem } from '../../api/invoices';
import { AppTopBar } from '../../components/app-top-bar';
import { formatDisplayName } from '../../lib/display-name';
import { useAuthStore } from '../../store/auth.store';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const focused = useIsFocused();
  const isMountedRef = useRef(true);
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadInvoices = useCallback(async (isPullToRefresh = false) => {
    try {
      setError('');

      if (!isPullToRefresh) {
        setLoading(true);
      }

      const items = await invoicesApi.list();

      if (!isMountedRef.current) {
        return;
      }

      setInvoices(items);
    } catch {
      if (isMountedRef.current) {
        setError('Unable to load invoices right now.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (focused) {
      void loadInvoices();
    }
  }, [focused, loadInvoices]);

  const displayName = formatDisplayName(user);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppTopBar title="Home" user={user} />
      <FlatList
        data={invoices}
        keyExtractor={(item, index) => item.id?.toString() ?? `invoice-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void loadInvoices(true);
            }}
            tintColor="#f8fafc"
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>Dashboard</Text>
            <Text style={styles.title}>Welcome {displayName}</Text>
            <Text style={styles.subtitle}>Your uploaded invoices appear below.</Text>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#60a5fa" />
                <Text style={styles.loadingText}>Loading invoices...</Text>
              </View>
            ) : null}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No invoices yet</Text>
              <Text style={styles.emptyText}>
                Upload a receipt from the Scan tab and it will show here.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const imageSource = resolveInvoiceImageUrl(item.imageUrl ?? item.ImageUrl);

          return (
            <Pressable
              style={styles.invoiceCard}
              onPress={() => {
                if (imageSource) {
                  setSelectedImage(imageSource);
                }
              }}
            >
              {imageSource ? (
                <Image source={{ uri: imageSource }} style={styles.invoiceImage} />
              ) : (
               <View style={[styles.invoiceImage, styles.placeholderContainer]}>
  <Text style={styles.placeholderText}>
    No Invoice
  </Text>
</View>
              )}
            </Pressable>
          );
        }}
      />

      <Modal
        visible={Boolean(selectedImage)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedImage(null)} />
          <View style={styles.modalSheet}>
            <Pressable style={styles.modalClose} onPress={() => setSelectedImage(null)}>
              <Text style={styles.modalCloseText}>×</Text>
            </Pressable>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              maximumZoomScale={Platform.OS === 'ios' ? 3 : 1}
              minimumZoomScale={1}
              centerContent
            >
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.modalImage} />
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 20,
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
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  loadingText: {
    color: '#cbd5e1',
  },
  errorText: {
    marginTop: 14,
    color: '#fca5a5',
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },
  invoiceCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  invoiceImage: {
    width: '100%',
    aspectRatio: 0.9,
    backgroundColor: '#0f172a',
  },
  placeholderImage: {
    opacity: 0.9,
    padding: 18,
  },
  emptyCard: {
    marginTop: 16,
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: '#94a3b8',
    lineHeight: 21,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.96)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 520,
    height: '86%',
    borderRadius: 24,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  modalCloseText: {
    color: '#f8fafc',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '400',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    minHeight: 280,
    resizeMode: 'contain',
  },

placeholderContainer: {
  justifyContent: 'center',
  alignItems: 'center',
},

placeholderText: {
  color: '#64748b',
  fontSize: 16,
  fontWeight: '600',
},



});
