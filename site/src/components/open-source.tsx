'use client';
import { useId, useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { LinkPreview } from './link-preview';
import { GithubAvatar } from './github-avatar';
import { ArrowUpRight, GitPullRequest, GitMerge, XCircle, Checks } from '@/components/icons';
import type { PrActivity, PrState, GithubActivity, ContributorOwner } from '@/lib/activity';
import { ContributionCalendar } from './activity-charts';
import { selectContributionSamples } from '@/lib/contribution-selection';

const tabs = [{ id: 'merged', label: 'Merged', Icon: GitMerge }, { id: 'open', label: 'Open', Icon: GitPullRequest }, { id: 'closed', label: 'Closed', Icon: XCircle }, { id: 'reviewed', label: 'Peer reviewed', Icon: Checks }] as const;
const queries: Record<PrState, string> = { merged: 'author:knowprasad is:pr is:merged is:public -user:knowprasad', open: 'author:knowprasad is:pr is:open is:public -user:knowprasad', closed: 'author:knowprasad is:pr is:closed is:unmerged is:public -user:knowprasad', reviewed: 'reviewed-by:knowprasad -author:knowprasad is:pr is:public' };
export function OpenSource({ github, activity, owners }: { github: GithubActivity; activity: PrActivity; owners: ContributorOwner[] }) {
  const hoverId = useId();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<PrState>('merged');
  const [expanded, setExpanded] = useState(false);
  const [showOwners, setShowOwners] = useState(false);
  const group = activity[selected];
  const collapsedItems = selected === 'merged' ? selectContributionSamples(group.items) : group.items.slice(0, 5);
  const visibleItems = expanded ? group.items : collapsedItems;
  const repositories = new Set(activity.merged.items.map(item => item.repository));
  const ownerGroups = [
    { title: 'Organizations', items: owners.filter(owner => owner.kind === 'Organization') },
    { title: 'Individuals', items: owners.filter(owner => owner.kind === 'User') },
    { title: 'Contributors', items: owners.filter(owner => owner.kind === 'Unknown') },
  ].filter(group => group.items.length);
  const hiddenOwners = ownerGroups.reduce((total, group) => total + Math.max(group.items.length - 3, 0), 0);
  return <>
    <div className="oss-subheading oss-first"><h3>{selected === 'merged' ? 'Selected contributions' : 'Pull requests'}</h3><span>Inspect the code & discussion</span></div><div className="pr-tabs" role="group" aria-label="Pull request filters">{tabs.map(({ id, label, Icon }) => <button key={id} className={`pr-tab ${id}`} aria-pressed={selected === id} onClick={() => { setSelected(id); setExpanded(false); }} aria-controls="pr-results"><Icon size={14} /><span>{label}</span><strong>{activity[id].count}</strong></button>)}</div><p className="pr-explainer">{selected === 'reviewed' ? 'Public pull requests by other people that I reviewed.' : selected === 'closed' ? 'My upstream pull requests closed without being merged.' : selected === 'open' ? 'My upstream pull requests still in progress.' : 'My pull requests accepted into other public projects.'}</p>
    <LayoutGroup id={hoverId}><div className="pr-list" id="pr-results" aria-live="polite" onMouseLeave={() => setHovered(null)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setHovered(null); }}>{group.items.length ? visibleItems.map(pr => <LinkPreview key={pr.url} href={pr.url} target="_blank" rel="noreferrer" className={`pr-row state-${selected}`} onMouseEnter={() => setHovered(pr.url)} onFocus={() => setHovered(pr.url)} preview={{ title: pr.title, description: `${pr.repository} · #${pr.number} · ${selected === 'reviewed' ? 'Reviewed by me' : selected === 'closed' ? 'Closed without merge' : selected === 'merged' ? 'Merged upstream' : 'Open pull request'}. Open the full discussion and code changes on GitHub.`, label: 'GitHub pull request' }}>{hovered === pr.url && <motion.span className="pr-hover-surface" aria-hidden="true" layoutId="pr-hover" initial={false} transition={{ duration: reduced ? 0 : .22, ease: [.23, 1, .32, 1] }} />}<GithubAvatar className="pr-owner-avatar" login={pr.repository.split('/')[0]} src={owners.find(owner => owner.login.toLowerCase() === pr.repository.split('/')[0].toLowerCase())?.avatar} size={28} /><span className="pr-copy"><strong>{pr.title}</strong><small>{pr.repository} <span className="pr-number">#{pr.number}</span></small></span><span className="pr-date">{new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</span><ArrowUpRight size={12} /></LinkPreview>) : <p className="platform-unavailable">No public pull requests in this view.</p>}</div></LayoutGroup><div className="pr-list-actions">{group.items.length > collapsedItems.length && <button className="text-link" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show less' : `Show more · ${group.items.length - collapsedItems.length}`}</button>}<a className="text-link" href={`https://github.com/search?q=${encodeURIComponent(queries[selected])}&type=pullrequests`} target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight size={12} /></a></div><p className="data-date">{group.source === 'snapshot' ? 'Saved public snapshot' : 'Checked'} · {new Date(group.fetchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</p>
    <div className="oss-context"><p className="oss-description"><strong>{activity.merged.count} merged pull requests</strong> across {repositories.size}{activity.merged.count > activity.merged.items.length ? '+' : ''} public repositories. Small fixes, useful features, and learning in public.</p><div className="contributor-groups" id="contributor-groups">{ownerGroups.map(group => <div className="contributor-group" key={group.title}><h3>{group.title}</h3><div className="contributor-icons">{group.items.slice(0, showOwners ? undefined : 3).map(owner => <LinkPreview className="contributor-icon" key={owner.login} href={owner.url} target="_blank" rel="noreferrer" aria-label={`${owner.login} on GitHub`} preview={{ title: owner.login, description: `${owner.kind === 'Organization' ? 'Organization' : 'Developer'} whose public projects I contributed to. Open their GitHub profile.`, label: 'GitHub' }}><GithubAvatar login={owner.login} src={owner.avatar} size={34} /></LinkPreview>)}</div></div>)}</div>{hiddenOwners > 0 && <button className="contributors-toggle" aria-controls="contributor-groups" aria-expanded={showOwners} onClick={() => setShowOwners(!showOwners)}>{showOwners ? 'Show less' : `Show more · ${hiddenOwners}`}</button>}<div id="contributions" className="oss-calendar"><div className="oss-subheading"><h3>A year on GitHub</h3><span>Public contribution activity</span></div><ContributionCalendar data={github} /></div></div>
  </>;
}
