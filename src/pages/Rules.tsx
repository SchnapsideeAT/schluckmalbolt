import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ScrollableContainer } from "@/components/ScrollableContainer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Rules = () => {
  const navigate = useNavigate();

  return (
    <ScrollableContainer>
      <div className="content-container">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold">Spielregeln</h1>
          </div>

          <div className="space-y-6 sm:space-y-8 slide-up">
          {/* Categories */}
          <section className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="standard-deck" className="bg-card border border-border/50 rounded-xl">
                <AccordionTrigger className="hover:no-underline py-5 px-6 transition-all duration-1000">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-primary" />
                    <span className="text-xl font-bold text-foreground">Standard Deck</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="transition-all duration-1000 ease-in-out data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="grid gap-4 md:grid-cols-2 px-3 pb-6">
                    <div className="bg-background border border-category-task/50 rounded-xl p-5 space-y-2">
                      <div className="flex items-center gap-3 mb-2">
                        <CategoryIcon category="Aufgabe" className="w-6 h-6" />
                        <h3 className="text-xl font-semibold text-category-task">Aufgabe</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Der Spieler muss eine Herausforderung meistern oder trinken.
                      </p>
                    </div>

                    <div className="bg-background border border-category-group/50 rounded-xl p-5 space-y-2">
                      <div className="flex items-center gap-3 mb-2">
                        <CategoryIcon category="Gruppe" className="w-6 h-6" />
                        <h3 className="text-xl font-semibold text-category-group">Gruppe</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Alle Spieler sind betroffen und müssen gemeinsam Aufgaben bewältigen.
                      </p>
                    </div>

                    <div className="bg-background border border-category-duel/50 rounded-xl p-5 space-y-2">
                      <div className="flex items-center gap-3 mb-2">
                        <CategoryIcon category="Duell" className="w-6 h-6" />
                        <h3 className="text-xl font-semibold text-category-duel">Duell</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Der Spieler wählt einen Gegner für einen Wettkampf. Der Verlierer trinkt.
                      </p>
                    </div>

                    <div className="bg-background border border-category-wildcard/50 rounded-xl p-5 space-y-2">
                      <div className="flex items-center gap-3 mb-2">
                        <CategoryIcon category="Wildcard" className="w-6 h-6" />
                        <h3 className="text-xl font-semibold text-category-wildcard">Wild Cards</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Spezialkarten mit einzigartigen Effekten, die das Spiel beeinflussen können.
                      </p>
                    </div>

                    <div className="bg-background border border-category-truth/50 rounded-xl p-5 space-y-2 md:col-span-2">
                      <div className="flex items-center gap-3 mb-2">
                        <CategoryIcon category="Wahrheit" className="w-6 h-6" />
                        <h3 className="text-xl font-semibold text-category-truth">Wahrheit</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Der Spieler muss eine Frage ehrlich beantworten oder trinken.
                      </p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong className="text-foreground">Unterkategorie:</strong></p>
                        <p>• „Ich habe noch nie": Wer die genannte Aktion bereits gemacht hat, muss trinken.</p>
                        <p>• „Wählt den": Die Gruppe wählt eine Person, die trinken muss.</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Basic rules */}
          <section className="space-y-4">
            <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-primary">Grundregeln</h2>
              <div className="text-muted-foreground space-y-3">
                <div>
                  <strong className="text-foreground">Karte ziehen</strong>
                  <p className="mt-1">• Lies die Karte laut vor.</p>
                  <p className="mt-1">• Entscheide dich für eine Option.</p>
                  
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong className="text-foreground">Option 1 – Aufgabe annehmen</strong>
                      <p className="mt-1">• Schaffst du die Aufgabe nicht, trinke die angegebene Anzahl an Schlücke.</p>
                    </div>

                    <div>
                      <strong className="text-foreground">Option 2 – Aufgabe verweigern</strong>
                      <p className="mt-1">• Trinke die angegebene Anzahl an Schlücke (oben und unten in der Ecke angegeben).</p>
                    </div>
                  </div>
                </div>

                <div>
                  <strong className="text-foreground">Weitergeben</strong>
                  <p className="mt-1">• Nach Abschluss der Aufgabe oder des Trinkens wird das Handy an den nächsten Spieler weitergegeben, der dann eine Karte zieht.</p>
                </div>

                <div>
                  <strong className="text-foreground">Ende des Spiels</strong>
                  <p className="mt-1">• Das Spiel endet, wenn alle Karten gespielt wurden oder die Gruppe keine Lust mehr hat.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Additional rules */}
          <section className="space-y-4">
            <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
              <h2 className="text-2xl font-bold text-primary">Zusätzliche Regeln</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">•</span>
                <span><strong className="text-foreground">Joker:</strong> Wild Cards dürfen jederzeit während des Spiels eingesetzt werden.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">•</span>
                <span><strong className="text-foreground">No-Chill-Regel:</strong> Bei Unklarheiten entscheidet die Gruppe demokratisch.</span>
              </li>
              </ul>
            </div>
          </section>

          {/* Important notes */}
          <section className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 space-y-3">
            <h2 className="text-2xl font-bold text-destructive">Wichtige Hinweise</h2>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold mt-1">⚠</span>
                <span>Spielt verantwortungsvoll und kennt eure Grenzen!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold mt-1">⚠</span>
                <span>Niemand wird gezwungen, Alkohol zu trinken. Respektiert gegenseitige Grenzen.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold mt-1">⚠</span>
                <span>Fahrt niemals unter Alkoholeinfluss!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold mt-1">⚠</span>
                <span>Sorgt dafür, dass ausreichend Wasser und alkoholfreie Getränke verfügbar sind.</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </ScrollableContainer>
  );
};

export default Rules;
