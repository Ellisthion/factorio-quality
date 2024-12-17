export const machines: Machine[] = [
  {
    name: 'Assembler',
    productivity: 0,
    moduleSlots: 4,
  },
  {
    name: 'Chem Plant',
    productivity: 0,
    moduleSlots: 3
  },
  {
    name: 'EM Plant',
    productivity: 50,
    moduleSlots: 5,
  },
  {
    name: 'Foundry',
    productivity: 50,
    moduleSlots: 4
  },
  {
    name: 'Biochamber',
    productivity: 50,
    moduleSlots: 4
  },
  {
    name: 'Cryo Plant',
    productivity: 0,
    moduleSlots: 8
  }
];

export type Machine = {
  name: string,
  productivity: number,
  moduleSlots: number
}