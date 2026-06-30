// src/screens/OnboardingScreen.tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, GRADIENT } from '../theme';

const { width, height } = Dimensions.get('window');

const CARD_DATA = [
  {
    id: '1',
    title: 'Search Everything',
    description: 'Retrieve photos, PDFs, voice notes, and screenshots in seconds.',
  },
  {
    id: '2',
    title: 'Remember Nothing',
    description: 'Let Nuvo automatically index, categorize, and structure your memories.',
  },
  {
    id: '3',
    title: 'Ask Naturally',
    description: '“Where was that photo of the sunset with the sailboat?” or “Summarize my lecture last Tuesday.”',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < CARD_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      navigation.navigate('Home' as never);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{item.id}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={GRADIENT.primary} style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={CARD_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        keyExtractor={item => item.id}
        style={styles.flatList}
      />
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {CARD_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {activeIndex === CARD_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
  },
  cardContainer: {
    width: width,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    borderRadius: 28,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 207, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  iconText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 6,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.accent,
  },
  button: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 28,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: '700',
  },
});
