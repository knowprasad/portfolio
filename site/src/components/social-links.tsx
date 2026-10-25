import Image from 'next/image';
import { getProfile } from '@/lib/portfolio-content';
import { getGithubProfile } from '@/lib/github-profile-server';
import { LinkPreview } from './link-preview';
import { ArrowUpRight, GithubLogo, LinkedinLogo, XLogo } from './icons';
export async function SocialLinks({ iconsOnly = false }: { iconsOnly?: boolean }) {
 const [profile, github] = await Promise.all([getProfile(), getGithubProfile()]);
 const links = [
  { name:'GitHub',href:profile.github,Icon:GithubLogo,description:'Public repositories and open-source contributions by @knowprasad.' },
  { name:'LinkedIn',href:profile.linkedin,Icon:LinkedinLogo,description:'My professional profile, campus roles and updates.' },
  { name:'X',href:profile.x,Icon:XLogo,description:'My X profile · @knowprasad.' },
  { name:'Instagram',href:profile.instagram,image:'/icons/interface-instagram.svg',description:'My Instagram profile · @knowprasad.' },
  { name:'Substack',href:profile.substack,image:'/icons/substack.svg',description:'My Substack profile · @knowprasad.' },
 ];
 return <>{links.map(link=><LinkPreview key={link.name} href={link.href} aria-label={iconsOnly?`${link.name} profile`:undefined} className={iconsOnly?'icon-button social-link':'footer-social-link'} target="_blank" rel="noreferrer" preview={link.name==='GitHub' && github ? {title:github.name,description:github.bio || 'Public GitHub profile · @knowprasad',label:'GitHub',avatar:github.avatar,details:`${github.followers} followers · ${github.repositories} public repositories`} : {title:`Shubham Prasad on ${link.name}`,description:link.description,label:link.name,avatar:profile.photo}}>{iconsOnly ? link.Icon ? <link.Icon size={19}/> : <Image className="social-mark-image" src={link.image!} width={19} height={19} alt=""/> : <>{link.name}<ArrowUpRight size={12}/></>}</LinkPreview>)}</>;
}
