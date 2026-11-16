import { ReactNode, useCallback, useRef, useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  /** Bouton rouge pour une suppression. */
  destructive?: boolean;
}

/**
 * Demande de confirmation dans la page (et non la fenêtre du navigateur, que certains
 * navigateurs intégrés ou téléphones bloquent sans rien afficher : le bouton semblait alors ne rien faire).
 * Usage : const { confirm, dialog } = useConfirm(); … if (await confirm({ title })) … ; et rendre {dialog}.
 */
export const useConfirm = () => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(value: boolean) => void>();

  const confirm = useCallback((next: ConfirmOptions) => {
    resolver.current?.(false);
    setOptions(next);
    return new Promise<boolean>((resolve) => { resolver.current = resolve; });
  }, []);

  const close = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = undefined;
    setOptions(null);
  };

  const dialog: ReactNode = (
    <AlertDialog open={options !== null} onOpenChange={(open) => { if (!open) close(false); }}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{options?.title}</AlertDialogTitle>
          {options?.description && <AlertDialogDescription>{options.description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => close(false)}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={() => close(true)}
            className={options?.destructive ? buttonVariants({ variant: "destructive" }) : undefined}>
            {options?.confirmLabel ?? "Confirmer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, dialog };
};
