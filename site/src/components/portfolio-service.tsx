import { profile } from '@/data/site';

const enquiry = `mailto:${profile.email}?subject=${encodeURIComponent('Portfolio website enquiry')}&body=${encodeURIComponent('Hi Shubham, I’m interested in a portfolio website.\n\nMy goal:\nProject/profile links:\nPreferred launch date:\nContent readiness:\n')}`;

export function PortfolioService() {
  return <div className="footer-service" id="build-portfolio">
    <h2>Want a portfolio like this?</h2>
    <div className="footer-service-links"><a href={enquiry}>Email me <span aria-hidden="true">↗</span></a><a href={profile.booking} target="_blank" rel="noreferrer">Book a call <span aria-hidden="true">↗</span></a></div>
  </div>;
}
