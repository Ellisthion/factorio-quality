export const machines: Machine[] = [
  {
    name: 'Assembler',
    icon: 'Assembling_machine_3',
    productivity: 0,
    moduleSlots: 4,
  },
  {
    name: 'Chem Plant',
    icon: 'Chemical_plant',
    productivity: 0,
    moduleSlots: 3
  },
  {
    name: 'EM Plant',
    icon: 'Electromagnetic_plant',
    productivity: 50,
    moduleSlots: 5,
  },
  {
    name: 'Foundry',
    icon: 'Foundry',
    productivity: 50,
    moduleSlots: 4
  },
  {
    name: 'Biochamber',
    icon: 'Biochamber',
    productivity: 50,
    moduleSlots: 4
  },
  {
    name: 'Cryo Plant',
    icon: 'Cryogenic_plant',
    productivity: 0,
    moduleSlots: 8
  }
];

export type Machine = {
  name: string,
  icon: string,
  productivity: number,
  moduleSlots: number
}