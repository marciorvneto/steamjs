import {
  v_tp_1,
  h_tp_1,
  u_tp_1,
  s_tp_1,
  cp_tp_1,
  cv_tp_1,
  w_tp_1,
  t_ph_1,
  t_ps_1
} from './region1';

describe('IAPWS97 Region 1', () => {
  // Helper function to compare floating point values with specified precision
  function approxEqual(a: number, b: number, precision: number = 9): boolean {
    const epsilon = Math.pow(10, -precision);
    return Math.abs(a - b) < epsilon;
  }

  describe('specific_volume', () => {
    test('v_tp_1(300.0, 3e6) * 1e2 should be approximately 0.100215168', () => {
      const result = v_tp_1(300.0, 3e6) * 1e2;
      console.log(result)
      expect(approxEqual(result, 0.100215168)).toBe(true);
    });

    test('v_tp_1(300.0, 80e6) * 1e3 should be approximately 0.971180894', () => {
      const result = v_tp_1(300.0, 80e6) * 1e3;
      expect(approxEqual(result, 0.971180894)).toBe(true);
    });

    test('v_tp_1(500.0, 3e6) * 1e2 should be approximately 0.120241800', () => {
      const result = v_tp_1(500.0, 3e6) * 1e2;
      expect(approxEqual(result, 0.120241800)).toBe(true);
    });
  });

  describe('enthalpy', () => {
    test('h_tp_1(300.0, 3e6) / 1e3 should be approximately 0.115331273', () => {
      const result = h_tp_1(300.0, 3e6) / 1e3;
      expect(approxEqual(result, 0.115331273)).toBe(true);
    });

    test('h_tp_1(300.0, 80e6) / 1e3 should be approximately 0.184142828', () => {
      const result = h_tp_1(300.0, 80e6) / 1e3;
      expect(approxEqual(result, 0.184142828)).toBe(true);
    });

    test('h_tp_1(500.0, 3e6) / 1e3 should be approximately 0.975542239', () => {
      const result = h_tp_1(500.0, 3e6) / 1e3;
      expect(approxEqual(result, 0.975542239)).toBe(true);
    });
  });

  describe('internal_energy', () => {
    test('u_tp_1(300.0, 3e6) / 1e3 should be approximately 0.112324818', () => {
      const result = u_tp_1(300.0, 3e6) / 1e3;
      expect(approxEqual(result, 0.112324818)).toBe(true);
    });

    test('u_tp_1(300.0, 80e6) / 1e3 should be approximately 0.106448356', () => {
      const result = u_tp_1(300.0, 80e6) / 1e3;
      expect(approxEqual(result, 0.106448356)).toBe(true);
    });

    test('u_tp_1(500.0, 3e6) / 1e3 should be approximately 0.971934985', () => {
      const result = u_tp_1(500.0, 3e6) / 1e3;
      expect(approxEqual(result, 0.971934985)).toBe(true);
    });
  });

  describe('entropy', () => {
    test('s_tp_1(300.0, 3e6) should be approximately 0.392294792', () => {
      const result = s_tp_1(300.0, 3e6);
      expect(approxEqual(result, 0.392294792)).toBe(true);
    });

    test('s_tp_1(300.0, 80e6) should be approximately 0.368563852', () => {
      const result = s_tp_1(300.0, 80e6);
      expect(approxEqual(result, 0.368563852)).toBe(true);
    });

    test('s_tp_1(500.0, 3e6) should be approximately 2.58041912', () => {
      const result = s_tp_1(500.0, 3e6);
      expect(approxEqual(result, 2.58041912)).toBe(true);
    });
  });

  describe('cp', () => {
    test('cp_tp_1(300.0, 3e6) / 1e1 should be approximately 0.417301218', () => {
      const result = cp_tp_1(300.0, 3e6) / 1e1;
      expect(approxEqual(result, 0.417301218)).toBe(true);
    });

    test('cp_tp_1(300.0, 80e6) / 1e1 should be approximately 0.401008987', () => {
      const result = cp_tp_1(300.0, 80e6) / 1e1;
      expect(approxEqual(result, 0.401008987)).toBe(true);
    });

    test('cp_tp_1(500.0, 3e6) / 1e1 should be approximately 0.465580682', () => {
      const result = cp_tp_1(500.0, 3e6) / 1e1;
      expect(approxEqual(result, 0.465580682)).toBe(true);
    });
  });

  describe('sound_velocity', () => {
    test('w_tp_1(300.0, 3e6) / 1e4 should be approximately 0.150773921', () => {
      const result = w_tp_1(300.0, 3e6) / 1e4;
      expect(approxEqual(result, 0.150773921)).toBe(true);
    });

    test('w_tp_1(300.0, 80e6) / 1e4 should be approximately 0.163469054', () => {
      const result = w_tp_1(300.0, 80e6) / 1e4;
      expect(approxEqual(result, 0.163469054)).toBe(true);
    });

    test('w_tp_1(500.0, 3e6) / 1e4 should be approximately 0.124071337', () => {
      const result = w_tp_1(500.0, 3e6) / 1e4;
      expect(approxEqual(result, 0.124071337)).toBe(true);
    });
  });

  describe('cv', () => {
    test('cv_tp_1(300.0, 3e6) should be approximately 4.121201603', () => {
      const result = cv_tp_1(300.0, 3e6);
      expect(approxEqual(result, 4.121201603)).toBe(true);
    });

    test('cv_tp_1(300.0, 80e6) should be approximately 3.917366061', () => {
      const result = cv_tp_1(300.0, 80e6);
      expect(approxEqual(result, 3.917366061)).toBe(true);
    });

    test('cv_tp_1(500.0, 3e6) should be approximately 3.221392229', () => {
      const result = cv_tp_1(500.0, 3e6);
      expect(approxEqual(result, 3.221392229)).toBe(true);
    });
  });

  describe('backwards_t_ph', () => {
    test('t_ph_1(3e6, 500.0) / 1e3 should be approximately 0.391798509', () => {
      const result = t_ph_1(3e6, 500.0) / 1e3;
      expect(approxEqual(result, 0.391798509)).toBe(true);
    });

    test('t_ph_1(80e6, 500.0) / 1e3 should be approximately 0.378108626', () => {
      const result = t_ph_1(80e6, 500.0) / 1e3;
      expect(approxEqual(result, 0.378108626)).toBe(true);
    });

    test('t_ph_1(80e6, 1500.0) / 1e3 should be approximately 0.611041229', () => {
      const result = t_ph_1(80e6, 1500.0) / 1e3;
      expect(approxEqual(result, 0.611041229)).toBe(true);
    });
  });

  describe('backwards_t_ps', () => {
    test('t_ps_1(3e6, 0.5) / 1e3 should be approximately 0.307842258', () => {
      const result = t_ps_1(3e6, 0.5) / 1e3;
      expect(approxEqual(result, 0.307842258)).toBe(true);
    });

    test('t_ps_1(80e6, 0.5) / 1e3 should be approximately 0.309979785', () => {
      const result = t_ps_1(80e6, 0.5) / 1e3;
      expect(approxEqual(result, 0.309979785)).toBe(true);
    });

    test('t_ps_1(80e6, 3.0) / 1e3 should be approximately 0.565899909', () => {
      const result = t_ps_1(80e6, 3.0) / 1e3;
      expect(approxEqual(result, 0.565899909)).toBe(true);
    });
  });
});

import {
  v_tp_2,
  h_tp_2,
  u_tp_2,
  s_tp_2,
  cp_tp_2,
  cv_tp_2,
  w_tp_2,
  t_ph_2,
  t_ps_2
} from './region2';

describe('IAPWS97 Region 2', () => {
  // Helper function to compare floating point values with specified precision
  function approxEqual(a: number, b: number, precision: number = 9): boolean {
    const epsilon = Math.pow(10, -precision);
    return Math.abs(a - b) < epsilon;
  }

  describe('specific_volume', () => {
    test('v_tp_2(300.0, 0.0035e6) / 1e2 should be approximately 0.394913866', () => {
      const result = v_tp_2(300.0, 0.0035e6) / 1e2;
      expect(approxEqual(result, 0.394913866)).toBe(true);
    });

    test('v_tp_2(700.0, 0.0035e6) / 1e2 should be approximately 0.923015898', () => {
      const result = v_tp_2(700.0, 0.0035e6) / 1e2;
      expect(approxEqual(result, 0.923015898)).toBe(true);
    });

    test('v_tp_2(700.0, 30e6) / 1e-2 should be approximately 0.542946619', () => {
      const result = v_tp_2(700.0, 30e6) / 1e-2;
      expect(approxEqual(result, 0.542946619)).toBe(true);
    });
  });

  describe('enthalpy', () => {
    test('h_tp_2(300.0, 0.0035e6) / 1e4 should be approximately 0.254991145', () => {
      const result = h_tp_2(300.0, 0.0035e6) / 1e4;
      expect(approxEqual(result, 0.254991145)).toBe(true);
    });

    test('h_tp_2(700.0, 0.0035e6) / 1e4 should be approximately 0.333568375', () => {
      const result = h_tp_2(700.0, 0.0035e6) / 1e4;
      expect(approxEqual(result, 0.333568375)).toBe(true);
    });

    test('h_tp_2(700.0, 30e6) / 1e4 should be approximately 0.263149474', () => {
      const result = h_tp_2(700.0, 30e6) / 1e4;
      expect(approxEqual(result, 0.263149474)).toBe(true);
    });
  });

  describe('internal_energy', () => {
    test('u_tp_2(300.0, 0.0035e6) / 1e4 should be approximately 0.241169160', () => {
      const result = u_tp_2(300.0, 0.0035e6) / 1e4;
      expect(approxEqual(result, 0.241169160)).toBe(true);
    });

    test('u_tp_2(700.0, 0.0035e6) / 1e4 should be approximately 0.301262819', () => {
      const result = u_tp_2(700.0, 0.0035e6) / 1e4;
      expect(approxEqual(result, 0.301262819)).toBe(true);
    });

    test('u_tp_2(700.0, 30e6) / 1e4 should be approximately 0.246861076', () => {
      const result = u_tp_2(700.0, 30e6) / 1e4;
      expect(approxEqual(result, 0.246861076)).toBe(true);
    });
  });

  describe('entropy', () => {
    test('s_tp_2(300.0, 0.0035e6) / 1e1 should be approximately 0.852238967', () => {
      const result = s_tp_2(300.0, 0.0035e6) / 1e1;
      expect(approxEqual(result, 0.852238967)).toBe(true);
    });

    test('s_tp_2(700.0, 0.0035e6) / 1e2 should be approximately 0.101749996', () => {
      const result = s_tp_2(700.0, 0.0035e6) / 1e2;
      expect(approxEqual(result, 0.101749996)).toBe(true);
    });

    test('s_tp_2(700.0, 30e6) / 1e1 should be approximately 0.517540298', () => {
      const result = s_tp_2(700.0, 30e6) / 1e1;
      expect(approxEqual(result, 0.517540298)).toBe(true);
    });
  });

  describe('cp', () => {
    test('cp_tp_2(300.0, 0.0035e6) / 1e1 should be approximately 0.191300162', () => {
      const result = cp_tp_2(300.0, 0.0035e6) / 1e1;
      expect(approxEqual(result, 0.191300162)).toBe(true);
    });

    test('cp_tp_2(700.0, 0.0035e6) / 1e1 should be approximately 0.208141274', () => {
      const result = cp_tp_2(700.0, 0.0035e6) / 1e1;
      expect(approxEqual(result, 0.208141274)).toBe(true);
    });

    test('cp_tp_2(700.0, 30e6) / 1e2 should be approximately 0.103505092', () => {
      const result = cp_tp_2(700.0, 30e6) / 1e2;
      expect(approxEqual(result, 0.103505092)).toBe(true);
    });
  });

  describe('sound_velocity', () => {
    test('w_tp_2(300.0, 0.0035e6) / 1e3 should be approximately 0.427920172', () => {
      const result = w_tp_2(300.0, 0.0035e6) / 1e3;
      expect(approxEqual(result, 0.427920172)).toBe(true);
    });

    test('w_tp_2(700.0, 0.0035e6) / 1e3 should be approximately 0.644289068', () => {
      const result = w_tp_2(700.0, 0.0035e6) / 1e3;
      expect(approxEqual(result, 0.644289068)).toBe(true);
    });

    test('w_tp_2(700.0, 30e6) / 1e3 should be approximately 0.480386523', () => {
      const result = w_tp_2(700.0, 30e6) / 1e3;
      expect(approxEqual(result, 0.480386523)).toBe(true);
    });
  });

  describe('cv', () => {
    test('cv_tp_2(300.0, 0.0035e6) / 1e1 should be approximately 0.1441326618', () => {
      const result = cv_tp_2(300.0, 0.0035e6) / 1e1;
      expect(approxEqual(result, 0.1441326618)).toBe(true);
    });

    test('cv_tp_2(700.0, 0.0035e6) / 1e1 should be approximately 0.1619783325', () => {
      const result = cv_tp_2(700.0, 0.0035e6) / 1e1;
      expect(approxEqual(result, 0.1619783325)).toBe(true);
    });

    test('cv_tp_2(700.0, 30e6) / 1e2 should be approximately 0.0297553836', () => {
      const result = cv_tp_2(700.0, 30e6) / 1e2;
      expect(approxEqual(result, 0.0297553836)).toBe(true);
    });
  });

  describe('backwards_t_ph', () => {
    // Equation 22 tests
    test('t_ph_2(0.001e6, 3000.0) / 1e3 should be approximately 0.534433241', () => {
      const result = t_ph_2(0.001e6, 3000.0) / 1e3;
      expect(approxEqual(result, 0.534433241)).toBe(true);
    });

    test('t_ph_2(3e6, 3000.0) / 1e3 should be approximately 0.575373370', () => {
      const result = t_ph_2(3e6, 3000.0) / 1e3;
      expect(approxEqual(result, 0.575373370)).toBe(true);
    });

    test('t_ph_2(3e6, 4000.0) / 1e4 should be approximately 0.101077577', () => {
      const result = t_ph_2(3e6, 4000.0) / 1e4;
      expect(approxEqual(result, 0.101077577)).toBe(true);
    });

    // Equation 23 tests
    test('t_ph_2(5e6, 3500.0) / 1e3 should be approximately 0.801299102', () => {
      const result = t_ph_2(5e6, 3500.0) / 1e3;
      expect(approxEqual(result, 0.801299102)).toBe(true);
    });

    test('t_ph_2(5e6, 4000.0) / 1e4 should be approximately 0.101531583', () => {
      const result = t_ph_2(5e6, 4000.0) / 1e4;
      expect(approxEqual(result, 0.101531583)).toBe(true);
    });

    test('t_ph_2(25e6, 3500.0) / 1e3 should be approximately 0.875279054', () => {
      const result = t_ph_2(25e6, 3500.0) / 1e3;
      expect(approxEqual(result, 0.875279054)).toBe(true);
    });

    // Equation 24 tests
    test('t_ph_2(40e6, 2700.0) / 1e3 should be approximately 0.743056411', () => {
      const result = t_ph_2(40e6, 2700.0) / 1e3;
      expect(approxEqual(result, 0.743056411)).toBe(true);
    });

    test('t_ph_2(60e6, 2700.0) / 1e3 should be approximately 0.791137067', () => {
      const result = t_ph_2(60e6, 2700.0) / 1e3;
      expect(approxEqual(result, 0.791137067)).toBe(true);
    });

    test('t_ph_2(60e6, 3200.0) / 1e3 should be approximately 0.882756860', () => {
      const result = t_ph_2(60e6, 3200.0) / 1e3;
      expect(approxEqual(result, 0.882756860)).toBe(true);
    });
  });

  describe('backwards_t_ps', () => {
    // Equation 25 tests
    test('t_ps_2(0.1e6, 7.5) / 1e3 should be approximately 0.399517097', () => {
      const result = t_ps_2(0.1e6, 7.5) / 1e3;
      expect(approxEqual(result, 0.399517097)).toBe(true);
    });

    test('t_ps_2(0.1e6, 8.0) / 1e3 should be approximately 0.514127081', () => {
      const result = t_ps_2(0.1e6, 8.0) / 1e3;
      expect(approxEqual(result, 0.514127081)).toBe(true);
    });

    test('t_ps_2(2.5e6, 8.0) / 1e4 should be approximately 0.103984917', () => {
      const result = t_ps_2(2.5e6, 8.0) / 1e4;
      expect(approxEqual(result, 0.103984917)).toBe(true);
    });

    // Equation 26 tests
    test('t_ps_2(8e6, 6.0) / 1e3 should be approximately 0.600484040', () => {
      const result = t_ps_2(8e6, 6.0) / 1e3;
      expect(approxEqual(result, 0.600484040)).toBe(true);
    });

    test('t_ps_2(8e6, 7.5) / 1e4 should be approximately 0.106495556', () => {
      const result = t_ps_2(8e6, 7.5) / 1e4;
      expect(approxEqual(result, 0.106495556)).toBe(true);
    });

    test('t_ps_2(90e6, 6.0) / 1e4 should be approximately 0.103801126', () => {
      const result = t_ps_2(90e6, 6.0) / 1e4;
      expect(approxEqual(result, 0.103801126)).toBe(true);
    });

    // Equation 27 tests
    test('t_ps_2(20e6, 5.75) / 1e3 should be approximately 0.697992849', () => {
      const result = t_ps_2(20e6, 5.75) / 1e3;
      expect(approxEqual(result, 0.697992849)).toBe(true);
    });

    test('t_ps_2(80e6, 5.25) / 1e3 should be approximately 0.854011484', () => {
      const result = t_ps_2(80e6, 5.25) / 1e3;
      expect(approxEqual(result, 0.854011484)).toBe(true);
    });

    test('t_ps_2(80e6, 5.75) / 1e3 should be approximately 0.949017998', () => {
      const result = t_ps_2(80e6, 5.75) / 1e3;
      expect(approxEqual(result, 0.949017998)).toBe(true);
    });
  });
});
