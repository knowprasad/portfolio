import Link from 'next/link';
import Image from 'next/image';
import { signInWithGoogle } from '@/app/guestbook/actions';
import { googleSignInReady } from '@/lib/auth-config';
export function MessageSignIn({ article }: { article?: string }) {
  return <><div className="message-sign-in"><p>Sign in to leave a {article ? 'comment on this article' : 'message in my guestbook'}.</p><form action={signInWithGoogle}>{article && <input type="hidden" name="article" value={article}/>}<button type="submit" className="button google-sign-in" disabled={!googleSignInReady()}><span className="google-mark" aria-hidden="true"><Image src="/icons/google-sign-in.png" width={20} height={20} alt="" /></span><span>Sign in with Google</span></button></form></div><p className="message-auth-note">{!googleSignInReady() && <span>Google sign-in is still being connected. </span>}<Link className="message-privacy" href="/privacy">Your email stays private</Link></p></>;
}
