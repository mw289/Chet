// Reference code mappings for physics simulations
export const REFERENCE_MAPPINGS = {
  pendulum: {
    keywords: ["pendulum", "swing", "oscillat", "harmonic", "period", "bob"],
    file: "pendulum.html",
    concepts: ["Simple Harmonic Motion", "Period", "Oscillation", "Energy Conservation"],
  },

  projectile: {
    keywords: ["projectile", "trajectory", "launch", "cannon", "ballistic", "parabola", "throw", "shoot"],
    file: "projectile.html",
    concepts: ["Projectile Motion", "Trajectory", "Range", "Vector Physics"],
  },

  spring: {
    keywords: ["spring", "oscillat", "hooke", "elastic", "vibrat", "mass spring", "simple harmonic", "shm"],
    file: "spring.html",
    concepts: ["Hooke's Law", "Simple Harmonic Motion", "Elastic Force", "Energy Conservation"],
  },

  moments: {
    keywords: ["moment", "torque", "lever", "balance", "pivot", "beam", "seesaw", "rotation", "angular"],
    file: "moments.html",
    concepts: ["Torque", "Rotational Dynamics", "Equilibrium", "Angular Motion"],
  },

  light: {
    keywords: ["light", "optic", "reflect", "refract", "mirror", "lens"],
    file: "light-reflection.html",
    concepts: ["Reflection", "Refraction", "Optics", "Light Physics"],
  },

  waves: {
    keywords: ["wave", "interferen", "diffraction", "frequency", "amplitude", "slit"],
    file: "wave-interference.html",
    concepts: ["Wave Interference", "Diffraction", "Superposition", "Wave Physics"],
  },

  doubleSlit: {
    keywords: ["double slit", "quantum", "particle wave"],
    file: "double-slit.html",
    concepts: ["Wave-Particle Duality", "Quantum Physics", "Interference Pattern"],
  },
}

export function selectReferenceType(userInput: string): string {
  const input = userInput.toLowerCase()

  // Check each reference type for keyword matches
  for (const [type, config] of Object.entries(REFERENCE_MAPPINGS)) {
    if (config.keywords.some((keyword) => input.includes(keyword))) {
      return type
    }
  }

  // Default fallback
  return "pendulum"
}

export function getPhysicsConcepts(referenceType: string): string[] {
  const config = REFERENCE_MAPPINGS[referenceType as keyof typeof REFERENCE_MAPPINGS]
  return config ? config.concepts : ["Physics Simulation", "Interactive Learning"]
}
