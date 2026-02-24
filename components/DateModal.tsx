"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SymbolItem } from "@/types";

interface DateModalProps {
  open: boolean;
  dateKey: string | null;
  symbols: SymbolItem[];
  selectedSymbolIds: string[];
  onOpenChange: (open: boolean) => void;
  onToggleSymbol: (symbolId: string) => void;
  onClear: () => void;
}

export function DateModal({
  open,
  dateKey,
  symbols,
  selectedSymbolIds,
  onOpenChange,
  onToggleSymbol,
  onClear,
}: DateModalProps): JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dateKey ? `Update ${dateKey}` : "Choose date"}</DialogTitle>
        </DialogHeader>
        {symbols.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-white/70 p-4 text-sm text-plum/70">Add symbols first from "Manage Symbols".</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {symbols.map((symbol) => {
              const active = selectedSymbolIds.includes(symbol.id);
              return (
                <button
                  key={symbol.id}
                  type="button"
                  onClick={() => onToggleSymbol(symbol.id)}
                  className={`rounded-2xl border px-3 py-3 text-left transition ${
                    active
                      ? "border-plum bg-lavender/80 shadow"
                      : "border-white/80 bg-white/70 hover:border-plum/40 hover:bg-white"
                  }`}
                >
                  <p className="text-xl">{symbol.emoji}</p>
                  <p className="text-sm font-medium text-plum">{symbol.name}</p>
                </button>
              );
            })}
          </div>
        )}
        <div className="mt-5 flex justify-end">
          <Button variant="ghost" onClick={onClear}>
            Clear Date
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
