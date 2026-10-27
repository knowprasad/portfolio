import {describe,it,expect} from 'vitest';
import {runInNewContext} from 'node:vm';
import {phaseForHour,normalizeTheme} from './theme';
import {themeScript} from './theme-script';
describe('time-based theme',()=>{
  it.each([[0,'night'],[5,'night'],[6,'morning'],[10,'morning'],[11,'day'],[16,'day'],[17,'evening'],[20,'evening'],[21,'night'],[23,'night']])('resolves hour %i to %s',(hour,phase)=>{expect(phaseForHour(Number(hour))).toBe(phase);});
  it.each(['light','dark'])('preserves existing %s preferences',mode=>expect(normalizeTheme(mode)).toBe(mode));
  it.each([null,undefined,'','broken','auto'])('defaults %s to auto',value=>expect(normalizeTheme(value)).toBe('auto'));
  function boot(hour:number,saved:string|null,blocked=false){const dataset:Record<string,string>={};runInNewContext(themeScript,{document:{documentElement:{dataset}},localStorage:{getItem(){if(blocked)throw Error('blocked');return saved;}},Date:class{getHours(){return hour;}}});return dataset;}
  it.each([[6,'morning','light'],[11,'day','light'],[17,'evening','light'],[21,'night','dark']])('sets first-paint attributes at %i',(hour,phase,theme)=>expect(boot(Number(hour),null)).toEqual({themeMode:'auto',themePhase:phase,theme}));
  it('keeps manual dark in daytime',()=>expect(boot(12,'dark')).toEqual({themeMode:'dark',themePhase:'',theme:'dark'}));
  it('keeps manual light at night',()=>expect(boot(23,'light')).toEqual({themeMode:'light',themePhase:'',theme:'light'}));
  it('still initializes when storage is blocked',()=>expect(boot(18,null,true)).toEqual({themeMode:'auto',themePhase:'evening',theme:'light'}));
  it('rejects invalid saved values before first paint',()=>expect(boot(12,'invalid').themeMode).toBe('auto'));
});
