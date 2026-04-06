import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Search } from 'lucide-react-native'
import { Colors, BrandColors } from '@/constants/colors'

interface Props { totalJobs?: number }

export function HeroBanner({ totalJobs }: Props) {
  const router = useRouter()
  return (
    <View style={styles.container}>
      {/* Gold accent top bar */}
      <View style={styles.topAccent} />

      <View style={styles.inner}>
        <View style={styles.textBlock}>
          <View style={styles.tagRow}>
            <Text style={styles.tagDot}>●</Text>
            <Text style={styles.tag}>Lao động quốc tế</Text>
          </View>
          <Text style={styles.heading}>
            Tìm việc làm{'\n'}
            <Text style={styles.headingAccent}>ở nước ngoài</Text>
          </Text>
          <Text style={styles.sub}>
            Kết nối với {totalJobs ?? '200+'}+ việc làm tại{' '}
            <Text style={styles.subHighlight}>Úc, Canada, New Zealand</Text> và nhiều quốc gia khác.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/jobs')}
          activeOpacity={0.85}
          style={styles.searchBtn}
        >
          <Search size={16} color={Colors.dark} />
          <Text style={styles.searchText}>Tìm kiếm việc làm...</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.stats}>
          {[
            { value: '200+', label: 'Việc làm' },
            { value: '15+',  label: 'Quốc gia' },
            { value: '50+',  label: 'Ngành nghề' },
          ].map((s, i) => (
            <View key={s.label} style={styles.statItem}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  topAccent: {
    height: 3,
    backgroundColor: BrandColors.gold.primary,
  },
  inner: {
    padding: 20,
    gap: 16,
  },
  textBlock: { gap: 10 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tagDot: { color: BrandColors.gold.primary, fontSize: 8 },
  tag: {
    color: BrandColors.gold.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heading: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 34,
  },
  headingAccent: {
    color: BrandColors.gold.primary,
  },
  sub: { color: Colors.muted, fontSize: 13, lineHeight: 20 },
  subHighlight: { color: Colors.textSub, fontWeight: '600' },

  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: BrandColors.gold.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchText: { color: Colors.dark, fontSize: 14, fontWeight: '700', flex: 1 },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  stats: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center' },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.border, marginRight: 20 },
  statContent: { alignItems: 'center' },
  statValue: {
    color: BrandColors.gold.soft,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  statLabel: {
    color: Colors.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 1,
  },
})
