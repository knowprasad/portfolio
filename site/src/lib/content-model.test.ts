import { describe, it, expect } from 'vitest';
import { normalizePublishedPage, publicUrl, slugSchema, plainBlocks } from './content-model';
const page = (publish = 'Published') => ({id:'40442b1c-345e-81b8-838b-cfd5ec0ffa3f',properties:{Name:{title:[{plain_text:'An actual article'}]},Publish:{select:{name:publish}},Slug:{rich_text:[{plain_text:'my-article'}]},Summary:{rich_text:[{plain_text:'A summary.'}]},Comments:{checkbox:true},Tags:{multi_select:[{name:'Engineering'}]}}});
describe('Publishing boundary',()=>{
  it('excludes draft, archived, trashed and malformed entries',()=>{
    expect(normalizePublishedPage(page('Draft'))).toBeNull();
    expect(normalizePublishedPage({...page(),archived:true})).toBeNull();
    expect(normalizePublishedPage({...page(),in_trash:true})).toBeNull();
    expect(normalizePublishedPage({properties:{}})).toBeNull();
  });
  it('preserves published properties without exposing unrelated page metadata',()=>{
    const entry=normalizePublishedPage({...page(),created_by:{id:'private-user-id'}});
    expect(entry?.name).toBe('An actual article');expect(entry?.values.Comments).toBe('true');expect(entry?.tags).toEqual(['Engineering']);expect(JSON.stringify(entry)).not.toContain('private-user-id');
  });
  it('rejects executable URLs, credentials and unsafe slugs',()=>{
    for(const url of ['javascript:alert(1)','data:text/html,hello','http://example.com','https://user:secret@example.com','https://localhost/a']) expect(publicUrl(url)).toBeUndefined();
    expect(publicUrl('https://example.com/book')).toBe('https://example.com/book');
    for(const slug of ['../draft','//evil.com','test?next=evil','two words','<script>']) expect(slugSchema.safeParse(slug).success).toBe(false);
  });
  it('indexes nested article text and tables',()=>{
    expect(plainBlocks([{id:'1',type:'quote',text:[{text:'hello'}],children:[{id:'2',type:'paragraph',text:[{text:'nested'}],children:[]}],rows:[['table']]}])).toContain('nested');
  });
});
