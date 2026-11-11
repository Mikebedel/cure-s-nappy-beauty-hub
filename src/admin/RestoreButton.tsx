import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/content/types";
import { useDraft } from "./DraftContext";

/** Remet une partie du site comme à l'origine (dans le brouillon : il faut encore enregistrer). */
const RestoreButton = ({ part, label }: { part: keyof SiteContent | (keyof SiteContent)[]; label: string }) => {
  const { restoreDefault } = useDraft();
  const parts = Array.isArray(part) ? part : [part];
  return (
    <Button type="button" variant="ghost" size="sm" onClick={() => {
      if (window.confirm(`Remettre ${label} comme à l'origine ? Vous pourrez encore annuler avant d'enregistrer.`)) parts.forEach(restoreDefault);
    }}>
      <RotateCcw />Contenu d'origine
    </Button>
  );
};

export default RestoreButton;
