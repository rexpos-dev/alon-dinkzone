import { StyleSheet, Text, View } from 'react-native';

// Phase 1: browse/search public clubs & upcoming activities.
// Phase 3 adds map view + distance/time/sport filters (see PRD §6).
export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>Find clubs and activities near you.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: '600' },
  subtitle: { color: '#666' },
});
