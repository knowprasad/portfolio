import { describe, expect, it } from 'vitest';
import { securityHeaders, validateActivityRequest } from './security';

describe('activity request boundary', () => {
  it('rejects internal addresses, impersonated hosts, credentials and insecure requests', () => {
    for (const url of ['http://api.github.com/x', 'https://127.0.0.1/', 'https://169.254.169.254/', 'https://api.github.com.evil.test/', 'https://api.github.com@evil.test/', 'https://user:password@api.github.com/', 'https://api.github.com:444/x']) expect(() => validateActivityRequest(url)).toThrow();
    expect(validateActivityRequest('https://api.github.com/users/knowprasad').hostname).toBe('api.github.com');
  });
  it('permits credentials only for GitHub API calls', () => {
    expect(() => validateActivityRequest('https://leetcode.com/graphql', true)).toThrow();
    expect(validateActivityRequest('https://api.github.com/search/issues', true).protocol).toBe('https:');
  });
});
describe('browser security policy', () => {
  it('blocks embedding, object content and inline event handlers without production eval', () => {
    const headers = securityHeaders(true);
    const csp = headers.find(header => header.key === 'Content-Security-Policy')!.value;
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("script-src-attr 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain('unsafe-eval');
    expect(headers.find(header => header.key === 'Strict-Transport-Security')).toBeDefined();
  });
  it('keeps local development HTTP and debugging available', () => {
    const csp = securityHeaders(false).find(header => header.key === 'Content-Security-Policy')!.value;
    expect(csp).not.toContain('upgrade-insecure-requests');
    expect(csp).toContain('ws://127.0.0.1:3001');
  });
});
