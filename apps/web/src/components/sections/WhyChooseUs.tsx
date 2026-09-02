import { Reveal } from "../ui/Reveal";
import {
  ClockIcon,
  FlexIcon,
  HeartHandsIcon,
  InvoiceIcon,
  ShieldIcon,
  TeamIcon,
} from "../ui/icons";

const REASONS = [
  {
    num: "01",
    icon: InvoiceIcon,
    title: "Price Transparency",
    desc: "No confusing surprises. We explain your moving requirements and pricing clearly before the move.",
  },
  {
    num: "02",
    icon: ClockIcon,
    title: "Move On Time",
    desc: "We respect your schedule and work hard to arrive when promised.",
  },
  {
    num: "03",
    icon: ShieldIcon,
    title: "Careful Handling",
    desc: "Furniture, electronics, appliances and personal belongings are handled with care.",
  },
  {
    num: "04",
    icon: TeamIcon,
    title: "Professional Team",
    desc: "Friendly, trained movers who understand how to pack, lift, transport and organize belongings safely.",
  },
  {
    num: "05",
    icon: HeartHandsIcon,
    title: "Customer-First Service",
    desc: "From your first quote to the final delivery, we’re here to make the process easier.",
  },
  {
    num: "06",
    icon: FlexIcon,
    title: "Flexible Moving Solutions",
    desc: "Every move is different. We adapt our service to your home, office, timeline and needs.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section section--light">
      <div className="container">
        <Reveal className="section-head center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>
            Why Movers Rwanda
          </span>
          <h2>Finally, A Moving Company That Gets It.</h2>
        </Reveal>
        <div className="why-grid">
          {REASONS.map(({ num, icon: Icon, title, desc }) => (
            <Reveal className="why-card" key={num}>
              <span className="why-num">{num}</span>
              <div className="why-icon">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
