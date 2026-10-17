import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import landingCss from "../landing/landing.css?url";
import pageHtml from "../landing/page.html?raw";

// A LP é HTML + CSS + JS vanilla (src/landing). O HTML vai no SSR como está e o
// main.js roda no navegador depois da hidratação, com o mesmo comportamento do
// site estático (idioma, segmentos, simulador, formulário → WhatsApp).
const title = "TeloVis Pro | Gestão para salões, barbearias e estética";
const description =
  "TeloVis Pro: caixa, comissões, relatórios, agenda e IA num sistema feito para salões de beleza, barbearias e clínicas de estética, com a sua marca. Do profissional autônomo à rede de unidades.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: "TeloVis Pro | Seu negócio, seu sistema." },
      {
        property: "og:description",
        content: "Gestão de verdade para salões, barbearias e estética. Vamos conversar sobre o seu.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://telovispro.com/" },
      { property: "og:image", content: "https://telovispro.com/assets/tl-logo.png" },
      { name: "theme-color", content: "#F7F4EC" },
    ],
    links: [
      { rel: "canonical", href: "https://telovispro.com/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: landingCss },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    void import("../landing/main.js");
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: pageHtml }} />;
}
