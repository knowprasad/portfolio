import Link from 'next/link';
import { ArrowUpRight } from './icons';
export function MessageButton() {
  return <Link className="text-link message-compose" href="/guestbook#compose">Leave a message <ArrowUpRight size={13} /></Link>;
}
