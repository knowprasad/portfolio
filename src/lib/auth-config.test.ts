import { describe, expect, it } from 'vitest';
import { callbackOrigin, safeAppOrigin } from './auth-config';
describe('OAuth callback origin', () => {
  it('keeps local sign-in cookies on the host that started the flow', () => {
    expect(callbackOrigin('127.0.0.1:3001',false)).toBe('http://127.0.0.1:3001');
    expect(callbackOrigin('localhost:3001',false)).toBe('http://localhost:3001');
  });
  it('uses the configured production origin regardless of the request host', () => {
    expect(callbackOrigin('localhost:3001',true)).toBe(safeAppOrigin(null));
    expect(callbackOrigin('attacker.example',true)).toBe(safeAppOrigin(null));
  });
  it('rejects unknown hosts in development too', () => {
    expect(callbackOrigin('attacker.example',false)).toBe(safeAppOrigin(null));
  });
});
