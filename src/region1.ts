import { _R } from "./constants";

// Region 1 coefficients
const REGION1_I = [
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5,
  8, 8, 21, 23, 29, 30, 31, 32,
];

const REGION1_J = [
  -2, -1, 0, 1, 2, 3, 4, 5, -9, -7, -1, 0, 1, 3, -3, 0, 1, 3, 17, -4, 0, 6, -5,
  -2, 10, -8, -11, -6, -29, -31, -38, -39, -40, -41,
];

const REGION1_N = [
  0.14632971213167,
  -0.84548187169114,
  -0.37563603672040e1,
  0.33855169168385e1,
  -0.95791963387872,
  0.15772038513228,
  -0.16616417199501e-1,
  0.81214629983568e-3,
  0.28319080123804e-3,
  -0.60706301565874e-3,
  -0.18990068218419e-1,
  -0.32529748770505e-1,
  -0.21841717175414e-1,
  -0.52838357969930e-4,
  -0.47184321073267e-3,
  -0.30001780793026e-3,
  0.47661393906987e-4,
  -0.44141845330846e-5,
  -0.72694996297594e-15,
  -0.31679644845054e-4,
  -0.28270797985312e-5,
  -0.85205128120103e-9,
  -0.22425281908000e-5,
  -0.65171222895601e-6,
  -0.14341729937924e-12,
  -0.40516996860117e-6,
  -0.12734301741641e-8,
  -0.17424871230634e-9,
  -0.68762131295531e-18,
  0.14478307828521e-19,
  0.26335781662795e-22,
  -0.11947622640071e-22,
  0.18228094581404e-23,
  -0.93537087292458e-25,
];
;


// Region 1 backward coefficients for p-h calculations
const REGION1_BACK_PH_I = [
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6,
];

const REGION1_BACK_PH_J = [
  0, 1, 2, 6, 22, 32, 0, 1, 2, 3, 4, 10, 32, 10, 32, 10, 32, 32, 32, 32,
];

const REGION1_BACK_PH_N = [
  -0.23872489924521e+3,
  0.40421188637945e+3,
  0.11349746881718e+3,
  -0.58457616048039e+1,
  -0.15285482413140e-3,
  -0.10866707695377e-5,
  -0.13391744872602e+2,
  0.43211039183559e+2,
  -0.54010067170506e+2,
  0.30535892203916e+2,
  -0.65964749423638e+1,
  0.93965400878363e-2,
  0.11573647505340e-6,
  -0.25858641282073e-4,
  -0.40644363084799e-8,
  0.66456186191635e-7,
  0.80670734103027e-10,
  -0.93477771213947e-12,
  0.58265442020601e-14,
  -0.15020185953503e-16,
];

// Region 1 backward coefficients for p-s calculations
const REGION1_BACK_PS_I = [
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4,
];

const REGION1_BACK_PS_J = [
  0, 1, 2, 3, 11, 31, 0, 1, 2, 3, 12, 31, 0, 1, 2, 9, 31, 10, 32, 32,
];

const REGION1_BACK_PS_N = [
  0.17478268058307e+03,
  0.34806930892873e+02,
  0.65292584978455e+01,
  0.33039981775489,
  -0.19281382923196e-06,
  -0.24909197244573e-22,
  -0.26107636489332,
  0.22592965981586,
  -0.64256463395226e-01,
  0.78876289270526e-02,
  0.35672110607366e-09,
  0.17332496994895e-23,
  0.56608900654837e-03,
  -0.32635483139717e-03,
  0.44778286690632e-04,
  -0.51322156908507e-09,
  -0.42522657042207e-25,
  0.26400441360689e-12,
  0.78124600459723e-28,
  -0.30732199903668e-30,
];

// ================    Region 1 Functions ===================

/**
 * Returns the region-1 tau
 * @param t Temperature in K
 * @returns tau value
 */
function tau_1(t: number): number {
  return 1386.0 / t;
}

/**
 * Returns the region-1 pi
 * @param p Pressure in Pa
 * @returns pi value
 */
function pi_1(p: number): number {
  return p / (16.53e6);
}

/**
 * Returns the region-1 gamma
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns gamma value
 */
function gamma_1(t: number, p: number): number {
  const tau = tau_1(t);
  const pi = pi_1(p);
  let sum = 0.0;

  for (let i = 0; i < REGION1_I.length; i++) {
    const ii = REGION1_I[i];
    const ji = REGION1_J[i];
    const ni = REGION1_N[i];
    sum += ni * Math.pow(7.1 - pi, ii) * Math.pow(tau - 1.222, ji);
  }

  return sum;
}

/**
 * Returns the region-1 gamma_pi
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns gamma_pi value
 */
function gamma_pi_1(t: number, p: number): number {
  const tau = tau_1(t);
  const pi = pi_1(p);
  let sum = 0.0;

  for (let i = 0; i < REGION1_I.length; i++) {
    const ii = REGION1_I[i];
    const ji = REGION1_J[i];
    const ni = REGION1_N[i];
    sum += -ni * ii * Math.pow(7.1 - pi, ii - 1) * Math.pow(tau - 1.222, ji);
  }

  return sum;
}

/**
 * Returns the region-1 gamma_pi_pi
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns gamma_pi_pi value
 */
function gamma_pi_pi_1(t: number, p: number): number {
  const tau = tau_1(t);
  const pi = pi_1(p);
  let sum = 0.0;

  for (let i = 0; i < REGION1_I.length; i++) {
    const ii = REGION1_I[i];
    const ji = REGION1_J[i];
    const ni = REGION1_N[i];
    sum += ni * ii * (ii - 1) * Math.pow(7.1 - pi, ii - 2) * Math.pow(tau - 1.222, ji);
  }

  return sum;
}

/**
 * Returns the region-1 gamma_tau
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns gamma_tau value
 */
function gamma_tau_1(t: number, p: number): number {
  const tau = tau_1(t);
  const pi = pi_1(p);
  let sum = 0.0;

  for (let i = 0; i < REGION1_I.length; i++) {
    const ii = REGION1_I[i];
    const ji = REGION1_J[i];
    const ni = REGION1_N[i];
    sum += ni * ji * Math.pow(7.1 - pi, ii) * Math.pow(tau - 1.222, ji - 1);
  }

  return sum;
}

/**
 * Returns the region-1 gamma_tau_tau
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns gamma_tau_tau value
 */
function gamma_tau_tau_1(t: number, p: number): number {
  const tau = tau_1(t);
  const pi = pi_1(p);
  let sum = 0.0;

  for (let i = 0; i < REGION1_I.length; i++) {
    const ii = REGION1_I[i];
    const ji = REGION1_J[i];
    const ni = REGION1_N[i];
    sum += ni * ji * (ji - 1) * Math.pow(7.1 - pi, ii) * Math.pow(tau - 1.222, ji - 2);
  }

  return sum;
}

/**
 * Returns the region-1 gamma_pi_tau
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns gamma_pi_tau value
 */
function gamma_pi_tau_1(t: number, p: number): number {
  const tau = tau_1(t);
  const pi = pi_1(p);
  let sum = 0.0;

  for (let i = 0; i < REGION1_I.length; i++) {
    const ii = REGION1_I[i];
    const ji = REGION1_J[i];
    const ni = REGION1_N[i];
    sum += -ni * ii * ji * Math.pow(7.1 - pi, ii - 1) * Math.pow(tau - 1.222, ji - 1);
  }

  return sum;
}

/**
 * Returns the region-1 specific volume
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns Specific volume in m³/kg
 */
export function v_tp_1(t: number, p: number): number {
  // The multiplication by 1000 is necessary to convert R from kJ/kg.K to J/kg.K
  return ((_R * 1000.0) * t / p) * pi_1(p) * gamma_pi_1(t, p);
}

/**
 * Returns the region-1 specific enthalpy
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns Specific enthalpy in kJ/kg
 */
export function h_tp_1(t: number, p: number): number {
  console.log({ t, p })
  return _R * t * tau_1(t) * gamma_tau_1(t, p);
}

/**
 * Returns the region-1 specific internal energy
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns Specific internal energy in kJ/kg
 */
export function u_tp_1(t: number, p: number): number {
  return _R * t * (tau_1(t) * gamma_tau_1(t, p) - pi_1(p) * gamma_pi_1(t, p));
}

/**
 * Returns the region-1 specific entropy
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns Specific entropy in kJ/(kg·K)
 */
export function s_tp_1(t: number, p: number): number {
  return _R * (tau_1(t) * gamma_tau_1(t, p) - gamma_1(t, p));
}

/**
 * Returns the region-1 specific isobaric heat capacity
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns Specific isobaric heat capacity in kJ/(kg·K)
 */
export function cp_tp_1(t: number, p: number): number {
  const tau = tau_1(t);
  return _R * (-Math.pow(tau, 2) * gamma_tau_tau_1(t, p));
}

/**
 * Returns the region-1 specific isochoric heat capacity
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns Specific isochoric heat capacity in kJ/(kg·K)
 */
export function cv_tp_1(t: number, p: number): number {
  const tau = tau_1(t);
  const corr = Math.pow(gamma_pi_1(t, p) - tau * gamma_pi_tau_1(t, p), 2) / gamma_pi_pi_1(t, p);
  return _R * (-Math.pow(tau, 2) * gamma_tau_tau_1(t, p) + corr);
}

/**
 * Returns the region-1 speed of sound
 * @param t Temperature in K
 * @param p Pressure in Pa
 * @returns Speed of sound in m/s
 */
export function w_tp_1(t: number, p: number): number {
  const tau = tau_1(t);
  const gamma_pi = gamma_pi_1(t, p);
  const gamma_pi_tau = gamma_pi_tau_1(t, p);
  const gamma_pi_pi = gamma_pi_pi_1(t, p);
  const gamma_tau_tau = gamma_tau_tau_1(t, p);
  const term = Math.pow(gamma_pi - tau * gamma_pi_tau, 2) / (Math.pow(tau, 2) * gamma_tau_tau);

  // The multiplication by 1000 is necessary to convert R from kJ/kg.K to J/kg.K
  const square = (_R * 1000.0) * t * (Math.pow(gamma_pi, 2) / (term - gamma_pi_pi));
  return Math.sqrt(square);
}

/**
 * Returns the region-1 eta for backwards calculations
 * @param h Enthalpy in kJ/kg
 * @returns eta value
 */
function eta_1_back(h: number): number {
  return h / 2500.0;
}

/**
 * Returns the region-1 pi for backwards calculations
 * @param p Pressure in Pa
 * @returns pi value
 */
function pi_1_back(p: number): number {
  return p / 1e6;
}

/**
 * Returns the region-1 sigma for backwards calculations
 * @param s Entropy in kJ/(kg·K)
 * @returns sigma value
 */
function sigma_1_back(s: number): number {
  return s;
}

/**
 * Returns the region-1 backward correlation for T(p,h)
 * @param p Pressure in Pa
 * @param h Enthalpy in kJ/kg
 * @returns Temperature in K
 */
export function t_ph_1(p: number, h: number): number {
  const eta = eta_1_back(h);
  const pi = pi_1_back(p);
  let sum = 0.0;

  for (let i = 0; i < REGION1_BACK_PH_I.length; i++) {
    const ii = REGION1_BACK_PH_I[i];
    const ji = REGION1_BACK_PH_J[i];
    const ni = REGION1_BACK_PH_N[i];
    sum += ni * Math.pow(pi, ii) * Math.pow(eta + 1.0, ji);
  }

  return sum;
}

/**
 * Returns the region-1 backward correlation for T(p,s)
 * @param p Pressure in Pa
 * @param s Entropy in kJ/(kg·K)
 * @returns Temperature in K
 */
export function t_ps_1(p: number, s: number): number {
  const sig = sigma_1_back(s);
  const pi = pi_1_back(p);
  let sum = 0.0;

  for (let i = 0; i < REGION1_BACK_PS_I.length; i++) {
    const ii = REGION1_BACK_PS_I[i];
    const ji = REGION1_BACK_PS_J[i];
    const ni = REGION1_BACK_PS_N[i];
    sum += ni * Math.pow(pi, ii) * Math.pow(sig + 2.0, ji);
  }

  return sum;
}

// Export constants for testing
export const constants = {
  REGION1_I,
  REGION1_J,
  REGION1_N,
  REGION1_BACK_PH_I,
  REGION1_BACK_PH_J,
  REGION1_BACK_PH_N,
  REGION1_BACK_PS_I,
  REGION1_BACK_PS_J,
  REGION1_BACK_PS_N,
  _R
};
