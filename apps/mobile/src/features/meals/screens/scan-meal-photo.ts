// Only native builds bundle the VisionCamera image decoder.
export const scanMealPhoto:
  | ((
      uri: string,
      signal: AbortSignal,
    ) => Promise<{ value: string; compressedUpc: boolean } | null>)
  | undefined = undefined
