'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { authClient } from '@/lib/supabase-server';
import { googleSignInReady, safeAppOrigin, authConfig } from '@/lib/auth-config';
import { slugSchema } from '@/lib/content-model';
import { getArticle } from '@/lib/notion-server';
import { messageInput } from '@/lib/guestbook-input';

export async function signInWithGoogle(form: FormData) {
  const article = slugSchema.safeParse(form.get('article'));
  const suffix = article.success ? `?article=${article.data}` : '';
  if (!googleSignInReady()) redirect('/guestbook?auth=unavailable');
  const client = await authClient(true);
  const origin = safeAppOrigin((await headers()).get('origin'));
  const { data, error } = await client!.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${origin}/auth/callback${suffix}` } });
  if (error || !data.url || new URL(data.url).origin !== authConfig()!.url) redirect('/guestbook?auth=error');
  redirect(data.url);
}
export async function signOut() {
  const client = await authClient(true);
  if (client) await client.auth.signOut();
  redirect('/guestbook');
}
export async function postMessage(_previous: { message: string; success: boolean }, form: FormData) {
  const client = await authClient(true);
  if (!client) return { message: 'Public messages are unavailable right now.', success: false };
  const { data: { user } } = await client.auth.getUser();
  if (!user) return { message: 'Please sign in before leaving a public message.', success: false };
  const input = messageInput.safeParse({ name: form.get('name'), message: form.get('message') });
  if (!input.success) return { message: 'Add a name (up to 80 characters) and a message (up to 1,200 characters).', success: false };
  const article = form.get('article');
  let articleSlug: string | null = null;
  if (article) { const parsed = slugSchema.safeParse(article); if (!parsed.success) return {message:'This discussion is unavailable.',success:false}; const post=await getArticle(parsed.data); if(!post || post.values.Comments!=='true') return {message:'Comments are closed on this article.',success:false}; articleSlug=parsed.data; }
  const { error } = await client.from('guestbook_messages').insert({ user_id: user.id, display_name: input.data.name, message: input.data.message, article_slug: articleSlug });
  if (error) return { message: error.code === 'P0001' ? 'Please wait ten minutes before leaving another message.' : 'Your message could not be saved. Please try again.', success: false };
  revalidatePath('/guestbook');
  revalidatePath('/');
  if(articleSlug) revalidatePath(`/writing/${articleSlug}`);
  return { message: 'Saved successfully. Your message is pending review, so it is not public yet. You can see it below in Your submissions.', success: true };
}

export async function deleteOwnMessage(form: FormData) {
  const client=await authClient(true); if(!client)return;
  const {data:{user}}=await client.auth.getUser(); if(!user)return;
  const id=form.get('id'); if(typeof id!=='string' || !/^[a-f0-9-]{36}$/i.test(id))return;
  const {data}=await client.from('guestbook_messages').delete().eq('id',id).eq('user_id',user.id).select('article_slug');
  revalidatePath('/guestbook'); revalidatePath('/');
  for(const row of data || []) if(slugSchema.safeParse(row.article_slug).success) revalidatePath(`/writing/${row.article_slug}`);
}
