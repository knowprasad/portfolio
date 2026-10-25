import Image from 'next/image';
import { getProfile } from '@/lib/portfolio-content';
import { ArrowUpRight } from './icons';
export async function BookingLink() {
 const profile = await getProfile();
 return <a className="button booking-link" href={profile.booking} target="_blank" rel="noreferrer"><span className="booking-avatars" aria-hidden="true"><Image src="/site-avatar.webp" width={23} height={23} alt=""/><span className="booking-plus">+</span><span className="booking-you">You</span></span><span>Book a call</span><ArrowUpRight size={13}/></a>;
}
