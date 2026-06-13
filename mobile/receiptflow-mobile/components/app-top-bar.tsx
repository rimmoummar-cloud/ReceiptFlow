import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatDisplayName } from '../lib/display-name';
import type { User } from '../types';
import { Image } from 'react-native';
// import { TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/auth.store';
type AppTopBarProps = {
  title: string;
  user?: User | null;
  rightAccessory?: ReactNode;
};

const buildInitials = (displayName: string) => {
  const parts = displayName.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? 'R';
  const second = parts[1]?.[0] ?? '';

  return `${first}${second}`.toUpperCase();
};

export function AppTopBar({ title, user, rightAccessory }: AppTopBarProps) {
  const logout = useAuthStore((s) => s.logout);
  const displayName = formatDisplayName(user);
  const initials = buildInitials(displayName);

  return (
    <View style={styles.container}>
      <View style={styles.brandGroup}>
        <View style={styles.logoBadge}>
          {/* <Ionicons name="receipt-outline" size={16} color="#0f172a" /> */}
            <Image
    source={require('../assets/images/logo.png')}
    style={styles.logoImage}
    resizeMode="contain"
  />
        </View>
       
        <Text style={styles.brandText}>ReceiptFlow</Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

    <TouchableOpacity onPress={logout}>
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.9)',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  // brandGroup: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 10,
  //   flex: 1,
  // },
  brandGroup: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
// logoBadge: {
//   width: 32,
//   height: 32,
//   borderRadius: 16,
//   backgroundColor: '#f8fafc',
//   alignItems: 'center',
//   justifyContent: 'center',
// },
logoBadge: {
  width: 32,
  height: 32,
  borderRadius: 16,

  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
},



  brandText: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  // title: {
  //   color: '#cbd5e1',
  //   fontSize: 16,
  //   fontWeight: '700',
  //   flex: 1,
  //   textAlign: 'center',
  // },
  title: {
  color: '#cbd5e1',
  fontSize: 16,
  fontWeight: '700',
  flex: 1,
  textAlign: 'center',
},

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
  },
logoutText: {
  color: '#f87171',
  fontSize: 13,
  fontWeight: '600',
  paddingHorizontal: 6,
},
logoImage: {
  width: 28,
  height: 28,
  alignSelf: 'center',
},
});
