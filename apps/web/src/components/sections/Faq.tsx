import { useEffect, useRef, useState } from "react";
import { Reveal } from "../ui/Reveal";

const FAQS = [
  {
    q: "Is Movers Rwanda licensed and insured?",
    a: "We're happy to share our licensing and insurance details on request — just contact our team.",
  },
  {
    q: "How much does moving cost?",
    a: "Cost depends on distance, volume, access and packing needs. Request a free quote for exact details.",
  },
  {
    q: "When should I book my move?",
    a: "As early as you can, especially around weekends and month-end — earlier requests mean more flexibility.",
  },
  {
    q: "Do you provide packing services?",
    a: "Yes — wrapping, boxing and labeling, so everything's ready to move safely.",
  },
  {
    q: "Do you move offices?",
    a: "Yes, including furniture, equipment and organized packing to minimize downtime.",
  },
  {
    q: "Do you move furniture between locations?",
    a: "Yes — disassembly, transport, reassembly and placement, all included.",
  },
  {
    q: "Do you move outside Kigali?",
    a: "Yes, Kigali and surrounding districts. Not listed? Get in touch and we'll find a way.",
  },
  {
    q: "Can I get a quote without calling?",
    a: "Yes — use the quote form above and we'll follow up directly.",
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
