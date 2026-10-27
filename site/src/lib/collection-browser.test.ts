import { expect,it } from 'vitest';
import { filterCollection,collectionGroups,type CollectionItem } from './collection-browser';
import { featuredImages,collectionImage,collectionSlug,libraryKind,collectionItem } from './collection-content';
const base:CollectionItem={id:'1',name:'Atomic Habits',creator:'James Clear',format:'Book',status:'Read',summary:'',country:'',imageCredit:'',featured:false};
it('combines case-insensitive search, format and status without mixing books with other shelves',()=>{
  const items=[base,{...base,id:'2',name:'Vinland Saga',format:'Anime',status:'Watching'}];
  expect(filterCollection(items,' JAMES habits ','Book','Read')).toEqual([base]);
  expect(filterCollection(items,'Vinland','Anime','Watched')).toEqual([]);
});
it('keeps current, completed and future items distinct and preserves unknown status',()=>{
  const groups=collectionGroups([base,{...base,id:'2',status:'Reading'},{...base,id:'3',status:''}],'books');
  expect(groups.map(g=>g.title)).toEqual(['Reading','Read','On the shelf']);
});
it('uses featured images first, then available images, and omits missing artwork',()=>{
  const entries=[{id:'1',name:'A',values:{Image:'https://images.unsplash.com/a'},tags:[],featured:false},{id:'2',name:'B',values:{Image:'https://images.unsplash.com/b'},tags:[],featured:true},{id:'3',name:'C',values:{Image:''},tags:[],featured:true}];
  expect(featuredImages(entries,2).map(e=>e.id)).toEqual(['2','1']);
});
it('serves imported artwork locally on previews and rejects unapproved image sources',()=>{
  expect(collectionImage('https://knowprasad.me/collection-images/atomic-habits.webp')).toBe('/collection-images/atomic-habits.webp');
  expect(collectionImage('https://unknown.example/cover.jpg')).toBeUndefined();
  expect(collectionImage('javascript:alert(1)')).toBeUndefined();
});
it('includes the owner take in collection search',()=>{
  expect(filterCollection([{...base,note:'I keep returning to the chapter on identity.'}],'identity')).toHaveLength(1);
});
it('keeps diary URLs stable across title changes and rejects invalid slugs and non-book records',()=>{
  const entry={id:'40542b1c-345e-816a-8dab-d19f5435f507',name:'Atomic Habits',values:{Shelf:'Books',Format:'Book',Slug:'atomic-habits'},featured:true,tags:[]};
  expect(collectionItem({...entry,name:'A new display title'},'books').path).toBe('/books/atomic-habits');
  expect(collectionSlug({...entry,values:{...entry.values,Slug:'../private'}})).toBe(entry.id);
  expect(libraryKind({...entry,values:{...entry.values,Format:'Article'}})).toBeUndefined();
});
