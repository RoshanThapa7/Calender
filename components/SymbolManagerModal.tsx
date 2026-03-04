"use client";

import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SymbolItem } from "@/types";

interface SymbolManagerModalProps {
  open: boolean;
  symbols: SymbolItem[];
  onOpenChange: (open: boolean) => void;
  onAddSymbol: (emoji: string, name: string) => void;
  onDeleteSymbol: (id: string) => void;
}

export function SymbolManagerModal({
  open,
  symbols,
  onOpenChange,
  onAddSymbol,
  onDeleteSymbol,
}: SymbolManagerModalProps): JSX.Element {
  const [name, setName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💖");
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = (): void => {
    if (!name.trim()) return;
    onAddSymbol(selectedEmoji, name.trim());
    setName("");
    setSelectedEmoji("💖");
    setShowPicker(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData): void => {
    setSelectedEmoji(emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Symbols</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl bg-white/75 p-4">
            <div className="mb-3 flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowPicker((prev) => !prev)}>
                Pick Emoji {selectedEmoji}
              </Button>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Symbol name (e.g. Happy Day)"
              />
              <Button type="button" onClick={handleSave}>
                Save
              </Button>
            </div>
            {showPicker && (
              <div className="overflow-hidden rounded-2xl border border-white/80">
                <EmojiPicker onEmojiClick={handleEmojiClick} searchPlaceHolder="Search cute symbols..." />
              </div>
            )}
          </div>

          <div className="space-y-2">
            {symbols.length === 0 ? (
              <p className="text-sm text-plum/70">No symbols added yet.</p>
            ) : (
              symbols.map((symbol) => (
                <div key={symbol.id} className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3">
                  <div className="text-plum">
                    <span className="mr-2 text-xl">{symbol.emoji}</span>
                    <span className="font-medium">{symbol.name}</span>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => onDeleteSymbol(symbol.id)}>
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
