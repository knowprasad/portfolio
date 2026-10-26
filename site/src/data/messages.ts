export type PublicMessage = { id: string; name: string; text: string; date: string; pinned: boolean };

// Publish only real notes with the sender’s permission. Private email stays private.
// Empty fallback: never substitute invented comments when the service is unavailable.
export const publicMessages: PublicMessage[] = [];
