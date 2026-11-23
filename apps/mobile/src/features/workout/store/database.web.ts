// Web is used for UI testing only. Drafts last until the page reloads.
const drafts = new Map<string, string>()

export async function readDraftPayload(userId: string) {
  return drafts.get(userId) ?? null
}

export async function writeDraftPayload(userId: string, payload: string) {
  drafts.set(userId, payload)
}

export async function clearDraftPayload(userId: string) {
  drafts.delete(userId)
}
