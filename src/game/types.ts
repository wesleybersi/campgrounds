import { Builder } from "./scenes/Main/entities/Staff/force/Builder/Builder";

export type Cardinal = "top" | "bottom" | "left" | "right";
export type Direction = "up" | "down" | "left" | "right";

export type Vector = { x: number; y: number };
export type Position = { col: number; row: number };

// export interface Task {
//   name: string;
//   location: Vector;
//   progress: number;
//   agent: Agent | null;
//   completed: boolean;
// }

//    "Linear"
// ("Quad.In");
// ("Quad.Out");
// ("Quad.InOut");
// ("Cubic.In");
// ("Cubic.Out");
// ("Cubic.InOut");
// ("Quart.In");
// ("Quart.Out");
// ("Quart.InOut");
// ("Quint.In");
// ("Quint.Out");
// ("Quint.InOut");
// ("Sine.In");
// ("Sine.Out");
// ("Sine.InOut");
// ("Expo.In");
// ("Expo.Out");
// ("Expo.InOut");
// ("Circ.In");
// ("Circ.Out");
// ("Circ.InOut");
// ("Elastic.In");
// ("Elastic.Out");
// ("Elastic.InOut");
// ("Back.In");
// ("Back.Out");
// ("Back.InOut");
// ("Bounce.In");
// ("Bounce.Out");
// ("Bounce.InOut");

// ANCHOR - Used to indicate a section in your file
// TODO - An item that is awaiting completion
// FIXME - An item that requires a bugfix
// STUB - Used for generated default snippets
// NOTE - An important note for a specific code section
// REVIEW - An item that requires additional review
// SECTION - Used to define a region (See 'Hierarchical anchors')
// LINK - Used to link to a file that can be opened within the editor (See 'Link Anchors')
