// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENT } from '../theme';
import SearchBar from '../components/SearchBar';
import MemoryCard, { Memory } from '../components/MemoryCard';

const { width } = Dimensions.get('window');

const MOCK_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Sunset at Key West',
    snippet: 'Sailing cruise near Sunset Key. The sky was vibrant orange, and we spotted dolphins near the harbor.',
    date: 'Jun 28, 2026',
    type: 'photo',
  },
  {
    id: '2',
    title: 'W2 Tax Document 2025',
    snippet: 'Official W-2 Wage and Tax Statement. Standard employer copy stored in tax folder.',
    date: 'Feb 15, 2026',
    type: 'document',
  },
  {
    id: '3',
    title: 'Project Brainstorming Audio',
    snippet: '“We need to design the UI with glassmorphism and support local embedding database for fast search offline...”',
    date: 'Jun 12, 2026',
    type: 'audio',
  },
  {
    id: '4',
    title: 'Receipt - Whole Foods',
    snippet: 'Purchased organic berries, oat milk, avocados, and fresh bakery items. Total: $48.20.',
    date: 'Jun 29, 2026',
    type: 'screenshot',
  },
  {
    id: '5',
    title: 'Design Spec Draft PDF',
    snippet: 'System design document detailing the local indexer running node.js worker threads.',
    date: 'May 04, 2026',
    type: 'document',
  },
];

const CATEGORIES = ['All', 'Photos', 'Documents', 'Audio', 'Screenshots'];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [searchResults, setSearchResults] = useState<Memory[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      setAiSummary('');
      return;
    }

    setIsLoading(true);
    setIsSearching(true);
    setAiSummary('');

    // Simulate local AI indexing and querying delay
    setTimeout(() => {
      const filtered = MOCK_MEMORIES.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.snippet.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsLoading(false);

      if (filtered.length > 0) {
        setAiSummary(
          `I found ${filtered.length} memories matching "${searchQuery}". It looks like you have records relating to this topic, including "${filtered[0].title}".`
        );
      } else {
        setAiSummary(`No memories found matching "${searchQuery}". Try searching for sunset, tax, design, or whole foods.`);
      }
    }, 1200);
  };

  const getFilteredMemories = () => {
    if (activeCategory === 'All') return MOCK_MEMORIES;
    const typeMap: Record<string, string> = {
      Photos: 'photo',
      Documents: 'document',
      Audio: 'audio',
      Screenshots: 'screenshot',
    };
    return MOCK_MEMORIES.filter((m) => m.type === typeMap[activeCategory]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0F0C20', '#06040A']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>Nuvo</Text>
          <Text style={styles.subtext}>Your AI Memory Engine</Text>
        </View>
        <TouchableOpacity style={styles.avatar}>
          <Ionicons name="person-circle-outline" size={32} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          if (text === '') {
            setIsSearching(false);
            setSearchResults([]);
            setAiSummary('');
          }
        }}
        onSubmit={handleSearch}
      />

      {/* Search results or normal feed */}
      {isSearching ? (
        <ScrollView style={styles.scrollArea}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.accent} />
              <Text style={styles.loadingText}>Searching memory database...</Text>
            </View>
          ) : (
            <View style={styles.resultsContainer}>
              {/* AI summary block */}
              {aiSummary ? (
                <View style={styles.aiBox}>
                  <LinearGradient
                    colors={['rgba(0, 207, 255, 0.15)', 'rgba(138, 43, 226, 0.15)']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <View style={styles.aiHeader}>
                    <Ionicons name="sparkles" size={18} color={COLORS.accent} />
                    <Text style={styles.aiTitle}>Nuvo AI Summary</Text>
                  </View>
                  <Text style={styles.aiText}>{aiSummary}</Text>
                </View>
              ) : null}

              <Text style={styles.sectionTitle}>Matching Memories</Text>
              {searchResults.length > 0 ? (
                searchResults.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))
              ) : (
                <Text style={styles.noResultsText}>No results found.</Text>
              )}
            </View>
          )}
        </ScrollView>
      ) : (
        <FlatList
          data={getFilteredMemories()}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              {/* Category selector */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryContainer}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryTab,
                      activeCategory === cat ? styles.categoryTabActive : null,
                    ]}
                    onPress={() => setActiveCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        activeCategory === cat ? styles.categoryTextActive : null,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Collections Showcase */}
              <View style={styles.collectionsSection}>
                <Text style={styles.sectionTitle}>Smart Collections</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.collectionsContainer}
                >
                  <TouchableOpacity style={styles.collectionCard}>
                    <LinearGradient
                      colors={['rgba(255, 105, 180, 0.2)', 'rgba(138, 43, 226, 0.2)']}
                      style={StyleSheet.absoluteFill}
                    />
                    <AntDesign name="tags" size={24} color="#FF69B4" style={styles.collectionIcon} />
                    <Text style={styles.collectionTitle}>Tax Files</Text>
                    <Text style={styles.collectionCount}>2 items</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.collectionCard}>
                    <LinearGradient
                      colors={['rgba(0, 255, 127, 0.2)', 'rgba(0, 207, 255, 0.2)']}
                      style={StyleSheet.absoluteFill}
                    />
                    <AntDesign name="folder" size={24} color="#00FF7F" style={styles.collectionIcon} />
                    <Text style={styles.collectionTitle}>Receipts</Text>
                    <Text style={styles.collectionCount}>5 items</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.collectionCard}>
                    <LinearGradient
                      colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 105, 180, 0.2)']}
                      style={StyleSheet.absoluteFill}
                    />
                    <AntDesign name="picture" size={24} color="#FFD700" style={styles.collectionIcon} />
                    <Text style={styles.collectionTitle}>Key West</Text>
                    <Text style={styles.collectionCount}>12 items</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              <Text style={styles.sectionTitle}>Recent Memories</Text>
            </View>
          }
          renderItem={({ item }) => <MemoryCard memory={item} />}
          ListEmptyComponent={
            <Text style={styles.noResultsText}>No memories in this category.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  subtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  avatar: {
    padding: 4,
  },
  categoryScroll: {
    marginVertical: 12,
  },
  categoryContainer: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  categoryTabActive: {
    backgroundColor: COLORS.textPrimary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: COLORS.background,
  },
  collectionsSection: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginHorizontal: 20,
    marginVertical: 14,
  },
  collectionsContainer: {
    paddingHorizontal: 16,
  },
  collectionCard: {
    width: 130,
    height: 130,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'flex-end',
  },
  collectionIcon: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  collectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  collectionCount: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  scrollArea: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 16,
    fontSize: 15,
  },
  resultsContainer: {
    paddingBottom: 24,
  },
  noResultsText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 32,
    fontSize: 14,
  },
  aiBox: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 207, 255, 0.25)',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTitle: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  aiText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
});
