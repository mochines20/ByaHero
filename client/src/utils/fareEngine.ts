export type TransportMode = "jeepney" | "bus" | "lrt1" | "lrt2" | "mrt3" | "pnr" | "p2p" | "ferry";

export interface FareResult {
  mode: TransportMode;
  baseFare: number;
  regularFare: number;
  studentFare: number;
  seniorFare: number;
  pwdFare: number;
  currency: string;
}

const LRT1_FARES: Record<number, number> = {
  1: 13,
  2: 13,
  3: 13,
  4: 16,
  5: 16,
  6: 19,
  7: 19,
  8: 22,
  9: 22,
  10: 25,
  11: 25,
  12: 28,
  13: 28,
  14: 31,
  15: 31,
  16: 34,
  17: 34,
  18: 37,
  19: 37,
  20: 40,
  21: 40,
  22: 43,
  23: 43,
  24: 46,
  25: 46,
};

const MRT3_FARES: Record<number, number> = {
  1: 13,
  2: 13,
  3: 13,
  4: 16,
  5: 16,
  6: 19,
  7: 19,
  8: 22,
  9: 22,
  10: 25,
  11: 25,
  12: 28,
  13: 28,
};

export const P2P_FARES: Record<string, number> = {
  P2P_ORTMKT_1: 30,
  P2P_NEDMKT_1: 75,
  P2P_NEDORT_1: 60,
  P2P_ALAMKT_1: 80,
  P2P_ALAMKT_2: 80,
  P2P_ALAFRT_1: 100,
  P2P_FRVMKT_1: 100,
  P2P_BCRALA_1: 30,
  P2P_DASALA_1: 50,
  P2P_NVLMKT_1: 150,
  P2P_WEEKEND: 50,
};

const DISCOUNTS = {
  student: 0.5,
  senior: 0.8,
  pwd: 0.8,
};

function applyDiscounts(baseFare: number, mode: TransportMode) {
  const withStudentDiscount = ["lrt1", "lrt2", "mrt3", "pnr"].includes(mode);

  return {
    regularFare: baseFare,
    studentFare: withStudentDiscount ? Math.ceil(baseFare * DISCOUNTS.student) : baseFare,
    seniorFare: Math.ceil(baseFare * DISCOUNTS.senior),
    pwdFare: Math.ceil(baseFare * DISCOUNTS.pwd),
  };
}

export function calculateFare(
  mode: TransportMode,
  options: {
    distanceKm?: number;
    stationCount?: number;
    routeId?: string;
  }
): FareResult {
  const { distanceKm = 0, stationCount = 1, routeId = "" } = options;
  let baseFare = 0;

  switch (mode) {
    case "jeepney":
      baseFare = distanceKm <= 4 ? 13 : Math.ceil(13 + (distanceKm - 4) * 1.8);
      break;
    case "bus":
      baseFare = distanceKm <= 5 ? 15 : Math.ceil(15 + (distanceKm - 5) * 1.85);
      break;
    case "lrt1":
      baseFare = LRT1_FARES[stationCount] ?? 46;
      break;
    case "lrt2":
    case "mrt3":
      baseFare = MRT3_FARES[stationCount] ?? 28;
      break;
    case "pnr":
      baseFare = Math.ceil(15 + distanceKm * 1.5);
      break;
    case "p2p":
      baseFare = P2P_FARES[routeId] ?? 0;
      break;
    case "ferry":
      baseFare = 55;
      break;
    default:
      baseFare = 0;
  }

  return {
    mode,
    baseFare,
    currency: "PHP",
    ...applyDiscounts(baseFare, mode),
  };
}

export function calculateTripTotal(legs: FareResult[]) {
  return {
    total: legs.reduce((sum, leg) => sum + leg.regularFare, 0),
    studentTotal: legs.reduce((sum, leg) => sum + leg.studentFare, 0),
    seniorTotal: legs.reduce((sum, leg) => sum + leg.seniorFare, 0),
    pwdTotal: legs.reduce((sum, leg) => sum + leg.pwdFare, 0),
  };
}
