import React from "react";
import ContactCTAButton from "./ContactCTAButton";

interface Props {
  whatsappLink: string;
}
const WhatsAppCTAButton: React.FC<Props> = ({ whatsappLink }) => {
  if (!whatsappLink) return null;
  return <ContactCTAButton type="whatsapp" href={whatsappLink} />;
};

export default WhatsAppCTAButton;
