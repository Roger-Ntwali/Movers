import { Reveal } from "../ui/Reveal";
import { useInView } from "../../hooks/useInView";

const STEPS = [
  { num: "01", title: "Request A Quote", desc: "Tell us what you're moving and where you're going." },
  { num: "02", title: "Get Your Plan", desc: "We discuss your moving requirements and provide clear pricing." },
  { num: "03", title: "We Move", desc: "Our team arrives prepared and handles your belongings carefully." },
  { num: "04", title: "Settle In", desc: "We unload and help you get settled at your destination." },
];

function Step({ num, title, desc, initiallyActive }: { num: string; title: string; desc: string; initiallyActive?: boolean }) {
  const { ref, isVisible } = useInView<HTMLDivElement>({ threshold: 0.5 });
  const active = initiallyActive || isVisible;
  return (
    <div className={`step${active ? " is-active" : ""}`} ref={ref}>
      <div className="step-num">{num}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="section section--light">
      <div className="container">
        <Reveal className="section-head center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>
            The Process
          </span>
          <h2>How It Works</h2>
        </Reveal>
        <Reveal className="steps-wrap">
          <div className="steps-line">
            <div className="fill"></div>
          </div>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <Step key={step.num} {...step} initiallyActive={i === 0} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
