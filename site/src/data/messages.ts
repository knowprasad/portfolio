export type PublicMessage = { id: string; name: string; text: string; date: string };

// Publish only real notes with the sender’s permission. Private email stays private.
// A moderated public submission service will replace this list in a later phase.
export const publicMessages: PublicMessage[] = [];
