import { Outlet } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { WhatsAppButton } from "../components/layout/WhatsAppButton";
import { MobileCtaBar } from "../components/layout/MobileCtaBar";
import { ScrollToHash } from "../components/layout/ScrollToHash";

export function PublicLayout() {
  return (
    <>
      <ScrollToHash />
      <TopBar />
      <Header />
      <main id="top">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileCtaBar />
    </>
  );
}
