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
    desc: "No confusing surprises — clear pricing, explained before you commit.",
  },
  {
    num: "02",
    icon: ClockIcon,
    title: "Move On Time",
    desc: "We respect your schedule and arrive when promised.",
  },
  {
    num: "03",
    icon: ShieldIcon,
    title: "Careful Handling",
    desc: "Furniture, electronics and belongings — handled with real care.",
  },
  {
    num: "04",
    icon: TeamIcon,
    title: "Professional Team",
    desc: "Friendly, trained movers who pack, lift and transport safely.",
  },
  {
    num: "05",
    icon: HeartHandsIcon,
    title: "Customer-First Service",
    desc: "From first quote to final delivery, we make it easier.",
  },
  {
    num: "06",
    icon: FlexIcon,
    title: "Flexible Moving Solutions",
    desc: "Every move is different — we adapt to fit yours.",
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
        <div className="why-grid reveal-stagger">
          {REASONS.map(({ num, icon: Icon, title, desc }, i) => (
            <Reveal className="why-card" key={num} style={{ "--i": i } as React.CSSProperties}>
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
