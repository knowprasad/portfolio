import { describe, expect, it } from 'vitest';
import { parseGithubProfile } from './github-profile';
const profile = { login:'knowprasad', name:'Shubham Prasad', bio:null, avatar_url:'https://avatars.githubusercontent.com/u/144908638?v=4', html_url:'https://github.com/knowprasad', followers:6, public_repos:31 };
describe('public GitHub profile preview', () => {
  it('uses the actual remote avatar and counts, preserving an empty bio', () => {
    expect(parseGithubProfile(profile)).toEqual({name:'Shubham Prasad',bio:null,avatar:profile.avatar_url,followers:6,repositories:31});
  });
  it('rejects another account or an untrusted avatar host', () => {
    expect(()=>parseGithubProfile({...profile,login:'someone-else'})).toThrow();
    expect(()=>parseGithubProfile({...profile,avatar_url:'https://example.com/photo.png'})).toThrow();
  });
});
