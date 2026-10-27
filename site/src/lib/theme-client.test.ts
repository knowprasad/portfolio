import {afterEach,describe,it,expect,vi} from 'vitest';
import {selectTheme} from './theme-client';
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();});
describe('theme selection',()=>{
  function setup(blocked=false){const root={dataset:{themeMode:'auto',themePhase:'night',theme:'dark'}};const store={setItem:vi.fn(()=>{if(blocked)throw Error('blocked');})};const events=new EventTarget();vi.stubGlobal('document',{documentElement:root});vi.stubGlobal('localStorage',store);vi.stubGlobal('window',events);return {root,store};}
  it('saves manual preference and clears automatic palette',()=>{const {root,store}=setup();selectTheme('light');expect(root.dataset).toEqual({themeMode:'light',themePhase:'',theme:'light'});expect(store.setItem).toHaveBeenCalledWith('portfolio-theme','light');});
  it('applies a manual preference without storage',()=>{const {root}=setup(true);selectTheme('dark');expect(root.dataset).toEqual({themeMode:'dark',themePhase:'',theme:'dark'});});
  it('reassesses Auto only when selected, not as the clock advances',()=>{vi.useFakeTimers();vi.setSystemTime(new Date(2026,9,27,10,59));const {root}=setup();selectTheme('auto');expect(root.dataset.themePhase).toBe('morning');vi.setSystemTime(new Date(2026,9,27,11,1));expect(root.dataset.themePhase).toBe('morning');selectTheme('auto');expect(root.dataset.themePhase).toBe('day');});
});
