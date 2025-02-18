import Dexie, { Table } from 'dexie';

export interface Spell {
  index: string;
  name: string;
  level: number;
  url: string;
}

export interface SpellDetail {
  index: string;
  name: string;
  desc: string[];
  higher_level?: string[];
  range: string;
  components: string[];
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  school: {
    index: string;
    name: string;
    url: string;
  };
  classes: {
    index: string;
    name: string;
    url: string;
  }[];
  subclasses: {
    index: string;
    name: string;
    url: string;
  }[];
  url: string;
  updated_at: string;
}

export class SpellsDB extends Dexie {
  spells!: Table<Spell, string>;
  spellDetails!: Table<SpellDetail, string>;

  constructor() {
    super('SpellsDB');
    this.version(1).stores({
      spells: 'index, name, level, url',
      spellDetails: 'index, name'
    });
  }
}

export const db = new SpellsDB();