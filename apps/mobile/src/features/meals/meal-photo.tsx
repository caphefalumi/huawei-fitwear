import { Image, type ImageProps } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';
import { apiRequest } from '@/lib/api';
import { icons } from './meals-ui';

export function MealPhoto({ mealId, imageUrl, style, compact = false }: { mealId?: string; imageUrl: string | null; style: ImageProps['style']; compact?: boolean }) {
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    setUri(null); setError(null);
    if (!imageUrl) return;
    if (!mealId || !imageUrl.startsWith('/meals/')) { setUri(imageUrl); return; }
    apiRequest<{ imageUrl: string }>(`/meals/${encodeURIComponent(mealId)}/photo`)
      .then((result) => { if (current) setUri(result.imageUrl); })
      .catch((cause) => { if (current) setError(cause instanceof Error ? cause.message : 'Could not load this meal photo.'); });
    return () => { current = false; };
  }, [mealId, imageUrl, attempt]);
  if (!imageUrl) return compact ? <Image source={icons.utensils} style={style} contentFit="contain" accessibilityLabel="Meal without a photo" /> : null;
  if (error) return <View style={[style, { alignItems: 'center', justifyContent: 'center', padding: 8, gap: 8 }]}><Text accessibilityRole="alert" numberOfLines={compact ? 2 : undefined} style={{ color: C.textMuted, fontSize: compact ? 10 : 12 }}>{compact ? 'Photo unavailable' : error}</Text><Pressable accessibilityLabel="Retry meal photo" onPress={() => setAttempt((value) => value + 1)} style={{ padding: 8 }}><Text style={{ color: C.accent, fontSize: 12 }}>Retry</Text></Pressable></View>;
  if (!uri) return <View style={[style, { alignItems: 'center', justifyContent: 'center' }]}><ActivityIndicator color={C.accent} accessibilityLabel="Loading meal photo" /></View>;
  return <Image source={{ uri }} style={style} contentFit="cover" accessibilityLabel="Logged meal photo" onError={() => setError('This meal photo could not be displayed. Please try again.')} />;
}
