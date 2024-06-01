export interface TreeType {
  name: string;
  maxHarvest: number;
  sprites: {
    // spring: { main: string; alt: string };
    summer: {
      main: string;
      alt?: string;
    };
    // autumn: { main: string; alt: string };
    // winter: { main: string; alt: string };
  };
}

const a: TreeType[] = [
  {
    name: "a1",
    maxHarvest: 25,
    sprites: {
      summer: {
        main: "tree-a1",
      },
    },
  },
  {
    name: "a1",
    maxHarvest: 50,
    sprites: {
      summer: {
        main: "tree-a1",
      },
    },
  },
];
