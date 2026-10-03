import { StyleSheet, Text, View } from 'react-native';

// Phase 1: list of clubs the player belongs to, with upcoming events per club.
export default function MyClubsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Clubs</Text>
      <Text style={styles.subtitle}>Clubs you've joined will show up here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: '600' },
  subtitle: { color: '#666' },
});
