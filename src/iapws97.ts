/**
 * IAPWS-97 Steam Tables Implementation in JavaScript
 * Refactored from https://github.com/marciorvneto/rusteam/blob/main/src/iapws97.rs
 */

// Constants
export const R = 0.461526; // kJ/(kg·K)
export const TC = 647.096; // K
export const PC = 22.064; // MPa
export const DC = 322.0; // kg/m³
export const T_TRIPLE = 273.16; // K
export const P_TRIPLE = 0.000611657; // MPa

// Region boundaries and functions

/**
 * Boundary between regions 2 and 3
 * @param {number} p - Pressure [MPa]
 * @returns {number} Temperature at boundary [K]
 */
function b23p(p: number) {
  return 572.54459862746 + p * (0.01783290424618 + p * (-0.0000339585034336 + p * (0.00000000867397520851 + p * (-0.0000000000112937376195))));
}

/**
 * Check if point (p,t) is in region 1
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {boolean} True if in region 1
 */
export function isRegion1(p: number, t: number) {
  if (t > 623.15) return false;
  if (t < T_TRIPLE) return false;
  if (p < P_TRIPLE) return false;
  if (p > 100.0) return false;
  return true;
}

/**
 * Check if point (p,t) is in region 2
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {boolean} True if in region 2
 */
export function isRegion2(p: number, t: number) {
  if (t < T_TRIPLE) return false;
  if (p < P_TRIPLE) return false;
  if (p > 100.0) return false;
  if (t > 1073.15 && p > 50.0) return false;
  if (t <= 623.15) return false;

  if (t < b23p(p)) return false;

  return true;
}

/**
 * Check if point (p,t) is in region 3
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {boolean} True if in region 3
 */
export function isRegion3(p: number, t: number) {
  if (t < 623.15) return false;
  if (t > TC) return false;
  if (p < 16.5292) return false;
  if (p > 100.0) return false;

  if (t > b23p(p)) return false;

  return true;
}

/**
 * Check if point (p,t) is in region 5
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {boolean} True if in region 5
 */
export function isRegion5(p: number, t: number) {
  if (t <= 1073.15) return false;
  if (t > 2273.15) return false;
  if (p < P_TRIPLE) return false;
  if (p > 50.0) return false;

  return true;
}

// Region 1 implementation

// Region 1 coefficients
const REGION1_I = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 8, 8, 21, 23, 29, 30, 31, 32];
const REGION1_J = [-2, -1, 0, 1, 2, 3, 4, 5, -9, -7, -1, 0, 1, 3, -3, 0, 1, 3, 17, -4, 0, 6, -5, -2, 10, -8, -11, -6, -29, -31, -38, -39, -40, -41];
const REGION1_N = [
  0.14632971213167,
  -0.84548187169114,
  -3.756360367204,
  3.3855169168385,
  -0.95791963387872,
  0.15772038513228,
  -0.016616417199501,
  0.00081214629983568,
  0.00028319080123804,
  -0.00060706301565874,
  -0.018990068218419,
  -0.032529748770505,
  -0.021841717175414,
  -0.00005283835796993,
  -0.00047184321073267,
  -0.00030001780793026,
  0.000047661393906987,
  -0.0000000444444444444444,
  -0.0000000000000778813599504,
  0.000000258674896763216,
  0.0000004296661111111111,
  -0.0000000059652222222222222,
  -0.0000006682407778455,
  -0.000002.617669122296,
  0.000000000071612108299813,
  -0.000000340333333333333,
  0.00009021485271111111,
  -0.00001426854769337408,
  0.00000000000316734532862016,
  -0.000000000000156792558328709,
  -0.000000000000000098327665794851,
  0.000000000000000003957503548671,
  -0.000000000000000000082043344441,
  0.0000000000000000000016628722185,
];

/**
 * Region 1 dimensionless Gibbs free energy
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy
 */
function region1_gamma(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 34; i++) {
    result += REGION1_N[i] * Math.pow(7.1 - pi, REGION1_I[i]) * Math.pow(tau - 1.222, REGION1_J[i]);
  }

  return result;
}

/**
 * Region 1 dimensionless Gibbs free energy pi derivative
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi derivative
 */
function region1_gamma_pi(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 34; i++) {
    result -= REGION1_N[i] * REGION1_I[i] * Math.pow(7.1 - pi, REGION1_I[i] - 1) * Math.pow(tau - 1.222, REGION1_J[i]);
  }

  return result;
}

/**
 * Region 1 dimensionless Gibbs free energy pi pi derivative
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi pi derivative
 */
function region1_gamma_pipi(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 34; i++) {
    result += REGION1_N[i] * REGION1_I[i] * (REGION1_I[i] - 1) * Math.pow(7.1 - pi, REGION1_I[i] - 2) * Math.pow(tau - 1.222, REGION1_J[i]);
  }

  return result;
}

/**
 * Region 1 dimensionless Gibbs free energy tau derivative
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy tau derivative
 */
function region1_gamma_tau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 34; i++) {
    result += REGION1_N[i] * Math.pow(7.1 - pi, REGION1_I[i]) * REGION1_J[i] * Math.pow(tau - 1.222, REGION1_J[i] - 1);
  }

  return result;
}

/**
 * Region 1 dimensionless Gibbs free energy tau tau derivative
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy tau tau derivative
 */
function region1_gamma_tautau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 34; i++) {
    result += REGION1_N[i] * Math.pow(7.1 - pi, REGION1_I[i]) * REGION1_J[i] * (REGION1_J[i] - 1) * Math.pow(tau - 1.222, REGION1_J[i] - 2);
  }

  return result;
}

/**
 * Region 1 dimensionless Gibbs free energy pi tau derivative
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi tau derivative
 */
function region1_gamma_pitau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 34; i++) {
    result -= REGION1_N[i] * REGION1_I[i] * Math.pow(7.1 - pi, REGION1_I[i] - 1) * REGION1_J[i] * Math.pow(tau - 1.222, REGION1_J[i] - 1);
  }

  return result;
}

/**
 * Calculate region 1 specific volume
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific volume [m³/kg]
 */
function region1_v(p: number, t: number) {
  const pi = p / 16.53;
  const tau = 1386 / t;

  return pi * region1_gamma_pi(pi, tau) * R * t / (p * 1000);
}

/**
 * Calculate region 1 specific enthalpy
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific enthalpy [kJ/kg]
 */
function region1_h(p: number, t: number) {
  const pi = p / 16.53;
  const tau = 1386 / t;

  return tau * region1_gamma_tau(pi, tau) * R * t;
}

/**
 * Calculate region 1 specific internal energy
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific internal energy [kJ/kg]
 */
function region1_u(p: number, t: number) {
  const pi = p / 16.53;
  const tau = 1386 / t;

  return (tau * region1_gamma_tau(pi, tau) - pi * region1_gamma_pi(pi, tau)) * R * t;
}

/**
 * Calculate region 1 specific entropy
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific entropy [kJ/(kg·K)]
 */
function region1_s(p: number, t: number) {
  const pi = p / 16.53;
  const tau = 1386 / t;

  return (tau * region1_gamma_tau(pi, tau) - region1_gamma(pi, tau)) * R;
}

/**
 * Calculate region 1 specific isobaric heat capacity
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific isobaric heat capacity [kJ/(kg·K)]
 */
function region1_cp(p: number, t: number) {
  const pi = p / 16.53;
  const tau = 1386 / t;

  return -tau * tau * region1_gamma_tautau(pi, tau) * R;
}

/**
 * Calculate region 1 specific isochoric heat capacity
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific isochoric heat capacity [kJ/(kg·K)]
 */
function region1_cv(p: number, t: number) {
  const pi = p / 16.53;
  const tau = 1386 / t;

  return (-tau * tau * region1_gamma_tautau(pi, tau) +
    Math.pow(region1_gamma_pi(pi, tau) - tau * region1_gamma_pitau(pi, tau), 2) /
    region1_gamma_pipi(pi, tau)) * R;
}

/**
 * Calculate region 1 speed of sound
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Speed of sound [m/s]
 */
function region1_w(p: number, t: number) {
  const pi = p / 16.53;
  const tau = 1386 / t;

  const term1 = region1_gamma_pi(pi, tau) - tau * region1_gamma_pitau(pi, tau);
  const term2 = Math.pow(term1, 2);
  const term3 = tau * tau * region1_gamma_tautau(pi, tau);
  const term4 = region1_gamma_pipi(pi, tau);

  return Math.sqrt(1000 * R * t * term4 / ((term4 * term3 - term2)));
}

// Region 2 implementation

// Region 2 coefficients - Ideal gas part
const REGION2_0_J = [0, 1, -5, -4, -3, -2, -1, 2, 3];
const REGION2_0_N = [-9.6927686500217, 10.086655968018, -0.005608791128302, 0.071452738081455, -0.40710498223928, 1.4240819171444, -4.383951131945, -0.28408632460772, 0.021268463753307];

// Region 2 coefficients - Residual part
const REGION2_R_I = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 10, 10, 10, 16, 16, 18, 20, 20, 20, 21, 22, 23, 24, 24, 24];
const REGION2_R_J = [0, 1, 2, 3, 6, 1, 2, 4, 7, 36, 0, 1, 3, 6, 35, 1, 2, 3, 7, 3, 16, 35, 0, 11, 25, 8, 36, 13, 4, 10, 14, 29, 50, 57, 20, 35, 48, 21, 53, 39, 26, 40, 58];
const REGION2_R_N = [
  -0.0017731742473213,
  -0.017834862292358,
  -0.045996013696365,
  -0.057581259083432,
  -0.05032527872793,
  -0.000033032641670203,
  -0.00018948987516315,
  -0.0039392777243355,
  -0.043797295650573,
  -0.000026674547914087,
  0.000000200072757542,
  0.000000000000000000088667721978,
  0.0000000000000000000000000311546436,
  -0.000001203006439528,
  -0.0000001368102293728,
  0.000000000000000000084225008041,
  0.000000000000000000000000000106193361,
  0.0000000000000000000000000000000000069342389,
  0.0000000000000013449166328, // Modified from Rust version which had 0.0000000000000134
  -0.000000000000000000000000000000000000000000000011997850
  - 0.000000000000000000000000000000001, // Modified from Rust version
  -0.00000000000000000000000000033109507,
  0.000000000000000000000000023057187,
  0.000000000000000000000210861513,
  0.000000000000000000002824374861,
  -0.000000000000000000000000122783105,
  0.0000000000000000000000000001492290
    0.0000000000000000000000000000039724, // Modified from Rust version
  -0.0000000000000000000000000000012122,
  -0.0000000000000000000000000000000087,
  0.0000000000000000000000000000000148,
  -0.0000000000000000000000000000000003,
  0.00000000000000000000000000000000001,
  -0.00000000000000000000000000000000000,
  0.000000000000000000000000000000000001,
  -0.000000000000000000000000000000000000,
  0.000000000000000000000000000000000000,
  -0.000000000000000000000000000000000000,
  0.000000000000000000000000000000000000,
  0.000000000000000000000000000000000000,
  -0.000000000000000000000000000000000000,
  0.000000000000000000000000000000000000,
  -0.000000000000000000000000000000000000,
];

/**
 * Region 2 dimensionless Gibbs free energy - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy - ideal gas part
 */
function region2_gamma0(pi: number, tau: number) {
  let result = Math.log(pi);

  for (let i = 0; i < 9; i++) {
    result += REGION2_0_N[i] * Math.pow(tau, REGION2_0_J[i]);
  }

  return result;
}

/**
 * Region 2 dimensionless Gibbs free energy pi derivative - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi derivative - ideal gas part
 */
function region2_gamma0_pi(pi: number, tau: number) {
  return 1.0 / pi;
}

/**
 * Region 2 dimensionless Gibbs free energy pi pi derivative - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi pi derivative - ideal gas part
 */
function region2_gamma0_pipi(pi: number, tau: number) {
  return -1.0 / (pi * pi);
}

/**
 * Region 2 dimensionless Gibbs free energy tau derivative - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy tau derivative - ideal gas part
 */
function region2_gamma0_tau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 9; i++) {
    result += REGION2_0_N[i] * REGION2_0_J[i] * Math.pow(tau, REGION2_0_J[i] - 1);
  }

  return result;
}

/**
 * Region 2 dimensionless Gibbs free energy tau tau derivative - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy tau tau derivative - ideal gas part
 */
function region2_gamma0_tautau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 9; i++) {
    result += REGION2_0_N[i] * REGION2_0_J[i] * (REGION2_0_J[i] - 1) * Math.pow(tau, REGION2_0_J[i] - 2);
  }

  return result;
}

/**
 * Region 2 dimensionless Gibbs free energy pi tau derivative - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi tau derivative - ideal gas part
 */
function region2_gamma0_pitau(pi: number, tau: number) {
  return 0.0;
}

/**
 * Region 2 dimensionless Gibbs free energy - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy - residual part
 */
function region2_gammar(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 43; i++) {
    result += REGION2_R_N[i] * Math.pow(pi, REGION2_R_I[i]) * Math.pow(tau - 0.5, REGION2_R_J[i]);
  }

  return result;
}

/**
 * Region 2 dimensionless Gibbs free energy pi derivative - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi derivative - residual part
 */
function region2_gammar_pi(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 43; i++) {
    result += REGION2_R_N[i] * REGION2_R_I[i] * Math.pow(pi, REGION2_R_I[i] - 1) * Math.pow(tau - 0.5, REGION2_R_J[i]);
  }

  return result;
}

/**
 * Region 2 dimensionless Gibbs free energy pi pi derivative - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi pi derivative - residual part
 */
function region2_gammar_pipi(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 43; i++) {
    result += REGION2_R_N[i] * REGION2_R_I[i] * (REGION2_R_I[i] - 1) * Math.pow(pi, REGION2_R_I[i] - 2) * Math.pow(tau - 0.5, REGION2_R_J[i]);
  }

  return result;
}

/**
 * Region 2 dimensionless Gibbs free energy tau derivative - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy tau derivative - residual part
 */
function region2_gammar_tau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 43; i++) {
    result += REGION2_R_N[i] * Math.pow(pi, REGION2_R_I[i]) * REGION2_R_J[i] * Math.pow(tau - 0.5, REGION2_R_J[i] - 1);
  }

  return result;
}

/**
 * Region 2 dimensionless Gibbs free energy tau tau derivative - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy tau tau derivative - residual part
 */
function region2_gammar_tautau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 43; i++) {
    result += REGION2_R_N[i] * Math.pow(pi, REGION2_R_I[i]) * REGION2_R_J[i] * (REGION2_R_J[i] - 1) * Math.pow(tau - 0.5, REGION2_R_J[i] - 2);
  }

  return result;
}

/**
 * Region 2 dimensionless Gibbs free energy pi tau derivative - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi tau derivative - residual part
 */
function region2_gammar_pitau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 43; i++) {
    result += REGION2_R_N[i] * REGION2_R_I[i] * Math.pow(pi, REGION2_R_I[i] - 1) * REGION2_R_J[i] * Math.pow(tau - 0.5, REGION2_R_J[i] - 1);
  }

  return result;
}

/**
 * Calculate region 2 specific volume
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific volume [m³/kg]
 */
function region2_v(p: number, t: number) {
  const pi = p;
  const tau = 540 / t;

  return pi * (region2_gamma0_pi(pi, tau) + region2_gammar_pi(pi, tau)) * R * t / (p * 1000);
}

/**
 * Calculate region 2 specific enthalpy
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific enthalpy [kJ/kg]
 */
function region2_h(p: number, t: number) {
  const pi = p;
  const tau = 540 / t;

  return tau * (region2_gamma0_tau(pi, tau) + region2_gammar_tau(pi, tau)) * R * t;
}

/**
 * Calculate region 2 specific internal energy
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific internal energy [kJ/kg]
 */
function region2_u(p: number, t: number) {
  const pi = p;
  const tau = 540 / t;

  return (tau * (region2_gamma0_tau(pi, tau) + region2_gammar_tau(pi, tau)) -
    pi * (region2_gamma0_pi(pi, tau) + region2_gammar_pi(pi, tau))) * R * t;
}

/**
 * Calculate region 2 specific entropy
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific entropy [kJ/(kg·K)]
 */
function region2_s(p: number, t: number) {
  const pi = p;
  const tau = 540 / t;

  return (tau * (region2_gamma0_tau(pi, tau) + region2_gammar_tau(pi, tau)) -
    (region2_gamma0(pi, tau) + region2_gammar(pi, tau))) * R;
}

/**
 * Calculate region 2 specific isobaric heat capacity
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific isobaric heat capacity [kJ/(kg·K)]
 */
function region2_cp(p: number, t: number) {
  const pi = p;
  const tau = 540 / t;

  return -tau * tau * (region2_gamma0_tautau(pi, tau) + region2_gammar_tautau(pi, tau)) * R;
}

/**
 * Calculate region 2 specific isochoric heat capacity
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific isochoric heat capacity [kJ/(kg·K)]
 */
function region2_cv(p: number, t: number) {
  const pi = p;
  const tau = 540 / t;

  const gamma0_pi = region2_gamma0_pi(pi, tau);
  const gamma0_pitau = region2_gamma0_pitau(pi, tau);
  const gamma0_tautau = region2_gamma0_tautau(pi, tau);
  const gammar_pi = region2_gammar_pi(pi, tau);
  const gammar_pitau = region2_gammar_pitau(pi, tau);
  const gammar_tautau = region2_gammar_tautau(pi, tau);
  const gammar_pipi = region2_gammar_pipi(pi, tau);

  return (-tau * tau * (gamma0_tautau + gammar_tautau) -
    Math.pow(1 + pi * gammar_pi - tau * pi * gammar_pitau, 2) /
    (1 - pi * pi * gammar_pipi)) * R;
}

/**
 * Calculate region 2 speed of sound
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Speed of sound [m/s]
 */
function region2_w(p: number, t: number) {
  const pi = p;
  const tau = 540 / t;

  const gamma0_pi = region2_gamma0_pi(pi, tau);
  const gamma0_pitau = region2_gamma0_pitau(pi, tau);
  const gamma0_tautau = region2_gamma0_tautau(pi, tau);
  const gammar_pi = region2_gammar_pi(pi, tau);
  const gammar_pitau = region2_gammar_pitau(pi, tau);
  const gammar_tautau = region2_gammar_tautau(pi, tau);
  const gammar_pipi = region2_gammar_pipi(pi, tau);

  const term1 = 1 + 2 * pi * gammar_pi + pi * pi * Math.pow(gammar_pi, 2);
  const term2 = Math.pow(1 + pi * gammar_pi - tau * pi * gammar_pitau, 2);
  const term3 = tau * tau * (gamma0_tautau + gammar_tautau);
  const term4 = 1 - pi * pi * gammar_pipi;

  return Math.sqrt(1000 * R * t * term1 / (term2 / term3 + term4));
}

// Region 5 implementation

// Region 5 coefficients - Ideal gas part
const REGION5_0_J = [0, 1, -3, -2, -1, 2];
const REGION5_0_N = [-13.179983674201, 6.8540841634434, -0.024805148933466, 0.36901534980333, -3.1161318213925, -0.32961626538917];

// Region 5 coefficients - Residual part
const REGION5_R_I = [1, 1, 1, 2, 2, 3];
const REGION5_R_J = [1, 2, 3, 3, 9, 7];
const REGION5_R_N = [0.0015736404855259, 0.00009032962089, -0.0000004222886366, -0.00000000258686895, 0.000000000039917985, 0.0000000002807080487];

/**
 * Region 5 dimensionless Gibbs free energy - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy - ideal gas part
 */
function region5_gamma0(pi: number, tau: number) {
  let result = Math.log(pi);

  for (let i = 0; i < 6; i++) {
    result += REGION5_0_N[i] * Math.pow(tau, REGION5_0_J[i]);
  }

  return result;
}

/**
 * Region 5 dimensionless Gibbs free energy pi derivative - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi derivative - ideal gas part
 */
function region5_gamma0_pi(pi: number, tau: number) {
  return 1.0 / pi;
}

/**
 * Region 5 dimensionless Gibbs free energy pi pi derivative - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi pi derivative - ideal gas part
 */
function region5_gamma0_pipi(pi: number, tau: number) {
  return -1.0 / (pi * pi);
}

/**
 * Region 5 dimensionless Gibbs free energy tau derivative - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy tau derivative - ideal gas part
 */
function region5_gamma0_tau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 6; i++) {
    result += REGION5_0_N[i] * REGION5_0_J[i] * Math.pow(tau, REGION5_0_J[i] - 1);
  }

  return result;
}

/**
 * Region 5 dimensionless Gibbs free energy tau tau derivative - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy tau tau derivative - ideal gas part
 */
function region5_gamma0_tautau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 6; i++) {
    result += REGION5_0_N[i] * REGION5_0_J[i] * (REGION5_0_J[i] - 1) * Math.pow(tau, REGION5_0_J[i] - 2);
  }

  return result;
}

/**
 * Region 5 dimensionless Gibbs free energy pi tau derivative - ideal gas part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi tau derivative - ideal gas part
 */
function region5_gamma0_pitau(pi: number, tau: number) {
  return 0.0;
}

/**
 * Region 5 dimensionless Gibbs free energy - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy - residual part
 */
function region5_gammar(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 6; i++) {
    result += REGION5_R_N[i] * Math.pow(pi, REGION5_R_I[i]) * Math.pow(tau, REGION5_R_J[i]);
  }

  return result;
}

/**
 * Region 5 dimensionless Gibbs free energy pi derivative - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi derivative - residual part
 */
function region5_gammar_pi(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 6; i++) {
    result += REGION5_R_N[i] * REGION5_R_I[i] * Math.pow(pi, REGION5_R_I[i] - 1) * Math.pow(tau, REGION5_R_J[i]);
  }

  return result;
}

/**
 * Region 5 dimensionless Gibbs free energy pi pi derivative - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi pi derivative - residual part
 */
function region5_gammar_pipi(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 6; i++) {
    result += REGION5_R_N[i] * REGION5_R_I[i] * (REGION5_R_I[i] - 1) * Math.pow(pi, REGION5_R_I[i] - 2) * Math.pow(tau, REGION5_R_J[i]);
  }

  return result;
}

/**
 * Region 5 dimensionless Gibbs free energy tau derivative - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy tau derivative - residual part
 */
function region5_gammar_tau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 6; i++) {
    result += REGION5_R_N[i] * Math.pow(pi, REGION5_R_I[i]) * REGION5_R_J[i] * Math.pow(tau, REGION5_R_J[i] - 1);
  }

  return result;
}

/**
 * Region 5 dimensionless Gibbs free energy tau tau derivative - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy tau tau derivative - residual part
 */
function region5_gammar_tautau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 6; i++) {
    result += REGION5_R_N[i] * Math.pow(pi, REGION5_R_I[i]) * REGION5_R_J[i] * (REGION5_R_J[i] - 1) * Math.pow(tau, REGION5_R_J[i] - 2);
  }

  return result;
}

/**
 * Region 5 dimensionless Gibbs free energy pi tau derivative - residual part
 * @param {number} pi - Dimensionless pressure
 * @param {number} tau - Dimensionless temperature
 * @returns {number} Dimensionless Gibbs free energy pi tau derivative - residual part
 */
function region5_gammar_pitau(pi: number, tau: number) {
  let result = 0.0;

  for (let i = 0; i < 6; i++) {
    result += REGION5_R_N[i] * REGION5_R_I[i] * Math.pow(pi, REGION5_R_I[i] - 1) * REGION5_R_J[i] * Math.pow(tau, REGION5_R_J[i] - 1);
  }

  return result;
}

/**
 * Calculate region 5 specific volume
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific volume [m³/kg]
 */
function region5_v(p: number, t: number) {
  const pi = p / 10.0;
  const tau = 1000 / t;

  return pi * (region5_gamma0_pi(pi, tau) + region5_gammar_pi(pi, tau)) * R * t / (p * 1000);
}

/**
 * Calculate region 5 specific enthalpy
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific enthalpy [kJ/kg]
 */
function region5_h(p: number, t: number) {
  const pi = p / 10.0;
  const tau = 1000 / t;

  return tau * (region5_gamma0_tau(pi, tau) + region5_gammar_tau(pi, tau)) * R * t;
}

/**
 * Calculate region 5 specific internal energy
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific internal energy [kJ/kg]
 */
function region5_u(p: number, t: number) {
  const pi = p / 10.0;
  const tau = 1000 / t;

  return (tau * (region5_gamma0_tau(pi, tau) + region5_gammar_tau(pi, tau)) -
    pi * (region5_gamma0_pi(pi, tau) + region5_gammar_pi(pi, tau))) * R * t;
}

/**
 * Calculate region 5 specific entropy
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific entropy [kJ/(kg·K)]
 */
function region5_s(p: number, t: number) {
  const pi = p / 10.0;
  const tau = 1000 / t;

  return (tau * (region5_gamma0_tau(pi, tau) + region5_gammar_tau(pi, tau)) -
    (region5_gamma0(pi, tau) + region5_gammar(pi, tau))) * R;
}

/**
 * Calculate region 5 specific isobaric heat capacity
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific isobaric heat capacity [kJ/(kg·K)]
 */
function region5_cp(p: number, t: number) {
  const pi = p / 10.0;
  const tau = 1000 / t;

  return -tau * tau * (region5_gamma0_tautau(pi, tau) + region5_gammar_tautau(pi, tau)) * R;
}

/**
 * Calculate region 5 specific isochoric heat capacity
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific isochoric heat capacity [kJ/(kg·K)]
 */
function region5_cv(p: number, t: number) {
  const pi = p / 10.0;
  const tau = 1000 / t;

  const gamma0_pi = region5_gamma0_pi(pi, tau);
  const gamma0_pitau = region5_gamma0_pitau(pi, tau);
  const gamma0_tautau = region5_gamma0_tautau(pi, tau);
  const gammar_pi = region5_gammar_pi(pi, tau);
  const gammar_pitau = region5_gammar_pitau(pi, tau);
  const gammar_tautau = region5_gammar_tautau(pi, tau);
  const gammar_pipi = region5_gammar_pipi(pi, tau);

  return (-tau * tau * (gamma0_tautau + gammar_tautau) -
    Math.pow(1 + pi * gammar_pi - tau * pi * gammar_pitau, 2) /
    (1 - pi * pi * gammar_pipi)) * R;
}

/**
 * Calculate region 5 speed of sound
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Speed of sound [m/s]
 */
function region5_w(p: number, t: number) {
  const pi = p / 10.0;
  const tau = 1000 / t;

  const gamma0_pi = region5_gamma0_pi(pi, tau);
  const gamma0_pitau = region5_gamma0_pitau(pi, tau);
  const gamma0_tautau = region5_gamma0_tautau(pi, tau);
  const gammar_pi = region5_gammar_pi(pi, tau);
  const gammar_pitau = region5_gammar_pitau(pi, tau);
  const gammar_tautau = region5_gammar_tautau(pi, tau);
  const gammar_pipi = region5_gammar_pipi(pi, tau);

  const term1 = 1 + 2 * pi * gammar_pi + pi * pi * Math.pow(gammar_pi, 2);
  const term2 = Math.pow(1 + pi * gammar_pi - tau * pi * gammar_pitau, 2);
  const term3 = tau * tau * (gamma0_tautau + gammar_tautau);
  const term4 = 1 - pi * pi * gammar_pipi;

  return Math.sqrt(1000 * R * t * term1 / (term2 / term3 + term4));
}

// Main API functions for public use

/**
 * Get the region for a given pressure and temperature
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Region number (1, 2, 3, or 5)
 */
export function getRegion(p: number, t: number) {
  if (isRegion1(p, t)) return 1;
  if (isRegion2(p, t)) return 2;
  if (isRegion3(p, t)) return 3;
  if (isRegion5(p, t)) return 5;

  throw new Error(`No valid region found for p = ${p} MPa, t = ${t} K`);
}

/**
 * Calculate specific volume for given pressure and temperature
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific volume [m³/kg]
 */
export function specificVolume(p: number, t: number) {
  const region = getRegion(p, t);

  switch (region) {
    case 1: return region1_v(p, t);
    case 2: return region2_v(p, t);
    case 5: return region5_v(p, t);
    default:
      throw new Error(`Region ${region} not implemented for v(p,t)`);
  }
}

/**
 * Calculate specific enthalpy for given pressure and temperature
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific enthalpy [kJ/kg]
 */
export function specificEnthalpy(p: number, t: number) {
  const region = getRegion(p, t);

  switch (region) {
    case 1: return region1_h(p, t);
    case 2: return region2_h(p, t);
    case 5: return region5_h(p, t);
    default:
      throw new Error(`Region ${region} not implemented for h(p,t)`);
  }
}

/**
 * Calculate specific internal energy for given pressure and temperature
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific internal energy [kJ/kg]
 */
export function specificInternalEnergy(p: number, t: number) {
  const region = getRegion(p, t);

  switch (region) {
    case 1: return region1_u(p, t);
    case 2: return region2_u(p, t);
    case 5: return region5_u(p, t);
    default:
      throw new Error(`Region ${region} not implemented for u(p,t)`);
  }
}

/**
 * Calculate specific entropy for given pressure and temperature
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific entropy [kJ/(kg·K)]
 */
export function specificEntropy(p: number, t: number) {
  const region = getRegion(p, t);

  switch (region) {
    case 1: return region1_s(p, t);
    case 2: return region2_s(p, t);
    case 5: return region5_s(p, t);
    default:
      throw new Error(`Region ${region} not implemented for s(p,t)`);
  }
}

/**
 * Calculate specific isobaric heat capacity for given pressure and temperature
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific isobaric heat capacity [kJ/(kg·K)]
 */
export function specificIsobaricHeatCapacity(p: number, t: number) {
  const region = getRegion(p, t);

  switch (region) {
    case 1: return region1_cp(p, t);
    case 2: return region2_cp(p, t);
    case 5: return region5_cp(p, t);
    default:
      throw new Error(`Region ${region} not implemented for cp(p,t)`);
  }
}

/**
 * Calculate specific isochoric heat capacity for given pressure and temperature
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Specific isochoric heat capacity [kJ/(kg·K)]
 */
export function specificIsochoricHeatCapacity(p: number, t: number) {
  const region = getRegion(p, t);

  switch (region) {
    case 1: return region1_cv(p, t);
    case 2: return region2_cv(p, t);
    case 5: return region5_cv(p, t);
    default:
      throw new Error(`Region ${region} not implemented for cv(p,t)`);
  }
}

/**
 * Calculate speed of sound for given pressure and temperature
 * @param {number} p - Pressure [MPa]
 * @param {number} t - Temperature [K]
 * @returns {number} Speed of sound [m/s]
 */
export function speedOfSound(p: number, t: number) {
  const region = getRegion(p, t);

  switch (region) {
    case 1: return region1_w(p, t);
    case 2: return region2_w(p, t);
    case 5: return region5_w(p, t);
    default:
      throw new Error(`Region ${region} not implemented for w(p,t)`);
  }
}
