// src/components/MemoryCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../theme';

export interface Memory {
  id: string;
  title: string;
  snippet: string;
  date: string;
  type: 'photo' | 'document' | 'audio' | 'screenshot';
}

interface MemoryCardProps {
  memory: Memory;
  onPress?: () => void;
}

export default function MemoryCard({ memory, onPress }: MemoryCardProps) {
  const getIcon = () => {
    switch (memory.type) {
      case 'photo':
        return <AntDesign name="picture" size={20} color={COLORS.accent} />;
      case 'document':
        return <AntDesign name="file" size={20} color="#FFD700" />;
      case 'audio':
        return <AntDesign name="sound" size={20} color="#FF69B4" />;
      case 'screenshot':
        return <AntDesign name="camera" size={20} color="#00FF7F" />;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>{getIcon()}</View>
        <Text style={styles.date}>{memory.date}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>{memory.title}</Text>
      <Text style={styles.snippet} numberOfLines={2}>{memory.snippet}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  snippet: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
