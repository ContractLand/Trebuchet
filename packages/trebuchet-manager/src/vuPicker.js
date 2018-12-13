const { find, sumBy } = require("lodash");

const normaliseArray = arr =>
  arr.map(a =>
    typeof a === "string"
      ? {
          script: a,
          weight: 1,
          name: "DEFAULT_VU"
        }
      : a
  );

const weightedChart = weighted => {
  let curr = 0;
  return weighted.map(i => {
    curr += i.weight || 1;
    return { script: i.script, weightLimit: curr, name: i.name };
  });
};

class VuPicker {
  constructor(opts) {
    if (!(opts instanceof Array || typeof opts === "string")) throw new Error();
    this.opts = opts instanceof Array ? normaliseArray(opts) : opts;
    if (typeof this.opts === "string" || this.opts.length === 1) {
      this.multiple = false;
      this.script = this.opts instanceof Array ? this.opts[0].script : opts;
    } else {
      this.multiple = true;
      this.chart = weightedChart(this.opts);
      this.maxWeight = sumBy(this.opts, "weight");
    }
  }

  getRandomVu() {
    // Range(rand) = [0, maxWeight)
    const rand = Math.random() * this.maxWeight;
    return find(this.chart, s => s.weightLimit > rand);
  }

  getVu() {
    return this.multiple
      ? this.getRandomVu()
      : {
          script: this.script,
          weight: 1,
          name: "DEFAULT_VU"
        };
  }
}

module.exports = VuPicker;
