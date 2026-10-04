import React, { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function CameraTabPlaceholder() {
  useEffect(() => {
    router.replace('/snap-meal');
  }, []);

  return <View style={{ flex: 1 }} />;
}
