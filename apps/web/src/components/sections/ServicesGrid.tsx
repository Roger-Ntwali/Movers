import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { ArrowRightIcon } from "../ui/icons";
import { ImageCarousel } from "../ui/ImageCarousel";
import { useApiData } from "../../hooks/useApiData";
import type { Service } from "../../types";

const FALLBACK_SERVICES: Service[] = [
  {
    id: "home-moving",
    title: "Home Moving",
    slug: "home-moving",
    tag: "Service 01",
    lead: "Move your home without the stress.",
    description: null,
    includes: ["Furniture moving", "Household items", "Loading & unloading", "Local relocation"],
    imageUrls: [],
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "office-relocation",
    title: "Office Relocation",
    slug: "office-relocation",
    tag: "Service 02",
    lead: "Move your business while keeping your work moving.",
    description: null,
    includes: ["Office furniture", "Equipment", "Packing"],
    imageUrls: [],
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "packing-unpacking",
    title: "Packing & Unpacking",
    slug: "packing-unpacking",
    tag: "Service 03",
    lead: "Let our team handle the boxes.",
    description: null,
    includes: ["Packing", "Wrapping", "Labeling"],
    imageUrls: [],
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "furniture-assembly",
    title: "Furniture Assembly",
    slug: "furniture-assembly",
    tag: "Service 04",
    lead: "Move it. Set it up. Done.",
    description: null,
    includes: ["Disassembly", "Transportation", "Reassembly", "Furniture placement"],
    imageUrls: [],
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "specialty-moving",
    title: "Specialty Moving",
    slug: "specialty-moving",
    tag: "Service 05",
    lead: "For the things that need extra care.",
    description: null,
    includes: ["Large furniture", "Appliances", "Fragile items"],
    imageUrls: [],
    displayOrder: 5,
    isActive: true,
  },
];

export function ServicesGrid() {
  const { data: services } = useApiData<Service[]>("/api/services", FALLBACK_SERVICES);

  return (
    <section className="section" id="services">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Our Services</span>
          <h2>What Can We Move For You?</h2>
          <p>
            Whether you&rsquo;re changing homes, relocating an office or moving a few important
            items, our team is ready.
          </p>
        </Reveal>

        <div className="services-grid reveal-stagger">
          {services.map((service, i) => (
            <Reveal
              as="article"
              className={`service-card${i === 0 || i === 3 ? " is-wide" : ""}`}
              key={service.id}
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="service-bg">
                <ImageCarousel images={service.imageUrls} />
              </div>
              <span className="service-tag">{service.tag}</span>
              <h3>{service.title}</h3>
              {service.lead && <p className="lead">{service.lead}</p>}
              {service.includes.length > 0 && (
                <div className="service-includes">
                  {service.includes.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
              <Link to="/#quote" className="btn-ghost">
                Discover {service.title}
                <ArrowRightIcon />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
