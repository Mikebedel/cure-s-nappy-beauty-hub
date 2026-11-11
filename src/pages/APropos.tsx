import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import { useContent } from "@/content/ContentProvider";
import { iconFor } from "@/content/icons";
import Highlight from "@/content/Highlight";
import RichText from "@/content/RichText";

const pillarColors = ["text-primary", "text-accent", "text-action"];

const APropos = () => {
  const page = useContent().content.about;
  return (
    <div className="min-h-screen">
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />

      {/* Histoire */}
      <section className="section">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="eyebrow">{page.story.eyebrow}</span>
          <h2 className="font-heading font-bold mt-3 mb-6"><Highlight title={page.story.title} highlight={page.story.highlight} /></h2>
          <RichText text={page.story.body} className="space-y-4 text-muted-foreground text-lg leading-relaxed" />
        </div>
      </section>

      {/* Vision, mission, valeurs */}
      {page.pillars.length > 0 && (
        <section className="section bg-secondary/60">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {page.pillars.map((pillar, i) => {
                const Icon = iconFor(pillar.icon);
                return (
                  <div key={`${pillar.title}-${i}`} className="surface text-center p-8">
                    <Icon className={`h-7 w-7 mx-auto mb-4 ${pillarColors[i % pillarColors.length]}`} strokeWidth={1.5} />
                    <h3 className="font-heading text-xl font-bold mb-3">{pillar.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{pillar.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Engagements */}
      {page.commitments.items.length > 0 && (
        <section className="section">
          <div className="container mx-auto text-center">
            <span className="eyebrow">{page.commitments.eyebrow}</span>
            <h2 className="font-heading font-bold mt-3 mb-10"><Highlight title={page.commitments.title} highlight={page.commitments.highlight} /></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {page.commitments.items.map((item, i) => {
                const Icon = iconFor(item.icon);
                return (
                  <div key={`${item.title}-${i}`} className="surface p-7">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Appel à l'action */}
      <section className="container mx-auto pb-8">
        <div className="rounded-[2rem] bg-primary text-primary-foreground text-center px-6 py-14 md:py-16">
          <h2 className="font-heading font-bold mb-6">{page.cta.title}</h2>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/boutique">{page.cta.label}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default APropos;
