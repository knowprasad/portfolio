import { Section } from './section';
import { profile } from '@/data/site';

const enquiry = `mailto:${profile.email}?subject=${encodeURIComponent('Portfolio website enquiry')}&body=${encodeURIComponent('Hi Shubham, I’m interested in a portfolio website.\n\nMy goal:\nProject/profile links:\nPreferred launch date:\nContent readiness:\n')}`;

export function PortfolioService() {
  return <Section id="build-portfolio" title="Want a portfolio like this?">
    <div className="portfolio-service">
      <p>I build personal websites for students and developers, shaped around your projects, identity and goals.</p>
      <ul><li>Your code and accounts</li><li>Thoughtful mobile layouts</li><li>Optional Notion editing</li></ul>
      <p className="portfolio-service-price">Starting at <strong>₹2,000</strong> in India <span aria-hidden="true">/</span> <strong>$79</strong> internationally. Scope agreed before we start.</p>
      <div className="portfolio-service-actions"><a className="button" href={enquiry}>Discuss your portfolio <span aria-hidden="true">↗</span></a><a className="text-link" href={profile.booking} target="_blank" rel="noreferrer">Book a conversation <span aria-hidden="true">↗</span></a></div>
    </div>
  </Section>;
}
