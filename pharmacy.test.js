import {
  Drug,
  MAX_BENEFIT_VALUE,
  MIN_BENEFIT_VALUE,
  Pharmacy,
} from "./pharmacy";

function createTestDrug(name, expiresIn, benefit) {
  return new Drug(name ?? "test", expiresIn ?? 2, benefit ?? 3);
}

function createTestPharmacy(drug) {
  return new Pharmacy([drug]);
}

describe("Pharmacy", () => {
  it.each([
    ["lowest", new Drug("Herbal Tea", 0, MAX_BENEFIT_VALUE)],
    ["upper", new Drug("Doliprane", 0, MIN_BENEFIT_VALUE)],
  ])("should have %s authorized benefit value", (str, drug) => {
    const pharmacy = createTestPharmacy(drug);
    const expectedDrug = createTestDrug(drug.name, -1, drug.benefit);

    expect(pharmacy.updateBenefitValue()).toEqual([expectedDrug]);
  });

  it("should decrease the benefit and expiresIn", () => {
    const drug = createTestDrug();
    const pharmacy = createTestPharmacy(drug);
    const expectedDrug = createTestDrug("test", 1, 2);

    expect(pharmacy.updateBenefitValue()).toEqual([expectedDrug]);
  });

  it("should increase benefit as expiration decrease for Herbal Tea", () => {
    const drug = createTestDrug("Herbal Tea");
    const pharmacy = createTestPharmacy(drug);
    const expectedDrug = new Drug(
      drug.name,
      drug.expiresIn - 1,
      drug.benefit + 1,
    );

    expect(pharmacy.updateBenefitValue()).toEqual([expectedDrug]);
  });

  it.each([
    [2, 1],
    [4, 2],
    [8, 4],
    [20, 10],
  ])(
    "should degrade twice as fast as normal for Dafalgan",
    (benefit, expectedBenefit) => {
      const drug = createTestDrug("Dafalgan", 1, benefit);
      const pharmacy = createTestPharmacy(drug);
      const expectedDrug = createTestDrug(drug.name, 0, expectedBenefit);

      expect(pharmacy.updateBenefitValue()).toEqual([expectedDrug]);
    },
  );

  it.each([
    [1, 2, 11],
    [3, 6, 10],
    [4, 8, 9],
    [3, 9, 5],
    [2, 6, 4],
  ])(
    "should increase benefit from %d to %d when expiresIn is %d (%s)",
    (benefit, expectedBenefit, expiresIn) => {
      const drug = createTestDrug("Fervex", expiresIn, benefit);
      const pharmacy = createTestPharmacy(drug);
      const [result] = pharmacy.updateBenefitValue();

      expect(result.benefit).toEqual(expectedBenefit);
    },
  );

  it("should set the benefit to 0 for Fervex after expiration", () => {
    const drug = createTestDrug("Fervex", -2, 45);
    const pharmacy = createTestPharmacy(drug);
    const [result] = pharmacy.updateBenefitValue();

    expect(result.benefit).toEqual(0);
  });
});
