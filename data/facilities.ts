export interface Facility {
  id: string;
  title: string;
  desc: string;
  iconName: "cog" | "factory" | "microscope" | "wrench";
  imageUrl: string;
  sortOrder: number;
}

export const facilities: Facility[] = [
  {
    id: "cnc-machining",
    title: "CNC Machining Centers",
    desc: "High-precision multi-axis CNC turning and machining centers for complex geometries and tight tolerances.",
    iconName: "cog",
    imageUrl: "/facilities/cnc-machining.png",
    sortOrder: 1
  },
  {
    id: "vmc-edm",
    title: "VMC & EDM Machines",
    desc: "Advanced Vertical Machining Centers and Electrical Discharge Machining for precise die sinking and molding.",
    iconName: "factory",
    imageUrl: "/facilities/assembly.png", // Maps to the copied assembly image!
    sortOrder: 2
  },
  {
    id: "quality-inspection",
    title: "Quality & Inspection",
    desc: "Coordinate Measuring Machines (CMM) and digital metrology instruments ensuring absolute dimensional accuracy.",
    iconName: "microscope",
    imageUrl: "/facilities/quality-control.png",
    sortOrder: 3
  },
  {
    id: "tool-room",
    title: "Dedicated Tool Room",
    desc: "Fully equipped in-house tool room and maintenance facility for rapid prototyping and precision tool assembly.",
    iconName: "wrench",
    imageUrl: "/facilities/tool-room.png",
    sortOrder: 4
  },
  {
    id: "laser-engraving",
    title: "Laser Engraving",
    desc: "High-precision laser engraving for part specification, branding, and permanent component identification.",
    iconName: "cog",
    imageUrl: "/facilities/laser-engraving-new.jpg",
    sortOrder: 5
  }
];
