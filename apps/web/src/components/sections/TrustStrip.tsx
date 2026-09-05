import { Reveal } from "../ui/Reveal";
import { ClockIcon, InvoiceIcon, ShieldIcon, TeamIcon } from "../ui/icons";

const ITEMS = [
  { icon: ShieldIcon, title: "Careful Handling", desc: "Every item treated with respect" },
  { icon: InvoiceIcon, title: "Transparent Pricing", desc: "Clear costs, no surprises" },
  { icon: TeamIcon, title: "Professional Team", desc: "Trained, courteous movers" },
  { icon: ClockIcon, title: "On-Time Service", desc: "We respect your schedule" },
];

export function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="container">
        <div className="trust-grid reveal-stagger">
          {ITEMS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal className="trust-item" key={title} style={{ "--i": i } as React.CSSProperties}>
              <span className="ic">
                <Icon size={20} />
              </span>
              <div>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
