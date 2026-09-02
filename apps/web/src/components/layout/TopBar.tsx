import { useSiteSettings } from "../../context/SiteSettingsContext";
import { ClockIcon, PhoneIcon } from "../ui/icons";

export function TopBar() {
  const settings = useSiteSettings();
  return (
    <div className="topbar">
      <div className="container">
        <div className="topbar-left">Reliable Moving Services Across Rwanda</div>
        <div className="topbar-right">
          <div className="topbar-hours">
            <ClockIcon />
            <span>{settings.hours}</span>
          </div>
          <a className="topbar-phone" href={`tel:${settings.phone}`}>
            <PhoneIcon />
            <span>{settings.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
