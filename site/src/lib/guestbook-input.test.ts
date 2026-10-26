import { it, expect } from 'vitest';
import { messageInput } from './guestbook-input';
it('rejects empty and oversized guestbook submissions before database writes',()=>{
  expect(messageInput.safeParse({name:' ',message:'hello'}).success).toBe(false);
  expect(messageInput.safeParse({name:'Visitor',message:'x'.repeat(1201)}).success).toBe(false);
  expect(messageInput.parse({name:' Visitor ',message:' Hello '})).toEqual({name:'Visitor',message:'Hello'});
});
