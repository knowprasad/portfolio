import { profile } from '@/data/site';

const enquiry = `mailto:${profile.email}?subject=${encodeURIComponent('Portfolio website enquiry')}&body=${encodeURIComponent('Hi Shubham, I’m interested in a portfolio website.\n\nMy goal:\nProject/profile links:\nPreferred launch date:\nContent readiness:\n')}`;

export function PortfolioService() {
  return <div className="footer-service" id="build-portfolio">
    <h2><a href={enquiry}>Want a portfolio like this? <span aria-hidden="true">↗</span></a></h2>
    <p>I build personal websites for students and developers, shaped around your projects, identity and goals.</p>
  </div>;
}
