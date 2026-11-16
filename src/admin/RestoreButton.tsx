import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/content/types";
import { useDraft } from "./DraftContext";
import { useConfirm } from "./useConfirm";

/** Remet une partie du site comme à l'origine (dans le brouillon : il faut encore enregistrer). */
const RestoreButton = ({ part, label }: { part: keyof SiteContent | (keyof SiteContent)[]; label: string }) => {
  const { restoreDefault } = useDraft();
  const parts = Array.isArray(part) ? part : [part];
  const { confirm, dialog } = useConfirm();
  return (
    <>
      <Button type="button" variant="ghost" size="sm" onClick={async () => {
        if (await confirm({ title: `Remettre ${label} comme à l'origine ?`, description: "Vous pourrez encore annuler avant d'enregistrer.", confirmLabel: "Remettre" })) parts.forEach(restoreDefault);
      }}>
        <RotateCcw />Contenu d'origine
      </Button>
      {dialog}
    </>
  );
};

export default RestoreButton;
