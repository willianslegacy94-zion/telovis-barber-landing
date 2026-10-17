import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TeloVis Pro" },
      { name: "description", content: "TeloVis Pro" },
      { property: "og:title", content: "TeloVis Pro" },
      { property: "og:description", content: "TeloVis Pro" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <div className="min-h-screen bg-background" />;
}
