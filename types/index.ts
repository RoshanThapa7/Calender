export interface SymbolItem {
  id: string;
  emoji: string;
  name: string;
}

export type DateEntries = Record<string, string[]>;

export interface StorageData {
  symbols: SymbolItem[];
  dateEntries: DateEntries;
}
