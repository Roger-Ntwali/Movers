import { Hero } from "../components/sections/Hero";
import { QuoteForm } from "../components/sections/QuoteForm";
import { TrustStrip } from "../components/sections/TrustStrip";
import { About } from "../components/sections/About";
import { WhyChooseUs } from "../components/sections/WhyChooseUs";
import { ServicesGrid } from "../components/sections/ServicesGrid";
import { HowItWorks } from "../components/sections/HowItWorks";
import { ServiceAreaMap } from "../components/sections/ServiceAreaMap";
import { Editorial } from "../components/sections/Editorial";
import { Testimonials } from "../components/sections/Testimonials";
import { Gallery } from "../components/sections/Gallery";
import { BlogTeaser } from "../components/sections/BlogTeaser";
import { Faq } from "../components/sections/Faq";
import { FinalCta } from "../components/sections/FinalCta";

export function HomePage() {
  return (
    <>
      <Hero />
      <QuoteForm />
      <TrustStrip />
      <About />
      <WhyChooseUs />
      <ServicesGrid />
      <HowItWorks />
      <ServiceAreaMap />
      <Editorial />
      <Testimonials />
      <Gallery />
      <BlogTeaser />
      <Faq />
      <FinalCta />
    </>
  );
}
