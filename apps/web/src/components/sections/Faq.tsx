import { useEffect, useRef, useState } from "react";
import { Reveal } from "../ui/Reveal";

const FAQS = [
  {
    q: "Is Movers Rwanda licensed and insured?",
    a: "We're happy to share our current licensing and insurance details on request — contact our team and we'll confirm exactly what applies to your move.",
  },
  {
    q: "How much does moving cost?",
    a: "Pricing depends on distance, volume, access at both locations, packing requirements and other factors. Request a free quote and we'll walk you through the details.",
  },
  {
    q: "When should I book my move?",
    a: "We recommend booking as early as possible, especially around weekends and month-end. Availability varies, so earlier requests give you more flexibility.",
  },
  {
    q: "Do you provide packing services?",
    a: "Yes. Our packing and unpacking service covers wrapping, boxing and labeling so your belongings are ready to move safely.",
  },
  {
    q: "Do you move offices?",
    a: "Yes, we handle office relocations including furniture, equipment and organized packing to keep downtime to a minimum.",
  },
  {
    q: "Do you move furniture between locations?",
    a: "Yes, including disassembly, transport, reassembly and placement at your new location.",
  },
  {
    q: "Do you move outside Kigali?",
    a: "Yes, we serve Kigali and surrounding districts. If your destination isn't listed, get in touch and we'll see how we can help.",
  },
  {
    q: "Can I get a quote without calling?",
    a: "Yes — use the online quote form above and our team will follow up with you directly.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Measured after mount/content changes, never read during render — the
  // answer's own scrollHeight reflects its full content regardless of the
  // parent's current max-height clamp, so this only needs to run once.
  useEffect(() => {
    if (answerRef.current) setHeight(answerRef.current.scrollHeight);
  }, [answer]);

  return (
    <div className={`faq-item${isOpen ? " is-open" : ""}`}>
      <button className="faq-q" onClick={onToggle} aria-expanded={isOpen}>
        <span>{question}</span>
        <span className="plus"></span>
      </button>
      <div className="faq-a" ref={answerRef} style={{ maxHeight: isOpen ? `${height}px` : undefined }}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section section--light" id="faq">
      <div className="container">
        <Reveal className="section-head center">
          <span className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>
            FAQ
          </span>
          <h2>Questions? We&rsquo;ve Got Answers.</h2>
        </Reveal>
        <Reveal className="faq-list">
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.q}
              question={item.q}
              answer={item.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
