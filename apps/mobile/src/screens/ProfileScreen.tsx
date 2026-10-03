import { StyleSheet, Text, View } from 'react-native';

// Phase 1: self-reported skill level, basic profile.
// Phase 2 adds DUPR linking + Supporter subscription management.
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your info and skill level.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: '600' },
  subtitle: { color: '#666' },
});
