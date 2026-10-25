export const profile = {
  instagram: 'https://www.instagram.com/knowprasad/', substack: 'https://substack.com/@knowprasad',
  linkedin: 'https://www.linkedin.com/in/knowprasad/', x: 'https://x.com/knowprasad',
  booking: 'https://cal.com/knowprasad',
  name: 'Shubham Prasad', handle: 'knowprasad', role: 'Developer · learning in public',
  email: 'prsdx.dev@gmail.com', codeforces: 'prsdx', codechef: 'prsdx',
  github: 'https://github.com/knowprasad', leetcode: 'https://leetcode.com/u/knowprasad/',
};

export type Project = { slug: string; name: string; description: string; detail: string; tags: string[]; url?: string; github?: string; image?: string; imageKind?: 'cover'; video?: string; status: string; accent: string; featured?: boolean };
export const projects: Project[] = [
  { slug: 'merix', name: 'Merix', description: 'Resume-to-job matching, with the reasoning behind every match.', detail: 'A resume-to-job-description matching application for recruiters. The public product focuses on making candidate matching easier to understand and review.', tags: ['AI', 'Resume matching'], url: 'https://merix-cyan.vercel.app', github: 'https://github.com/knowprasad/merix', image: '/projects/merix.jpg', status: 'Demo paused', accent: 'violet' },
  { slug: 'platewise', name: 'PlateWise', description: 'Ask questions of your documents. Check where the answers came from.', detail: 'Document intelligence for PDF, DOCX and PPTX files, with grounded answers. Built with FastAPI, React, Supabase pgvector and Gemini/Groq.', tags: ['React', 'FastAPI', 'RAG'], url: 'https://platewise-rag.vercel.app', github: 'https://github.com/knowprasad/platewise-rag', image: '/projects/platewise.jpg', status: 'Demo paused', accent: 'orange' },
  { slug: 'pulse', name: 'Pulse', description: 'A simple feedback loop for student events.', detail: 'An anonymous, phone-first feedback experience for event attendees, with useful signals for organizers. The application is being built in stages.', tags: ['Next.js', 'TypeScript', 'Supabase'], image: '/projects/pulse-cover.svg', imageKind: 'cover', status: 'Building', accent: 'blue' },
  { slug: 'yourtomo', name: 'YourTomo', description: 'A little pixel cat that reacts to my public GitHub activity.', detail: 'A zero-dependency Python state machine rendered to animated SVG by a GitHub Action. The cat lives on the GitHub profile and responds to public activity.', tags: ['Python', 'SVG', 'GitHub Actions'], image: '/projects/yourtomo-cover.svg', imageKind: 'cover', github: 'https://github.com/knowprasad/YourTomo', status: 'Open source', accent: 'green' },
];

export type Friend = { name: string; url: string; note?: string; avatar?: string };
// Add only people the owner chooses to feature. These are separate from design references.
export const friends: Friend[] = [];
