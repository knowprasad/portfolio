import { redirect } from 'next/navigation';
import { profile } from '@/data/site';
export default function Book() { redirect(profile.booking); }
