export interface ProductFaq {
  q: string;
  a: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: {
    name: string;
    slug: string;
  };
  description: string;
  overview?: string; // Longer, standalone intro paragraph for the product page
  applications: string;
  applicationsList?: string[]; // Structured list of application areas
  specs: Record<string, string>;
  features?: string[]; // Key technical features as bullet points
  keyAdvantages?: string[]; // Differentiators vs generic alternatives
  industries?: string[]; // Target industries
  material?: string;
  tolerance?: string;
  surfaceFinish?: string;
  customization?: string;
  availableSizes?: string;
  qualityNote?: string;
  faqs?: ProductFaq[];
  images: { url: string; alt?: string }[];
  isPublished: boolean;
  sortOrder: number;
}

export const products: Product[] = [
  {
    id: "core-pin",
    slug: "core-pin",
    name: "Core Pin",
    category: {
      name: "Pins",
      slug: "pins"
    },
    description: "Core pins used to create holes in diecasting are fitted & part of a diecasting mold. Precisely machined and ground custom pins are made from high quality DIN 1.2344 / AISI H-13. Vacuum Heat treatment, nitriding & coating enhances life of the core pins. Reduce breakdown by use of long life VYANKATESH core pin.",
    overview: "Vyankatesh Engineering's Core Pins are precision-ground, heat-treated components designed to form internal holes and cavities within die casting molds. Manufactured from premium DIN 1.2344 (AISI H-13) hot-work tool steel, each pin undergoes vacuum hardening, nitriding, and optional PVD coating to achieve the hardness and thermal stability required for sustained high-cycle die casting production. Our core pins are engineered to minimize breakdown time, reduce replacement frequency, and maintain dimensional integrity across tens of thousands of casting cycles.",
    applications: "Core formations in automotive engine blocks, complex industrial housings, and precision aluminum components.",
    applicationsList: [
      "Forming precise cylindrical and non-circular holes in aluminum die castings",
      "Engine block and cylinder head core formations",
      "Transmission housings and gearbox covers",
      "Complex industrial housing cavities",
      "Structural automotive brackets and mounting features"
    ],
    specs: {
      "Material": "DIN 1.2344 / AISI H-13 Hot Work Tool Steel",
      "Hardness": "44–48 HRC (post heat treatment)",
      "Heat Treatment": "Vacuum hardening with controlled gas quenching",
      "Surface Treatment": "Nitriding & PVD Coating (options available)",
      "Straightness Tolerance": "≤ 0.01mm per 100mm length",
      "Finish": "Ground & polished to Ra ≤ 0.4μm",
      "Manufacturing": "CNC Turning, Precision Grinding, EDM where required"
    },
    features: [
      "Manufactured from certified DIN 1.2344 / AISI H-13 billet for maximum thermal fatigue resistance",
      "Vacuum heat treatment ensures uniform hardness throughout the cross-section",
      "Nitriding creates a hard, wear-resistant surface layer that extends service life",
      "Precision-ground to tight dimensional tolerances for consistent hole formation",
      "Custom diameters, lengths, and flange configurations manufactured to drawing",
      "Surface finish optimized to minimize metal sticking and ease ejection",
      "PVD coating applied by trusted partners with thoroughly checked results to increase wear and tear resistance and extend durability"
    ],
    keyAdvantages: [
      "Significantly reduced breakdown time compared to standard market pins",
      "Controlled heat treatment eliminates distortion during hardening",
      "Strictly managed end-to-end manufacturing from raw material ensures full quality traceability",
      "Available with optional anti-seizure coatings for high-silicon aluminum alloys"
    ],
    industries: ["Automotive", "Electrical & Electronics", "General Engineering", "Aerospace", "Industrial Machinery"],
    material: "DIN 1.2344 / AISI H-13 Hot Work Tool Steel",
    tolerance: "Diameter tolerance: h6 to h8 per customer requirement. Straightness: ≤ 0.01mm / 100mm.",
    surfaceFinish: "Nitriding (0.1–0.15mm case depth) + optional PVD hard coating. Ground to Ra ≤ 0.4μm.",
    customization: "Custom diameters (from 2mm upward), custom lengths, stepped profiles, threaded shanks, and special flange designs per customer drawing.",
    availableSizes: "Standard diameters from 2mm to 80mm. Custom lengths up to 600mm. Non-standard cross-sections available on request.",
    qualityNote: "Each core pin is individually measured and recorded for diameter, length, straightness, and surface hardness before dispatch. Precision blue matching on VMCs ensures dimensional accuracy.",
    faqs: [
      {
        q: "What steel grade do you use for core pins and why?",
        a: "We use DIN 1.2344 / AISI H-13 hot-work tool steel. This grade is the industry standard for die casting tooling due to its exceptional thermal fatigue resistance, hot hardness retention, and toughness at elevated temperatures — precisely what is needed in the thermal cycling environment of a die casting machine."
      },
      {
        q: "Can you manufacture core pins to my existing drawing or sample?",
        a: "Yes. We manufacture entirely to customer-supplied drawings, CAD files, or physical samples. We can reverse-engineer worn or damaged pins if a drawing is not available."
      },
      {
        q: "How does nitriding extend the life of a core pin?",
        a: "Nitriding diffuses nitrogen into the steel surface, creating a hard compound layer and diffusion zone that significantly increases surface hardness (typically 900–1200 HV), wear resistance, and fatigue strength — without compromising the toughness of the core material."
      },
      {
        q: "What is your minimum order quantity?",
        a: "We do not impose a strict minimum. We manufacture from single prototype pins to bulk production runs. Contact us for specific quantity pricing."
      }
    ],
    images: [
      { url: "/products/core-pin-set.png", alt: "Vyankatesh Engineering Core Pin Set — DIN 1.2344 H-13" }
    ],
    isPublished: true,
    sortOrder: 1
  },

  {
    id: "jet-cool-core-pin",
    slug: "jet-cool-core-pin",
    name: "Jet Cool Core Pin",
    category: {
      name: "Pins",
      slug: "pins"
    },
    description: "Jet cooled (JC) core pins are an integral & most important part of the jetcool system. Casters prefer VYANKATESH JC Core pins for their life and deep hole concentricity. Custom made pins go through stringent quality checks to ensure straightness of holes & dimensions. Surface treatments like Nitriding & coating ensures higher life.",
    overview: "The Jet Cool Core Pin is a precision-engineered, internally-cooled component designed to eliminate hot-spot failures in high-pressure die casting (HPDC) molds. By directing a controlled flow of high-pressure water through a precisely drilled concentric bore, the jet cooler assembly delivers cooling directly to the most thermally stressed zone of the pin. Vyankatesh Engineering's JC Core Pins are renowned among casters for their deep-hole concentricity and extended service life.",
    applications: "Hot-spot core zones in high-pressure die casting dies.",
    applicationsList: [
      "Cooling critical hot zones in HPDC molds",
      "Slender core pin applications where surface cooling alone is insufficient",
      "High-volume automotive part production where cycle time and pin life are critical",
      "Deep-cavity formations in engine block and transmission dies"
    ],
    specs: {
      "Inner Bore (Min Dia)": "3 mm",
      "Max Length": "600 mm",
      "Min Casting Diameter": "4.5 mm",
      "Material": "DIN 1.2344 / AISI H-13",
      "Surface Treatment": "Nitriding & PVD Coating (options available)",
      "Concentricity": "Bore concentricity ≤ 0.015mm TIR",
      "Quality Control": "100% dimensional inspection — straightness, bore concentricity, wall thickness"
    },
    features: [
      "Precisely drilled internal bore for direct jet cooling to the critical hot zone",
      "Minimum bore diameter of 3mm enabling use in very slender pins (from 4.5mm casting dia.)",
      "Gun drilling up to 600mm length with guaranteed deep-hole concentricity",
      "Manufactured from DIN 1.2344 H-13 for combined strength and thermal conductivity",
      "Stringent in-process quality checks at every stage — gun drilling, turning, grinding, and surface treatment",
      "Compatible with all major jet cooler assemblies including Vyankatesh's own 4-variant Jet Cooler",
      "PVD coating applied by trusted partners with thoroughly checked results to increase wear and tear resistance and extend durability"
    ],
    keyAdvantages: [
      "Directly addresses the most common cause of HPDC core pin failure — heat accumulation",
      "Deep-hole concentricity maintained to 0.015mm TIR, preventing wall collapse at high pressure",
      "Reduces shrinkage porosity in thick sections by improving directional solidification",
      "Shorter cycle times possible due to faster and more effective cooling"
    ],
    industries: ["Automotive (HPDC)", "Motorcycle & Two-Wheeler", "Industrial Machinery", "Electrical Enclosures"],
    material: "DIN 1.2344 / AISI H-13 Hot Work Tool Steel",
    tolerance: "Bore concentricity ≤ 0.015mm TIR. Outer diameter tolerance: h6 to h8.",
    surfaceFinish: "Nitriding + optional PVD coating. Bore surface ground to Ra ≤ 0.8μm.",
    customization: "Custom outer diameters, bore diameters, lengths, and threaded or flanged shank configurations manufactured per drawing.",
    availableSizes: "Inner bore from 3mm; outer (casting) diameter from 4.5mm; up to 600mm length.",
    qualityNote: "Every JC Core Pin undergoes 100% inspection: bore concentricity check, wall thickness measurement, outer diameter verification, and straightness testing before dispatch.",
    faqs: [
      {
        q: "What is the minimum casting diameter for a Jet Cool Core Pin?",
        a: "The minimum casting (outer) diameter we manufacture is 4.5mm, with an internal bore from 3mm diameter. This allows effective jet cooling even in very slender pins."
      },
      {
        q: "How critical is bore concentricity in a JC Core Pin?",
        a: "Extremely critical. If the bore is eccentric, the wall thickness becomes uneven. Under the operating pressure of jet cooling water (typically 5–15 bar), an eccentric bore can lead to pin failure. We guarantee bore concentricity ≤ 0.015mm TIR."
      },
      {
        q: "Can I use your JC Core Pin with my existing jet cooler manifold?",
        a: "Yes. We can manufacture the pin connection end to match your existing manifold specification. Simply provide us with the connection details or a sample pin."
      }
    ],
    images: [
      { url: "/products/jet-cool-core-pins.png", alt: "Jet Cool Core Pin set — internally cooled for HPDC hot spots" },
      { url: "/products/long-jet-cool-core-pin.png", alt: "Long Jet Cool Core Pin for deep cavity cooling up to 600mm" }
    ],
    isPublished: true,
    sortOrder: 2
  },

  {
    id: "jet-cool-profile-pin",
    slug: "jet-cool-profile-pin",
    name: "Jet Cool Profile Pin",
    category: {
      name: "Pins",
      slug: "pins"
    },
    description: "High-precision jet cooled profile pins engineered for specific molding applications, delivering efficient heat dissipation for complex geometries.",
    overview: "The Jet Cool Profile Pin combines the precise form of a profiled core pin with integrated internal jet cooling. Where a standard round pin cannot form the required geometry, or where a unique cross-sectional profile is required in the die cavity, Vyankatesh Engineering's Profile Pins provide the answer. Each pin is machined to exact profile dimensions, with the internal cooling bore carefully positioned to maximise heat extraction from the thinnest wall sections.",
    applications: "Custom profiles requiring localized cooling in molds.",
    applicationsList: [
      "Non-circular or profiled hole formations in HPDC dies",
      "Fins, webs, and boss features with critical cooling requirements",
      "Complex geometry mold zones requiring both shape accuracy and thermal management",
      "Intricate automotive casting features where standard round pins are unsuitable"
    ],
    specs: {
      "Material": "DIN 1.2344 / AISI H-13",
      "Surface Treatment": "Nitriding & PVD Coating (options available)",
      "Profile Accuracy": "Machined and ground to customer profile drawing",
      "Cooling": "Integrated internal jet cooling bore",
      "Manufacturing": "CNC + Wire EDM + Precision Grinding"
    },
    features: [
      "Custom profile forms machined using CNC milling, wire EDM, and precision grinding",
      "Internal jet cooling bore positioned for maximum thermal benefit",
      "Manufactured from certified DIN 1.2344 H-13 for thermal fatigue resistance",
      "Nitriding provides wear resistance on all profiled surfaces",
      "End-to-end quality management ensures profile accuracy is never compromised",
      "PVD coating applied by trusted partners with thoroughly checked results to increase wear and tear resistance and extend durability"
    ],
    keyAdvantages: [
      "Addresses cooling challenge in non-round core features that cannot use standard round pins",
      "Single-component solution combines form and cooling function",
      "Precision wire EDM capability ensures complex profile accuracy",
      "Eliminates the need for secondary cooling circuits around complex features"
    ],
    industries: ["Automotive", "Industrial Machinery", "Electrical Components", "General Engineering"],
    material: "DIN 1.2344 / AISI H-13 Hot Work Tool Steel",
    tolerance: "Profile ground to customer drawing tolerance. Typically ±0.01mm on critical dimensions.",
    surfaceFinish: "Nitriding across all profiled surfaces + optional PVD coating.",
    customization: "Any cross-sectional profile can be manufactured per customer 2D drawing or 3D model. Cooling bore positioning is optimized during the design review stage.",
    qualityNote: "Profile pins are 100% inspected against customer drawing using precision CMM measurement. Complex profiles are blue-matched to the corresponding die feature before dispatch.",
    faqs: [
      {
        q: "What types of profiles can you manufacture?",
        a: "We can manufacture any profile that can be defined in a 2D drawing or 3D model — including D-shapes, flats, keyways, slots, fins, and fully custom external shapes. Wire EDM and profile grinding give us broad capability."
      },
      {
        q: "How is the internal bore positioned in a non-round pin?",
        a: "The cooling bore position is reviewed during the design stage to ensure adequate wall thickness remains on all sides after drilling. For very complex profiles, we discuss the optimal bore position with the customer before manufacture."
      }
    ],
    images: [
      { url: "/products/jet-cool-profile-pin.png", alt: "Jet Cool Profile Pin — custom cross-section with internal cooling" },
      { url: "/products/profile-pin.png", alt: "Profile Pin for die casting — special cross section" },
      { url: "/gallery/profile-pins.png", alt: "Set of various profile pins manufactured by Vyankatesh Engineering" },
      { url: "/gallery/jet-cooler-with-profile-pin.png", alt: "Jet cooler assembled with profile pin for hot-spot cooling" }
    ],
    isPublished: true,
    sortOrder: 3
  },

  {
    id: "jet-cool-profile-core-pin",
    slug: "jet-cool-profile-core-pin",
    name: "Jet Cool Profile Core Pin",
    category: {
      name: "Pins",
      slug: "pins"
    },
    description: "Combined profile and core pin features with integrated jet cooling, providing maximum performance for challenging high-pressure die casting zones.",
    overview: "The Jet Cool Profile Core Pin is the most technically demanding product in the pin family — combining a profiled external form, internal core-forming geometry, and an integrated jet cooling channel in a single precision-machined component. It is designed for die casting zones where space is constrained, where a specific core form must be produced, and where thermal management is critical to part quality and cycle time.",
    applications: "Complex hot-spot core zones requiring specific profiles.",
    applicationsList: [
      "Multi-function die zones requiring simultaneous profiling and core formation",
      "Constrained die geometries where separate cooling circuits are not feasible",
      "High-thermal-load zones in HPDC dies with complex internal features"
    ],
    specs: {
      "Material": "DIN 1.2344 / AISI H-13",
      "Surface Treatment": "Nitriding & PVD Coating (options available)",
      "Cooling": "Integrated jet cooling channel",
      "Manufacturing": "CNC, Wire EDM, Deep Hole Drilling, Profile Grinding"
    },
    features: [
      "Three functions in one precision component: profiled external form, internal core, and jet cooling",
      "Manufactured using multi-process precision machining: CNC, EDM, deep-hole drilling, and profile grinding",
      "DIN 1.2344 H-13 material chosen for extreme thermal and mechanical load resistance",
      "Fully custom-manufactured to customer drawing — no standard sizes",
      "Nitriding applied for surface wear resistance, extending pin life in harsh casting environments",
      "100% dimensional inspection including internal bore, external profile, and overall geometry",
      "PVD coating applied by trusted partners with thoroughly checked results to increase wear and tear resistance and extend durability"
    ],
    keyAdvantages: [
      "Replaces complex multi-part assemblies with a single, more reliable component",
      "Reduces die assembly complexity and potential leak points in the cooling circuit",
      "Comprehensive design and manufacturing capability for complex, multi-feature pins"
    ],
    industries: ["Automotive HPDC", "Industrial Equipment", "Two-Wheeler Manufacturing"],
    material: "DIN 1.2344 / AISI H-13 Hot Work Tool Steel",
    tolerance: "Per customer drawing. Complex features measured by CMM.",
    surfaceFinish: "Nitriding + optional PVD coating. Ground to customer surface finish specification.",
    customization: "Fully custom per drawing. External profile, internal core geometry, cooling bore position and diameter all specified by customer.",
    qualityNote: "Full CMM inspection. Profile, core bore, cooling bore, and positional relationships all verified before dispatch.",
    faqs: [
      {
        q: "Is this pin available as a standard product?",
        a: "No. This component is always manufactured to a specific customer drawing due to the unique combination of profile, core, and cooling channel geometries required in each application."
      },
      {
        q: "What manufacturing processes do you use for this pin?",
        a: "Typically a combination of CNC turning and milling, deep-hole drilling for the cooling channel, wire EDM for the profile and core form, and precision profile grinding for the final surface finish."
      }
    ],
    images: [
      { url: "/gallery/jet-cooler-with-profile-pin.png", alt: "Jet Cool Profile Core Pin assembled with jet cooler for HPDC die" }
    ],
    isPublished: true,
    sortOrder: 4
  },

  {
    id: "jet-cooler",
    slug: "jet-cooler",
    name: "Jet Cooler",
    category: {
      name: "Cooling Systems",
      slug: "cooling"
    },
    description: "Facilitates high pressure water & air into thin channels and slender holes of core pins during casting process. Important part of the Jetcool system to reduce shrinkage porosities. Easy to Install & long life. Improved material and design gives higher life. Available in 4 variants & with quick delivery.",
    overview: "The Vyankatesh Engineering Jet Cooler is the delivery mechanism at the heart of every jet cooling system. It connects the cooling water supply to the internal bore of the jet cool core pin, channelling high-pressure water or air directly into thin, slender holes that cannot be cooled by surface or water jacket methods alone. Designed for easy installation, long operational life, and compatibility with Vyankatesh JC Core Pins, the Jet Cooler is available in four variants to suit different die configurations and pin sizes.",
    applications: "High-pressure water and air delivery for core pin cooling systems.",
    applicationsList: [
      "Cooling slender core pins in HPDC dies where jacket cooling is not possible",
      "Delivering high-pressure cooling media to deep cavity zones",
      "Reducing shrinkage porosity in thick-section castings",
      "Integration into existing die cooling circuits for targeted hot-spot management"
    ],
    specs: {
      "Variants": "4 variants available (specify at time of order)",
      "Cooling Media": "High-pressure water or air",
      "Operating Pressure": "Compatible with standard die cooling pressures",
      "Material": "Improved material for higher life and corrosion resistance",
      "Installation": "Easy screw-in installation, no special tooling required",
      "Compatibility": "Designed for use with Vyankatesh JC Core Pins"
    },
    features: [
      "Available in 4 variants to suit different pin diameters and die configurations",
      "Channels high-pressure water or air directly into the pin's internal bore",
      "Improved material formulation provides extended service life and corrosion resistance",
      "Simple screw-in installation reduces die maintenance downtime",
      "Precision-machined flow channels for consistent, unobstructed cooling media delivery",
      "Quick delivery schedule to minimize production downtime"
    ],
    keyAdvantages: [
      "Targets shrinkage porosity at source by delivering cooling exactly where heat accumulates",
      "4-variant range covers the majority of HPDC die pin configurations",
      "Significantly longer service life than generic alternatives due to material and design improvements",
      "Works as a complete system with Vyankatesh JC Core Pins for guaranteed compatibility"
    ],
    industries: ["Automotive HPDC", "Two-Wheeler Manufacturing", "Industrial Die Casting", "Electrical Component Manufacturing"],
    material: "Precision-grade alloy steel with corrosion-resistant treatment",
    customization: "Custom connection threads, fitting types, and flow channel diameters available on request.",
    availableSizes: "4 standard variants. Custom configurations on request.",
    qualityNote: "Each Jet Cooler is pressure-tested and flow-checked before dispatch to verify unobstructed cooling media delivery.",
    faqs: [
      {
        q: "Which variant of Jet Cooler do I need?",
        a: "Variant selection depends on your pin outer diameter and your existing cooling manifold connection type. Share your pin specifications and we will recommend the correct variant."
      },
      {
        q: "Can the Jet Cooler be used with pins from other manufacturers?",
        a: "The Jet Cooler is engineered for Vyankatesh JC Core Pins to ensure guaranteed concentricity and sealing. Compatibility with third-party pins can be assessed on a case-by-case basis."
      },
      {
        q: "How do I install a Jet Cooler?",
        a: "Installation is a simple screw-in process that requires no special tooling. The Jet Cooler threads directly into the die cooling circuit, and the JC Core Pin inserts through it. Detailed installation guidance is provided with every order."
      }
    ],
    images: [
      { url: "/products/jet-cooler-set.png", alt: "Vyankatesh Jet Cooler set — 4 variants for HPDC core pin cooling" },
      { url: "/gallery/jet-cooler-with-core-pin.png", alt: "Jet Cooler assembled with JC Core Pin for HPDC application" },
      { url: "/gallery/jet-cooler-with-insert.png", alt: "Jet Cooler integrated with die insert for targeted hot spot cooling" }
    ],
    isPublished: true,
    sortOrder: 5
  },

  {
    id: "profile-inserts",
    slug: "profile-inserts",
    name: "Profile Inserts",
    category: {
      name: "Inserts",
      slug: "inserts"
    },
    description: "Use high grade material and heat treatment makes loose inserts more durable & long life. High quality AISI H-13/DIN 1.2344 is precisely machined, ground, hardened & Nitrided. We specialize in loose piece manufacturing starting from raw material, with complete processes including machining, hardening, and coating. Precision, consistent quality, and on-time delivery define our manufacturing strength.",
    overview: "Profile Inserts from Vyankatesh Engineering are precision-machined, heat-treated replaceable components that form specific geometrical features within the die cavity. They are used in both fixed and loose-piece arrangements and allow complex or undercut geometries to be formed and extracted from the casting. Starting from certified raw material and manufacturing through our managed process — in-house machining and grinding, coupled with certified hardening and nitriding — Vyankatesh Profile Inserts deliver consistent dimensional quality and maximum die insert life.",
    applications: "Complex automotive molds, intricate industrial parts, and aluminum casting undercut features.",
    applicationsList: [
      "Forming undercut features and complex cavity geometries in aluminum die castings",
      "Replaceable inserts for high-wear zones in HPDC and LPDC dies",
      "Automotive body and structural part die inserts",
      "Industrial housing, cover, and bracket die features",
      "Special loose-piece inserts for features that cannot be drawn directly from the die"
    ],
    specs: {
      "Material": "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
      "Hardness": "44–48 HRC post heat treatment",
      "Heat Treatment": "Vacuum hardening + double/triple tempering",
      "Surface Treatment": "Nitriding (standard) + optional PVD coating",
      "Dimensional Accuracy": "Ground to tolerance per customer drawing",
      "Process Capability": "Raw material → Machined → Hardened → Ground → Nitrided → Coated → Inspected",
      "Manufacturing": "VMC Machining, Wire EDM, Sink EDM, Precision Grinding, Polishing"
    },
    features: [
      "End-to-end quality management from certified raw billet — full traceability at every stage",
      "Vacuum hardening ensures uniform hardness without distortion or surface oxidation",
      "Double/triple tempering cycle eliminates residual stress for long fatigue life",
      "Nitriding applied post-grinding creates surface hardness without dimensional change",
      "Wire EDM and Sink EDM capability for complex profiles with sharp corners and fine details",
      "Available as fixed inserts or loose-piece assemblies for undercut geometries",
      "PVD coating applied by trusted partners with thoroughly checked results to increase wear and tear resistance and extend durability"
    ],
    keyAdvantages: [
      "Strictly managed end-to-end capability eliminates quality issues",
      "Consistent dimensional quality batch-to-batch due to controlled, documented process",
      "Loose-piece design enables ejection of complex, undercut castings without die damage",
      "Competitive lead times due to dedicated in-house machining and certified heat treatment"
    ],
    industries: ["Automotive", "Aerospace", "General Engineering", "Electrical & Electronics", "Industrial Machinery"],
    material: "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
    tolerance: "Ground to customer drawing tolerance. Typically ±0.01mm on mating faces.",
    surfaceFinish: "Nitriding (0.1–0.15mm case depth) + optional TiN/TiAlN PVD coating for enhanced wear and sticking resistance.",
    customization: "Fully custom manufactured to customer drawing. Any geometry achievable using CNC, EDM, and profile grinding.",
    availableSizes: "Any size from small 10mm inserts to large die blocks. Capability up to 500kg component weight.",
    qualityNote: "All profile inserts undergo 100% dimensional inspection by CMM or precision gauges. Hardness verified by Rockwell testing. Blue matching on VMC for critical mating surfaces.",
    faqs: [
      {
        q: "What is a loose-piece insert and when do I need one?",
        a: "A loose-piece insert is a removable section of the die that forms an undercut or re-entrant feature in the casting. Because the feature cannot be ejected straight from the die, the insert is designed to move with the casting during ejection and is removed manually before the die closes again."
      },
      {
        q: "How do you ensure dimensional consistency across a batch of inserts?",
        a: "We use documented CNC programs, controlled heat treatment cycles with recorded parameters, and 100% post-process inspection using CMM for all critical dimensions. This ensures every insert in a batch is within the specified tolerance."
      },
      {
        q: "Can you reverse-engineer an existing insert from a sample?",
        a: "Yes. We can reverse-engineer worn or damaged inserts using CMM measurement of the sample, reconstruction of the design intent, and manufacture of replacement inserts to the recovered dimensions."
      }
    ],
    images: [
      { url: "/products/loose-insert.png", alt: "Loose piece profile insert for complex die casting geometry" },
      { url: "/products/fixed-insert.png", alt: "Fixed profile insert in die casting die" },
      { url: "/gallery/critical-insert-1.png", alt: "Critical profile insert for automotive die casting" },
      { url: "/gallery/critical-insert-2.png", alt: "Precision profile insert with complex geometry" },
      { url: "/gallery/critical-insert-3.png", alt: "Profile insert set for high-pressure die casting mold" },
      { url: "/gallery/critical-insert-4.png", alt: "Machined and nitrided profile insert for long insert life" },
      { url: "/gallery/critical-inserts-set.png", alt: "Set of critical profile inserts manufactured by Vyankatesh Engineering" },
      { url: "/gallery/lpdc-insert.png", alt: "Profile insert for LPDC die casting application" },
      { url: "/products/inserts.png", alt: "Range of precision profile inserts — various sizes and geometries" }
    ],
    isPublished: true,
    sortOrder: 6
  },

  {
    id: "sprue-bush-diffuser",
    slug: "sprue-bush-diffuser",
    name: "Sprue Bush & Diffuser",
    category: {
      name: "Casting Accessories",
      slug: "accessories"
    },
    description: "Refined material structure and heat treatment makes SPRUE BUSH & DIFFUSER more durable. High quality AISI H-13/DIN 1.2344 is precisely machined, ground, hardened & Nitrided. With options of integral/jacket/conformal cooling makes it thermally balanced. Diffuser is ground blue matched with thermal clearances.",
    overview: "The Sprue Bush & Diffuser is a critical interface component in gravity and low-pressure die casting systems, connecting the metal delivery system to the die cavity. Vyankatesh Engineering's Sprue Bushes are manufactured from premium AISI H-13/DIN 1.2344 tool steel and undergo a full precision process — machining, hardening, grinding, and nitriding — to deliver extended service life in demanding casting environments. The matched Diffuser is ground and blue-fitted to the die with correct thermal clearances, ensuring metal flows smoothly from the pouring basin into the runner system without leakage or erosion.",
    applications: "Molten metal feeding systems for die casting setups.",
    applicationsList: [
      "Metal entry and flow distribution in gravity die casting (GDC) systems",
      "Sprue interface in low-pressure die casting (LPDC) dies",
      "High-temperature metal delivery in ferrous and non-ferrous casting processes",
      "Replacement components for worn or damaged OEM sprue bushes"
    ],
    specs: {
      "Material": "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
      "Hardness": "44–48 HRC",
      "Heat Treatment": "Vacuum hardening + tempering",
      "Surface Treatment": "Nitriding (standard)",
      "Cooling Options": "Integral cooling / Water jacket / Conformal cooling channel",
      "Diffuser Fit": "Ground and blue matched with correct thermal clearances",
      "Manufacturing": "CNC Turning, Precision Boring, Grinding"
    },
    features: [
      "Manufactured from certified AISI H-13 / DIN 1.2344 for maximum thermal fatigue life",
      "Three cooling configurations: integral bore, external water jacket, or conformal channel",
      "Diffuser precision-ground and blue-matched to die seat for leak-free metal flow",
      "Thermal clearances engineered into the diffuser to accommodate operating temperature expansion",
      "Nitriding provides erosion and wear resistance in the metal contact zone",
      "Precision bore machining ensures smooth metal flow with no turbulence-inducing surface defects"
    ],
    keyAdvantages: [
      "Thermally balanced design reduces thermal fatigue cracking — a common failure mode in standard bushes",
      "Three cooling options allow selection of the optimal cooling method for the operating temperature",
      "Blue-matched diffuser installation prevents metal leakage at the sprue junction",
      "End-to-end quality management ensures dimensional control at all critical interfaces"
    ],
    industries: ["Gravity Die Casting (GDC)", "Low Pressure Die Casting (LPDC)", "Automotive Foundry", "Aluminum Casting"],
    material: "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
    tolerance: "Bore concentricity ≤ 0.02mm. Seating faces ground flat to ≤ 0.01mm.",
    surfaceFinish: "Nitriding on all metal-contact surfaces. External surfaces ground to Ra ≤ 0.8μm.",
    customization: "Sprue bore diameter, pouring basin angle, total length, seat diameter, and cooling channel type all specified per customer drawing.",
    qualityNote: "Sprue bores are inspected for concentricity, surface finish, and diameter. Diffuser blue-matching is performed and recorded before dispatch.",
    faqs: [
      {
        q: "What is the difference between the three cooling options?",
        a: "Integral cooling uses a drilled bore within the body for water flow. A water jacket is an external clamped sleeve that surrounds the bush. Conformal cooling uses a precision-machined channel that follows the external profile of the bush for the most uniform thermal balance. The right choice depends on your available space and cooling water supply configuration."
      },
      {
        q: "What does 'blue matched' mean for the diffuser?",
        a: "Blue matching is a precision fitting process where engineer's blue marking compound is applied to one surface, the mating surface is pressed against it, and the contact pattern is inspected. This verifies that the seating faces mate correctly across their full area, preventing metal leakage at the joint during casting."
      }
    ],
    images: [
      { url: "/products/sprue-bush.png", alt: "Precision Sprue Bush manufactured from H-13 with nitrided bore" },
      { url: "/gallery/sprue-bushs-and-diffusers.png", alt: "Sprue Bush and Diffuser set for die casting metal delivery system" }
    ],
    isPublished: true,
    sortOrder: 7
  },

  {
    id: "shot-sleeve",
    slug: "shot-sleeve",
    name: "Shot Sleeve",
    category: {
      name: "Casting Accessories",
      slug: "accessories"
    },
    description: "Long life VYANKATESH SHOT SLEEVES come in fully or partially cooled with one or two part options. High quality AISI H-13/DIN 1.2344 is precisely machined, ground, hardened & Nitrided. Thermally balanced sleeve improves performance and quality of casting. Continual improvements in finishes and treatment work towards giving a caster value for money.",
    overview: "The Shot Sleeve is the primary metal containment component in every cold-chamber high-pressure die casting machine. It receives the molten metal charge and the shot plunger drives the metal through it and into the die cavity. Vyankatesh Engineering Shot Sleeves are manufactured from certified AISI H-13 / DIN 1.2344 and processed through a full precision manufacturing cycle — turning, boring, hardening, grinding, and nitriding — to achieve the bore quality and dimensional accuracy required for smooth plunger travel and leak-free metal injection.",
    applications: "High-pressure die casting metal delivery systems.",
    applicationsList: [
      "Cold-chamber high-pressure die casting machines (HPDC)",
      "Replacement sleeves for worn or eroded shot cylinders",
      "High-silicon aluminum alloy casting where erosion resistance is critical",
      "Machines requiring thermally balanced sleeves to reduce misrun and cold shut defects"
    ],
    specs: {
      "Material": "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
      "Options": "Fully cooled (water jacket) or Partially cooled (end zone cooling)",
      "Construction": "One-piece or two-piece (split) design",
      "Hardness": "44–48 HRC (post heat treatment)",
      "Heat Treatment": "Vacuum hardening + tempering",
      "Surface Treatment": "Nitriding (standard); optional hard chrome or PVD coating",
      "Bore Finish": "Honed to Ra ≤ 0.4μm for smooth plunger travel"
    },
    features: [
      "Manufactured from certified AISI H-13 / DIN 1.2344 for maximum thermal fatigue and erosion resistance",
      "Available fully cooled (water jacket around full length) or partially cooled (cooling at the metal charge zone)",
      "One-piece design for maximum rigidity; two-piece design for ease of maintenance and replacement",
      "Bore honed to Ra ≤ 0.4μm to ensure smooth plunger travel and minimize metal sticking",
      "Thermal balancing engineered to produce consistent metal temperature at the die gate",
      "Continual improvements in surface treatment improve casting quality and sleeve service life"
    ],
    keyAdvantages: [
      "Thermally balanced bore reduces misrun, cold shut, and flow-related defects in the casting",
      "Four configuration options (fully/partially cooled × one/two-piece) provide flexibility for different machine sizes",
      "Superior bore finish reduces plunger friction, extending both sleeve and tip life",
      "Dedicated machining capability allows rapid turnaround for emergency replacements"
    ],
    industries: ["Automotive HPDC", "Two-Wheeler Manufacturing", "Industrial Equipment Casting", "General Foundry"],
    material: "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
    tolerance: "Bore diameter tolerance: H7. Bore straightness ≤ 0.02mm. Roundness ≤ 0.01mm.",
    surfaceFinish: "Nitriding standard. Hard chrome or TiN/TiAlN PVD coating on request for enhanced sticking resistance.",
    customization: "Custom bore diameters, overall lengths, pour hole position, cooling water inlet/outlet positions, and flange dimensions per machine specification.",
    availableSizes: "Manufactured to machine specification. Bore diameters from 40mm to 250mm. Lengths up to 800mm.",
    qualityNote: "Bore roundness, straightness, surface finish, and hardness are verified before dispatch. Plunger fit is checked where sample plunger is supplied.",
    faqs: [
      {
        q: "What is the difference between a fully cooled and partially cooled shot sleeve?",
        a: "A fully cooled sleeve has a water jacket around the entire bore length, providing uniform temperature control along the full stroke. A partially cooled sleeve concentrates cooling at the pour hole zone, reducing premature solidification of the charge while allowing the discharge end to stay hotter. The right choice depends on your casting alloy and shot parameters."
      },
      {
        q: "When should I specify a two-piece shot sleeve?",
        a: "Two-piece designs are often preferred on larger machines or where the pour hole section experiences higher erosion. The pour hole section can be replaced independently without replacing the full sleeve, reducing maintenance cost."
      },
      {
        q: "What is the bore finish specification for the shot sleeve?",
        a: "Our standard bore is honed to Ra ≤ 0.4μm. This ensures smooth plunger travel, reduces friction heating, and minimizes metal adhesion on the bore surface."
      }
    ],
    images: [
      { url: "/products/shot-sleeve.png", alt: "HPDC Shot Sleeve manufactured from H-13, thermally balanced for casting quality" }
    ],
    isPublished: true,
    sortOrder: 8
  },

  {
    id: "hpdc-insert",
    slug: "hpdc-insert",
    name: "HPDC Insert",
    category: {
      name: "Inserts",
      slug: "inserts"
    },
    description: "High-grade loose and fixed High-Pressure Die Casting (HPDC) inserts designed for durability and extended life. Precision machined from premium AISI H-13/DIN 1.2344 steel, hardened and Nitrided to withstand the rigorous thermal and mechanical stresses of the HPDC process.",
    overview: "HPDC Inserts from Vyankatesh Engineering are replaceable die components designed to form specific cavity features in high-pressure die casting dies. Subjected to repeated cycles of extreme heat, pressure, and thermal shock, HPDC inserts must maintain their dimensional accuracy and structural integrity over tens of thousands of shots. Manufactured from certified AISI H-13 / DIN 1.2344 and processed through a proven full heat treatment and surface finishing cycle, Vyankatesh HPDC Inserts are engineered for the demanding performance requirements of modern high-volume automotive and industrial die casting production.",
    applications: "High-pressure die casting molds, critical component formations, and complex aluminum casting features.",
    applicationsList: [
      "Fixed die cavity inserts in HPDC dies for automotive structural parts",
      "Replaceable wear-zone inserts in gate and runner areas",
      "Critical feature forming inserts for engine blocks, transmission cases, and brackets",
      "Complex geometry cavity inserts manufactured by VMC and wire EDM"
    ],
    specs: {
      "Material": "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
      "Hardness": "44–48 HRC",
      "Heat Treatment": "Vacuum hardening + multiple tempering cycles",
      "Surface Treatment": "Nitriding (standard); optional PVD coating",
      "Thermal Fatigue Resistance": "Optimized through controlled heat treatment",
      "Manufacturing": "VMC Machining, Wire EDM, Sink EDM, Precision Grinding, Polishing",
      "Quality": "100% inspection — dimensions, hardness, surface finish"
    },
    features: [
      "AISI H-13 / DIN 1.2344 selected for best-in-class thermal fatigue and soldering resistance",
      "Vacuum hardening produces consistent, distortion-free hardening throughout the insert mass",
      "Multiple tempering cycles develop the optimal balance of hardness and toughness",
      "Nitriding on die-contact surfaces provides an additional layer of wear and erosion protection",
      "Wire EDM and Sink EDM capability enables complex cavity geometries with fine detail",
      "Precision grinding achieves accurate parting line and mating face dimensions",
      "PVD coating applied by trusted partners with thoroughly checked results to increase wear and tear resistance and extend durability"
    ],
    keyAdvantages: [
      "Longer insert life reduces machine downtime and tooling replacement frequency",
      "Controlled heat treatment eliminates post-heat-treatment distortion and dimensional drift",
      "Strictly managed capability from raw material to finished insert ensures total quality ownership",
      "Competitive pricing on repeat orders due to retained CNC programs and process documentation"
    ],
    industries: ["Automotive HPDC", "Motorcycle & Two-Wheeler", "Industrial Equipment", "Electrical & Electronics"],
    material: "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
    tolerance: "Ground to customer drawing tolerance. Typically ±0.01mm on critical cavity dimensions.",
    surfaceFinish: "Nitriding standard. PVD hard coating on request. Cavity surface ground to Ra per customer specification.",
    customization: "Fully custom per drawing. Insert geometry, cooling channels, register faces, and fitting features all manufactured to specification.",
    qualityNote: "Every HPDC insert undergoes full CMM dimensional inspection and hardness verification. Critical cavity surfaces are inspected for surface finish using appropriate measurement tools.",
    faqs: [
      {
        q: "What is thermal fatigue and why does it affect HPDC inserts?",
        a: "Thermal fatigue is the progressive cracking of the die surface caused by repeated heating (during metal injection) and cooling (during die spraying and part ejection) cycles. The cyclic thermal stress eventually causes heat checking — a network of surface cracks. H-13 tool steel is specifically engineered to resist thermal fatigue, and proper heat treatment maximises this resistance."
      },
      {
        q: "Can you add cooling channels to an HPDC insert?",
        a: "Yes. We can design and machine conformal or straight-drilled cooling channels within an insert to manage hot spots and control local solidification. This requires a detailed discussion of the die thermal map and cooling water supply points."
      }
    ],
    images: [
      { url: "/products/hpdc-insert-2.png", alt: "HPDC Insert manufactured from H-13 — vacuum hardened and nitrided" },
      { url: "/gallery/hpdc-insert-1.png", alt: "High-Pressure Die Casting Insert for automotive die casting application" }
    ],
    isPublished: true,
    sortOrder: 9
  },

  {
    id: "hpdc-die",
    slug: "hpdc-die",
    name: "HPDC Die",
    category: {
      name: "Dies",
      slug: "dies"
    },
    description: "High-Pressure Die Casting (HPDC) dies engineered for high-volume automotive and industrial applications. Precision manufactured from H-13 tool steel with advanced thermal management and robust structural integrity.",
    overview: "HPDC Dies from Vyankatesh Engineering are designed to withstand the extreme thermal shock, high injection pressures, and rapid cycle times of modern die casting. We manufacture complete HPDC tooling focusing on optimal gating, intelligent cooling circuit layout, and precise cavity dimensions to minimize shrinkage porosity and maximize die life. Every die undergoes rigorous heat treatment, dimensional inspection, and blue matching before delivery.",
    applications: "High-volume aluminum casting for automotive, aerospace, and industrial sectors.",
    applicationsList: [
      "Engine blocks, transmission cases, and structural components",
      "Pump housings, valve bodies, and pressure-tight enclosures",
      "Complex thin-walled aluminum parts requiring rapid filling",
      "Multi-cavity dies for high-volume small component production"
    ],
    specs: {
      "Material": "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
      "Hardness": "44–48 HRC",
      "Heat Treatment": "Vacuum hardening + multiple tempering cycles",
      "Surface Treatment": "Nitriding (standard); optional PVD coating",
      "Cooling": "Engineered conformal or straight-drilled cooling circuits",
      "Manufacturing": "CNC Machining, Wire EDM, Sink EDM, Precision Grinding, Polishing, Blue Matching",
      "Quality": "100% CMM inspection — dimensions, hardness, surface finish"
    },
    features: [
      "Manufactured from certified AISI H-13 / DIN 1.2344 for ultimate thermal fatigue resistance",
      "Vacuum hardening produces consistent, distortion-free hardening throughout the die mass",
      "Multiple tempering cycles develop the optimal balance of hardness and toughness",
      "Precision-ground parting lines and cavity surfaces ensure flash-free casting",
      "Cooling circuits engineered for directional solidification and rapid heat extraction"
    ],
    keyAdvantages: [
      "Extended die life achieved through superior steel selection and proven heat treatment",
      "Reduced casting cycle times due to optimized thermal management",
      "Consistent dimensional accuracy across high-volume production runs",
      "Lower maintenance costs and reduced downtime for die repairs"
    ],
    industries: ["Automotive HPDC", "Motorcycle & Two-Wheeler", "Industrial Equipment", "Electrical & Electronics"],
    material: "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
    tolerance: "Ground to customer drawing tolerance. Typically ±0.01mm on critical cavity dimensions.",
    surfaceFinish: "Nitriding standard. Cavity surfaces polished to Ra per customer specification.",
    customization: "Fully custom per drawing. Cavity geometry, cooling channels, register faces, and ejection systems manufactured to specification.",
    qualityNote: "Every HPDC die undergoes full CMM dimensional inspection, hardness verification, and blue matching of parting lines.",
    faqs: [
      {
        q: "Do you offer thermal analysis for HPDC dies?",
        a: "We work closely with customers during the design phase to review thermal maps and optimize cooling circuit placement to prevent hot spots and soldering."
      },
      {
        q: "Can you manufacture multi-cavity HPDC dies?",
        a: "Yes, we regularly manufacture multi-cavity dies, ensuring balanced runner systems and identical cavity dimensions for consistent casting quality."
      }
    ],
    images: [
      { url: "/gallery/hpdc-insert-1.png", alt: "High-Pressure Die Casting Die for automotive die casting application" }
    ],
    isPublished: true,
    sortOrder: 10
  },

  {
    id: "lpdc-die",
    slug: "lpdc-die",
    name: "LPDC Die",
    category: {
      name: "Dies",
      slug: "dies"
    },
    description: "Low-Pressure Die Casting (LPDC) dies engineered for high-integrity aluminum castings. Manufactured from premium tool steels with precise thermal management capabilities to ensure optimal directional solidification and superior casting quality.",
    overview: "Low-Pressure Die Casting (LPDC) is the process of choice for producing high-integrity, pressure-tight aluminum castings — particularly alloy wheels, cylinder heads, and structural automotive components where porosity must be minimized and mechanical properties must be maximized. Vyankatesh Engineering LPDC Dies are designed from the outset with directional solidification in mind: thermal management, gating geometry, and insert positioning are all engineered to produce dense, defect-free castings consistently over the die's service life.",
    applications: "Critical automotive components, alloy wheels, and structural parts requiring high structural integrity and pressure tightness.",
    applicationsList: [
      "Aluminum alloy wheel and rim manufacturing",
      "Automotive cylinder heads and engine mounts",
      "Structural chassis and suspension components",
      "Pressure-tight housings for hydraulic and pneumatic systems",
      "High-integrity parts where X-ray or pressure testing is specified"
    ],
    specs: {
      "Material": "AISI H-13 / DIN 1.2344 Hot Work Tool Steel (core and cavity)",
      "Heat Treatment": "Vacuum hardening + specialized nitriding protocol",
      "Thermal Management": "Engineered cooling circuit layout for directional solidification",
      "Dimensional Accuracy": "Precision ground and blue matched",
      "Design Consideration": "Gate, runner, and riser geometry optimized for pressure-tight castings",
      "Manufacturing": "CNC Machining, EDM, Precision Grinding, Polishing, Blue Matching"
    },
    features: [
      "Designed with directional solidification as the primary engineering objective",
      "Cooling circuit layout engineered from casting process requirements, not added as an afterthought",
      "Gate and runner geometry sized for controlled, non-turbulent metal fill under low pressure",
      "All die seating faces precision ground and blue matched to prevent metal flash",
      "H-13 tool steel provides the thermal fatigue resistance needed for LPDC operating temperatures",
      "Full die assembly and pre-acceptance inspection performed before delivery"
    ],
    keyAdvantages: [
      "LPDC-specific design approach produces castings with better internal quality than GDC alternatives",
      "Correct directional solidification reduces porosity, shrinkage, and scrap rates",
      "Precision-ground parting line eliminates flash and reduces post-processing",
      "Experienced team provides design input on gating and thermal management before manufacture begins"
    ],
    industries: ["Automotive (Alloy Wheels, Cylinder Heads)", "Aerospace Structural Parts", "Hydraulic & Pneumatic Components"],
    material: "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
    tolerance: "Cavity dimensions ground to ±0.05mm. Parting line ground to ≤ 0.02mm flatness.",
    surfaceFinish: "Nitriding on all metal-contact surfaces. Optional polishing of cavity surfaces for cosmetic castings.",
    customization: "Die configuration (top/bottom, side core arrangements), cooling circuit layout, gate and runner geometry — all per customer casting design.",
    qualityNote: "Full assembly inspection including parting line blue matching, insert register fit check, and cooling circuit pressure test before dispatch.",
    faqs: [
      {
        q: "What is the main difference between LPDC and HPDC dies?",
        a: "HPDC uses high injection pressure (typically 500–1500 bar) and very fast fill times. LPDC uses low applied pressure (typically 0.3–1.5 bar) and slower, controlled fill to promote directional solidification. LPDC dies therefore operate at lower pressures and benefit from more time for controlled solidification, producing castings with lower porosity and better mechanical properties."
      },
      {
        q: "Can you design the gating system as well as manufacture the die?",
        a: "Yes. We can discuss the gating and thermal design with your process team and incorporate recommendations into the die design. We have experience with common LPDC alloys and casting geometries."
      }
    ],
    images: [
      { url: "/gallery/lpdc-insert.png", alt: "LPDC Die Insert — engineered for directional solidification in aluminum casting" }
    ],
    isPublished: true,
    sortOrder: 10
  },

  {
    id: "gdc-die",
    slug: "gdc-die",
    name: "GDC Die",
    category: {
      name: "Dies",
      slug: "dies"
    },
    description: "Gravity Die Casting (GDC) dies designed for robust, long-lasting performance in high-volume aluminum casting. Precision machined and thermally balanced to ensure consistent casting quality and reduced cycle times.",
    overview: "Gravity Die Casting (GDC) uses the force of gravity to fill a permanent metal mold with molten aluminum. It produces castings with better dimensional accuracy, smoother surface finish, and superior mechanical properties compared to sand casting, while remaining more economical than pressure die casting for medium-volume production. Vyankatesh Engineering GDC Dies are precision-machined from premium tool steel, thermally balanced to control solidification, and blue-matched on all seating faces to prevent flash.",
    applications: "Automotive engine components, structural brackets, and complex housings requiring excellent surface finish and dimensional stability.",
    applicationsList: [
      "Automotive engine mounting brackets and supports",
      "Pump housings, valve bodies, and fluid system components",
      "Electrical enclosures and switch housings",
      "General engineering structural components",
      "Replacement dies for worn or damaged permanent molds"
    ],
    specs: {
      "Material": "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
      "Heat Treatment": "Vacuum hardening + nitriding",
      "Surface Treatment": "Nitriding on all metal-contact surfaces",
      "Parting Line": "Precision ground and blue matched",
      "Cooling": "Drilled cooling circuits per customer specification",
      "Manufacturing": "CNC Machining, EDM, Precision Grinding, Polishing, Blue Matching"
    },
    features: [
      "Manufactured from AISI H-13 / DIN 1.2344 for resistance to thermal fatigue in GDC temperatures",
      "Vacuum hardening provides consistent hardness without surface oxidation or distortion",
      "Nitriding on metal-contact surfaces extends die life by resisting erosion from molten aluminum",
      "Precision-ground parting lines and seating faces prevent flash formation",
      "Drilled cooling circuits positioned to control solidification direction and minimize shrinkage",
      "Complete die assembly and fit check performed before delivery"
    ],
    keyAdvantages: [
      "Longer die life compared to non-nitrided alternatives due to surface hardness",
      "Precision blue matching eliminates flash and reduces finishing cost on castings",
      "Controlled cooling reduces shrinkage and porosity in casting sections",
      "End-to-end management means one point of contact for design, manufacture, and support"
    ],
    industries: ["Automotive Component Manufacture", "General Engineering Foundry", "Pump & Valve Manufacture", "Electrical Equipment"],
    material: "AISI H-13 / DIN 1.2344 Hot Work Tool Steel",
    tolerance: "Cavity dimensions to ±0.05mm. Parting line flatness ≤ 0.02mm.",
    surfaceFinish: "Nitriding on metal-contact surfaces. Parting line and register faces ground to Ra ≤ 0.8μm.",
    customization: "Die configuration, core and slide arrangements, venting, cooling circuit layout, and mold tilt angle all specified per customer requirement.",
    qualityNote: "Assembly and blue matching inspection performed before dispatch. Cooling circuit pressure tested to confirm integrity.",
    faqs: [
      {
        q: "What alloys can a GDC die be used for?",
        a: "GDC dies made from H-13 tool steel are primarily used for aluminum and zinc-based alloys. With appropriate preparation and coatings, they can also be used for copper alloys at lower production volumes."
      },
      {
        q: "How long does a GDC die last?",
        a: "With proper operating practice — correct preheat, die coat application, and controlled cooling — an H-13 nitrided GDC die can produce 50,000–200,000 shots depending on the alloy, casting size, and operating temperature. We can advise on die care practices to maximize service life."
      }
    ],
    images: [
      { url: "/gallery/gdc-die.png", alt: "GDC Die — gravity die casting die manufactured from H-13 tool steel" },
      { url: "/gallery/gdc-die-block.png", alt: "GDC Die Block — precision machined and nitrided for aluminum casting" },
      { url: "/gallery/gdc-die-bottom.png", alt: "GDC Die bottom section showing cooling circuit arrangement" }
    ],
    isPublished: true,
    sortOrder: 11
  },

  {
    id: "side-core-holder",
    slug: "side-core-holder",
    name: "Side Core Holder",
    category: {
      name: "Casting Accessories",
      slug: "accessories"
    },
    description: "Precision machined side core holders designed for robust mounting and precise alignment of side cores in complex die casting dies. Manufactured from high-grade steel to withstand rigorous mechanical stress.",
    overview: "The Side Core Holder is a structural die component that mounts, guides, and retains the side core (or slide) in a die casting die during the shot cycle. It must transmit the full injection pressure load from the side core to the die body without deflection, while maintaining precise alignment of the core pin or insert carried by the slide. Vyankatesh Engineering Side Core Holders are CNC machined from high-grade tool steel, ground on all critical surfaces, and inspected to ensure the geometric relationships between mounting, guide, and core-retaining features are maintained within tight tolerances.",
    applications: "Mounting and aligning side cores in automotive and industrial high-pressure die casting molds.",
    applicationsList: [
      "Slide and side core retention in HPDC dies",
      "Angled or cross-die slide mechanisms for undercut features",
      "High-load applications where injection pressure acts on the slide face",
      "Replacement holders for worn or damaged OEM slide bodies"
    ],
    specs: {
      "Material": "Premium Tool Steel (P20 or H-13 depending on application)",
      "Features": "High structural integrity, precise alignment geometry",
      "Process": "CNC Machined & Precision Ground on all functional surfaces",
      "Inspection": "CMM verification of all mounting and alignment features"
    },
    features: [
      "CNC machined from premium tool steel billet for dimensional accuracy and structural rigidity",
      "All guide and mounting faces precision ground for accurate side core alignment",
      "Designed to withstand full injection pressure transmitted through the slide without deflection",
      "Custom T-slot, dovetail, or pocket configurations for different core retention methods",
      "CMM inspection of all geometric relationships between mounting and guide features"
    ],
    keyAdvantages: [
      "Precise alignment of side core eliminates flash on the parting surface of the slide",
      "Structural rigidity prevents core deflection under injection pressure, maintaining casting dimensional accuracy",
      "Precision CNC and grinding capability for any holder geometry",
      "Competitive lead times on replacement holders to minimize production downtime"
    ],
    industries: ["Automotive HPDC", "Industrial Equipment Die Casting", "Two-Wheeler Manufacturing"],
    material: "P20 tool steel (standard) or AISI H-13 / DIN 1.2344 (for high-temperature applications)",
    tolerance: "Guide faces ground to H7/g6 fits as required. Positional tolerance of core mount ≤ 0.02mm.",
    surfaceFinish: "Ground on all functional surfaces. Nitriding available for extended guide face life.",
    customization: "Core pocket geometry, guide face configuration, mounting bolt pattern, and overall envelope dimensions all per customer die drawing.",
    qualityNote: "CMM inspection verifies guide face parallelism, core pocket position, and overall assembly height before dispatch.",
    faqs: [
      {
        q: "What material is used for the side core holder?",
        a: "We typically use P20 pre-hardened tool steel for side core holders, which provides a good balance of machinability and structural strength. For applications with elevated temperature exposure, we can supply H-13 holders with full heat treatment."
      },
      {
        q: "Can you supply the side core pin as well as the holder?",
        a: "Yes. We can manufacture the complete slide assembly including the holder body, core pin, wear plates, and locking wedges as required."
      }
    ],
    images: [
      { url: "/products/side-core-holder.jpeg", alt: "Side Core Holder for HPDC die — CNC machined and precision ground" }
    ],
    isPublished: true,
    sortOrder: 12
  },

  {
    id: "sub-insert",
    slug: "sub-insert",
    name: "Sub Insert",
    category: {
      name: "Inserts",
      slug: "inserts"
    },
    description: "Rapidly developed sub inserts for design validation, testing, and short-run casting. We offer fast turnaround times without compromising on dimensional accuracy or material quality.",
    overview: "Sub Inserts from Vyankatesh Engineering are fast-track die inserts manufactured to full dimensional and material quality standards, used to validate a new casting design before committing to production tooling. Whether you need a single test insert to verify a critical geometry, or a short run of inserts to produce pre-production samples for customer approval, we provide the same material quality (AISI H-13 / DIN 1.2344), the same heat treatment process, and the same inspection standards as our production tooling — delivered on an accelerated timescale.",
    applications: "New product development, design validation, and low-volume casting runs.",
    applicationsList: [
      "First article and design validation casting trials",
      "Pre-production sample approval for new automotive parts",
      "Short-run production where full production tooling is not yet justified",
      "Engineering change validation — testing a modified cavity feature before updating production dies"
    ],
    specs: {
      "Material": "AISI H-13 / DIN 1.2344 (same as production tooling)",
      "Turnaround": "Fast-track manufacturing schedule — discuss timeline at enquiry stage",
      "Usage": "Design validation, short runs, and pre-production approval",
      "Heat Treatment": "Same full vacuum hardening + nitriding process as production inserts",
      "Quality": "Full dimensional inspection per drawing"
    },
    features: [
      "Same material and heat treatment as production tooling — results are directly transferable",
      "Fast-track manufacturing schedule without sacrificing dimensional accuracy",
      "Full vacuum hardening and nitriding process applied, enabling true casting trials",
      "Dimensional inspection to drawing tolerance for accurate design validation",
      "Option to upgrade sub insert to production status without redesign",
      "PVD coating applied by trusted partners with thoroughly checked results to increase wear and tear resistance and extend durability"
    ],
    keyAdvantages: [
      "Validate casting design with production-equivalent inserts before committing to full die investment",
      "Identify and resolve design issues early, when changes are cheapest",
      "Short-run inserts can be used for pre-production customer approval samples",
      "Single supplier for prototype and production tooling provides seamless progression"
    ],
    industries: ["Automotive (New Model Development)", "General Engineering (New Product Introduction)", "Research & Development"],
    material: "AISI H-13 / DIN 1.2344 Hot Work Tool Steel (same as production grade)",
    customization: "Any geometry per customer drawing or 3D model. Tolerances, surface finish, and heat treatment specified per application.",
    qualityNote: "Full dimensional inspection with first-article inspection report (FAIR) available on request.",
    faqs: [
      {
        q: "What is the typical lead time for a sub insert?",
        a: "Lead time depends on insert complexity and our current schedule. Simple geometries can often be completed in 5–10 working days. Complex profiles requiring EDM work may take 2–3 weeks. Discuss your specific timeline at the enquiry stage and we will confirm what is achievable."
      },
      {
        q: "Is the sub insert made to the same material and treatment standard as production tooling?",
        a: "Yes. We use the same AISI H-13 / DIN 1.2344 material and the same full heat treatment process — vacuum hardening followed by nitriding. This means the sub insert behaves like production tooling in casting trials, giving you confidence that the results will transfer directly to production."
      },
      {
        q: "Can a sub insert be converted to a production insert?",
        a: "In many cases, yes. If the sub insert has been produced to production drawing dimensions and tolerances, it can often be used directly as a production insert for low-volume production. Discuss this with us at the design stage."
      }
    ],
    images: [
      { url: "/products/sub-insert.jpeg", alt: "Sub Insert" },
      { url: "/products/sub-inserts.jpeg", alt: "Sub Inserts Set" }
    ],
    isPublished: true,
    sortOrder: 13
  },

  {
    id: "prototype-insert",
    slug: "prototype-insert",
    name: "Prototype Insert",
    category: {
      name: "Inserts",
      slug: "inserts"
    },
    description: "Rapidly developed prototype inserts for design validation, testing, and short-run casting. We offer fast turnaround times without compromising on dimensional accuracy or material quality.",
    overview: "Prototype Inserts from Vyankatesh Engineering are fast-track die inserts manufactured to full dimensional and material quality standards, used to validate a new casting design before committing to production tooling. Whether you need a single test insert to verify a critical geometry, or a short run of inserts to produce pre-production samples for customer approval, we provide the same material quality (AISI H-13 / DIN 1.2344), the same heat treatment process, and the same inspection standards as our production tooling — delivered on an accelerated timescale.",
    applications: "New product development, design validation, and low-volume casting runs.",
    applicationsList: [
      "First article and design validation casting trials",
      "Pre-production sample approval for new automotive parts",
      "Short-run production where full production tooling is not yet justified",
      "Engineering change validation — testing a modified cavity feature before updating production dies"
    ],
    specs: {
      "Material": "AISI H-13 / DIN 1.2344 (same as production tooling)",
      "Turnaround": "Fast-track manufacturing schedule — discuss timeline at enquiry stage",
      "Usage": "Design validation, short runs, and pre-production approval",
      "Heat Treatment": "Same full vacuum hardening + nitriding process as production inserts",
      "Quality": "Full dimensional inspection per drawing"
    },
    features: [
      "Same material and heat treatment as production tooling — results are directly transferable",
      "Fast-track manufacturing schedule without sacrificing dimensional accuracy",
      "Full vacuum hardening and nitriding process applied, enabling true casting trials",
      "Dimensional inspection to drawing tolerance for accurate design validation",
      "Option to upgrade prototype insert to production status without redesign",
      "PVD coating applied by trusted partners with thoroughly checked results to increase wear and tear resistance and extend durability"
    ],
    keyAdvantages: [
      "Validate casting design with production-equivalent inserts before committing to full die investment",
      "Identify and resolve design issues early, when changes are cheapest",
      "Short-run inserts can be used for pre-production customer approval samples",
      "Single supplier for prototype and production tooling provides seamless progression"
    ],
    industries: ["Automotive (New Model Development)", "General Engineering (New Product Introduction)", "Research & Development"],
    material: "AISI H-13 / DIN 1.2344 Hot Work Tool Steel (same as production grade)",
    customization: "Any geometry per customer drawing or 3D model. Tolerances, surface finish, and heat treatment specified per application.",
    qualityNote: "Full dimensional inspection with first-article inspection report (FAIR) available on request.",
    faqs: [
      {
        q: "What is the typical lead time for a prototype insert?",
        a: "Lead time depends on insert complexity and our current schedule. Simple geometries can often be completed in 5–10 working days. Complex profiles requiring EDM work may take 2–3 weeks. Discuss your specific timeline at the enquiry stage and we will confirm what is achievable."
      },
      {
        q: "Is the prototype insert made to the same material and treatment standard as production tooling?",
        a: "Yes. We use the same AISI H-13 / DIN 1.2344 material and the same full heat treatment process — vacuum hardening followed by nitriding. This means the prototype insert behaves like production tooling in casting trials, giving you confidence that the results will transfer directly to production."
      },
      {
        q: "Can a prototype insert be converted to a production insert?",
        a: "In many cases, yes. If the prototype insert has been produced to production drawing dimensions and tolerances, it can often be used directly as a production insert for low-volume production. Discuss this with us at the design stage."
      }
    ],
    images: [
      { url: "/products/prototype-insert-main.png", alt: "Prototype Insert Main Image" },
      { url: "/products/prototype-1.png", alt: "Prototype insert for casting design validation" },
      { url: "/products/prototype-2.png", alt: "Full view of prototype die casting insert" },
      { url: "/products/prototype-3.png", alt: "Precision machined prototype insert" },
      { url: "/products/prototype-4.png", alt: "Prototype insert assembly" }
    ],
    isPublished: true,
    sortOrder: 14
  },


  {
    id: "long-jet-cool-core-pin",
    slug: "long-jet-cool-core-pin",
    name: "Long Jet Cool Core Pin",
    category: {
      name: "Pins",
      slug: "pins"
    },
    description: "Extra long jet-cooled core pins engineered for deep cavities. These pins ensure optimized thermal balance reaching deep into the mold, significantly reducing shrinkage porosities in hard-to-reach areas.",
    overview: "The Long Jet Cool Core Pin extends the capability of the standard JC Core Pin to deep cavity applications where standard lengths are insufficient. Deep-cavity core pin applications are among the most thermally challenging in die casting: the base of a deep pin may reach temperatures that cause premature softening and deflection without effective internal cooling. Vyankatesh Engineering's Long JC Core Pins are engineered specifically for these demanding zones, with a deep-hole bore that maintains concentricity along the full extended length, ensuring cooling water reaches the extreme tip of the pin where heat is most concentrated.",
    applications: "Deep hole formations and deep cavity cooling in high-pressure die casting.",
    applicationsList: [
      "Core pin cooling in deep boss and hub features",
      "Long slender pin formations in engine block water jacket cores",
      "Deep-cavity zones in large HPDC dies",
      "Applications where standard JC pins reach temperature limits before the end of the shot cycle"
    ],
    specs: {
      "Length": "Extended length — beyond standard JC pin range",
      "Inner Bore": "Gun drilled with maintained concentricity along full length",
      "Material": "DIN 1.2344 / AISI H-13",
      "Surface Treatment": "Nitriding + optional PVD coating",
      "Concentricity": "Maintained along full bore length"
    },
    features: [
      "Extended total length for deep-cavity HPDC applications beyond standard JC pin range",
      "Gun drilling with bore concentricity maintained along the full extended length",
      "Cooling water delivery to the extreme pin tip — the highest-temperature zone",
      "DIN 1.2344 H-13 selected for hot strength at elevated operating temperatures",
      "Nitrided outer surface for wear and erosion resistance in sliding guide arrangements",
      "PVD coating applied by trusted partners with thoroughly checked results to increase wear and tear resistance and extend durability"
    ],
    keyAdvantages: [
      "Solves the specific problem of deep-cavity pin overheating that cannot be addressed with standard JC pins",
      "Reduces shrinkage porosity in deep boss sections where directional solidification is difficult",
      "Extended pin life due to effective thermal management reaching the full pin length",
      "Manufactured as a complete system with Vyankatesh Jet Coolers for guaranteed compatibility"
    ],
    industries: ["Automotive HPDC (engine blocks, cylinder heads)", "Industrial Equipment", "Two-Wheeler Engine Components"],
    material: "DIN 1.2344 / AISI H-13 Hot Work Tool Steel",
    tolerance: "Bore concentricity ≤ 0.015mm TIR along full length. Outer diameter tolerance h6–h8.",
    surfaceFinish: "Nitriding + optional PVD. Bore surface finished to Ra ≤ 0.8μm.",
    customization: "Custom outer diameter, bore diameter, total length, and connection configuration per customer specification.",
    qualityNote: "Extended pins undergo 100% bore concentricity check along full length using specialized tooling. Straightness verified by precision roll check.",
    faqs: [
      {
        q: "How long can a Long JC Core Pin be?",
        a: "We manufacture long JC core pins beyond our standard 600mm range. The maximum length achievable depends on the pin's outer diameter — slenderness ratio determines the practical limit for maintaining bore concentricity and pin straightness. Contact us with your requirements for feasibility assessment."
      },
      {
        q: "How do you maintain bore concentricity in an extra-long pin?",
        a: "Long-hole drilling is a specialist process requiring specialized tooling, controlled feed rates, and careful chip evacuation. We use dedicated gun drilling equipment and multi-stage boring operations to maintain the specified concentricity tolerance along the full pin length."
      }
    ],
    images: [
      { url: "/products/long-jet-cool-core-pin.png", alt: "Long Jet Cool Core Pin for deep cavity HPDC applications — extended length with internal cooling" }
    ],
    isPublished: true,
    sortOrder: 14
  },

  {
    id: "copper-chills",
    slug: "copper-chills",
    name: "Copper Chills",
    category: {
      name: "Cooling Systems",
      slug: "cooling"
    },
    description: "High-conductivity copper chills for localized rapid cooling in die casting dies. These chills prevent hot spots, improve directional solidification, and enhance the overall structural integrity of the casting.",
    overview: "Copper Chills are precision-machined inserts manufactured from high-conductivity copper alloy and embedded within the die to produce controlled, rapid local solidification in thick sections or isolated hot spots that cannot be reached by conventional water cooling circuits. The thermal conductivity of copper (approximately 390 W/m·K) is far higher than that of the surrounding H-13 tool steel (approximately 28 W/m·K), enabling it to act as a thermal sink that accelerates local solidification. Vyankatesh Engineering's Copper Chills are manufactured to precise dimensions for accurate seating within the die, and are regularly used to eliminate localized shrinkage porosity in thick-walled aluminum castings.",
    applications: "Localized cooling for thick sections and hot spots in die casting molds.",
    applicationsList: [
      "Thick-section boss and rib features in aluminum castings prone to shrinkage porosity",
      "Isolated hot spots in GDC and LPDC dies that cannot be reached by drilled cooling circuits",
      "Controlled solidification in alloy wheel hubs and spoke junctions",
      "Heavy sections in structural automotive castings requiring dense microstructure"
    ],
    specs: {
      "Material": "High-conductivity Copper Alloy (C110 / Electrolytic Tough Pitch Copper)",
      "Thermal Conductivity": "~390 W/m·K (approximately 14× higher than H-13 tool steel)",
      "Function": "Rapid localized heat extraction to eliminate shrinkage porosity",
      "Geometry": "Custom machined to precise seating dimensions in the die",
      "Surface": "Precision machined for accurate die seating and maximum thermal contact"
    },
    features: [
      "High-conductivity C110 copper alloy for maximum thermal extraction rate",
      "Precision-machined to tight seating dimensions for full contact with the surrounding die steel",
      "Custom geometry — any profile that fits within the available die space",
      "No external cooling connection required — operates purely on thermal conduction",
      "Can be combined with direct water cooling for even faster heat extraction in extreme cases",
      "Easy to replace when worn or eroded without modifying the surrounding die"
    ],
    keyAdvantages: [
      "Eliminates shrinkage porosity in thick sections where conventional cooling circuits cannot reach",
      "No plumbing connection required — simple installation directly into the die insert pocket",
      "Copper's extreme thermal conductivity delivers results that cannot be achieved with steel-only chills",
      "Cost-effective solution to a persistent casting quality problem"
    ],
    industries: ["Gravity Die Casting (GDC)", "Low Pressure Die Casting (LPDC)", "Automotive Alloy Wheel Manufacture", "Structural Casting"],
    material: "C110 Electrolytic Tough Pitch Copper (high-conductivity grade)",
    tolerance: "Seating dimensions ground to H7 fit for maximum thermal contact in the die pocket.",
    surfaceFinish: "All seating faces precision machined to Ra ≤ 0.8μm for maximum thermal contact.",
    customization: "Custom outer geometry, pocket seat dimensions, and thermal interface surface area per die design.",
    qualityNote: "Seating dimensions verified by precision measurement. Material certified as high-conductivity copper grade.",
    faqs: [
      {
        q: "How does a copper chill eliminate shrinkage porosity?",
        a: "Shrinkage porosity occurs when a thick section solidifies from the outside in, trapping liquid metal that contracts without a feed. A copper chill dramatically accelerates solidification in the section it contacts, promoting directional solidification toward the feeding path and eliminating the trapped liquid region."
      },
      {
        q: "Do copper chills need to be cooled with water?",
        a: "Not necessarily. In many applications, the chill operates as a passive heat sink — absorbing heat rapidly from the casting and releasing it to the surrounding die steel between shots. For very high-volume production or extreme thick sections, the copper chill can be drilled for direct water cooling for even faster extraction."
      },
      {
        q: "How long does a copper chill last?",
        a: "Copper is softer than steel and will gradually wear at the casting contact face. In most GDC and LPDC applications, copper chills last thousands to tens of thousands of shots before requiring replacement. They are designed as replaceable inserts for this reason."
      }
    ],
    images: [
      { url: "/products/copper-chills.png", alt: "Copper Chills for die casting — high-conductivity copper for localized rapid solidification" }
    ],
    isPublished: true,
    sortOrder: 15
  }
];
