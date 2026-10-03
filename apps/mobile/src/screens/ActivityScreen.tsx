import { StyleSheet, Text, View } from 'react-native';

// Phase 1: RSVP'd / upcoming events, live scoring & standings during play.
export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity</Text>
      <Text style={styles.subtitle}>Your upcoming and live events.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: '600' },
  subtitle: { color: '#666' },
});
