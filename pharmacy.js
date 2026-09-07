export const MIN_BENEFIT_VALUE = 0;
export const MAX_BENEFIT_VALUE = 50;

const ETERNAL_DRUGS = ["Magic Pill"];
const WILL_MATURE_DRUGS_BEFORE_EXP = ["Herbal Tea", "Fervex"];
const WILL_MATURE_DRUGS_AFTER_EXP = ["Herbal Tea"];

export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }

  applyBenefits(factor = 1) {
    const newBenefit = factor > 1 ? this.benefit * factor : this.benefit + 1;

    if (newBenefit > MAX_BENEFIT_VALUE) this.benefit = MAX_BENEFIT_VALUE;
    else this.benefit = newBenefit;
  }

  applyDegradation(factor = 1) {
    if (factor === 0) {
      this.benefit = 0;
      return;
    }

    const newBenefit =
      factor > 1 ? Math.floor(this.benefit / factor) : this.benefit - 1;

    if (newBenefit < MIN_BENEFIT_VALUE) this.benefit = MIN_BENEFIT_VALUE;
    else this.benefit = newBenefit;
  }

  lowerExpiresIn() {
    this.expiresIn -= 1;
  }
}

function getFactorBeforeExpiration(drugName, expiresIn) {
  if (drugName === "Dafalgan") return 2;

  if (drugName === "Fervex") {
    if (expiresIn <= 5) return 3;
    if (expiresIn <= 10) return 2;
  }

  return 1;
}

function getFactorAfterExpiration(drugName) {
  if (drugName === "Fervex") return 0;

  return 2;
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  updateBenefitValue() {
    this.drugs.forEach((drug) => {
      if (ETERNAL_DRUGS.includes(drug.name)) return;

      if (drug.expiresIn < 0) {
        const factor = getFactorAfterExpiration(drug.name);

        if (WILL_MATURE_DRUGS_AFTER_EXP.includes(drug.name)) {
          drug.applyBenefits(factor);
        } else {
          drug.applyDegradation(factor);
        }
      } else {
        const factor = getFactorBeforeExpiration(drug.name, drug.expiresIn);

        if (WILL_MATURE_DRUGS_BEFORE_EXP.includes(drug.name)) {
          drug.applyBenefits(factor);
        } else {
          drug.applyDegradation(factor);
        }
      }

      drug.lowerExpiresIn();
    });

    return this.drugs;
  }
}
