import Link from 'next/link';
import { LeaveMessage } from '@/components/leave-message';
import { PublicMessageForm } from '@/components/public-message-form';
import { MessageSignIn } from '@/components/message-sign-in';
import { Footer } from '@/components/section';
import { authClient } from '@/lib/supabase-server';
import { pageMetadata } from '@/lib/seo';
import { slugSchema } from '@/lib/content-model';
import { getArticle } from '@/lib/notion-server';
import { signOut, deleteOwnMessage } from './actions';
export const dynamic = 'force-dynamic';
export const metadata = {...pageMetadata('/guestbook','Leave a message','Notes from people who stopped by Shubham Prasad’s corner of the web.'),robots:{index:false,follow:true}};
export default async function Guestbook({searchParams}:{searchParams:Promise<{auth?:string;article?:string}>}) {
  const {auth,article}=await searchParams;
  const parsed=slugSchema.safeParse(article);
  const post=parsed.success?await getArticle(parsed.data):null;
  const articleSlug=post?.values.Comments==='true'?parsed.success?parsed.data:undefined:undefined;
  const client=await authClient();const user=client?(await client.auth.getUser()).data.user:null;
  const name=typeof user?.user_metadata?.full_name==='string'?user.user_metadata.full_name.slice(0,80):'';
  const own=user&&client?(await client.from('guestbook_messages').select('id,message,status,article_slug').eq('user_id',user.id).order('created_at',{ascending:false}).limit(30)).data:[];
  return <><main id="main" className="inner-page"><Link href={articleSlug?`/writing/${articleSlug}#comments`:'/'} className="back-link">← {articleSlug?'Back to article':'Home'}</Link><span className="section-eyebrow">Guestbook</span><h1>{articleSlug?'Join the discussion':'Leave a message'}<span>.</span></h1>{articleSlug && <p className="page-intro">On “{post?.name}”</p>}<section id="compose" className="guestbook-compose">{auth==='error' && <p role="alert">Sign-in could not be completed. Please try again.</p>}{article && !articleSlug ? <p>This article discussion is unavailable.</p> : user ? <><PublicMessageForm name={name} article={articleSlug}/><form action={signOut}><button className="text-link">Sign out</button></form></> : <MessageSignIn article={articleSlug}/>}</section>{!articleSlug && <LeaveMessage full/>}{user && Boolean(own?.length) && <section className="own-messages"><h2>Your submissions</h2><p className="message-note">Only you can see your pending and rejected submissions here.</p>{own?.map(row=><div key={row.id}><p>{row.message}</p><small>{row.status}{row.article_slug?' · Article comment':''}</small><form action={deleteOwnMessage}><input type="hidden" name="id" value={row.id}/><button className="text-link">Delete my message</button></form></div>)}</section>}</main><Footer/></>;
}
