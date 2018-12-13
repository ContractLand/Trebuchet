const sinon = require("sinon");
const VuPicker = require("./vuPicker");

describe.only("VuPicker", () => {
  let rand;

  beforeEach(() => {
    rand = sinon.stub(Math, "random");
  });

  afterEach(() => {
    rand.restore();
  });

  test("should throw if invalid parameter is provided", () => {
    expect(() => new VuPicker()).toThrow();
    expect(() => new VuPicker(null)).toThrow();
    expect(() => new VuPicker(123)).toThrow();
    expect(() => new VuPicker({})).toThrow();
  });

  test("should return the script if only a path is provided", () => {
    const picker = new VuPicker("path/script1.js");
    expect(picker.getVu().script).toBe("path/script1.js");
  });

  test("should return the script if an array of one path is provided", () => {
    const picker = new VuPicker(["path/script1.js"]);
    expect(picker.getVu().script).toBe("path/script1.js");
  });

  test("should return the script if an array of one path with weight is provided", () => {
    const picker = new VuPicker([
      {
        script: "path/script1.js",
        weight: 2
      }
    ]);
    expect(picker.getVu().script).toBe("path/script1.js");
  });

  test("should work for array of script", () => {
    const picker = new VuPicker(["path/script1.js", "path/script2.js"]);
    rand.returns(0);
    expect(picker.getVu().script).toBe("path/script1.js");

    rand.returns(0.5);
    expect(picker.getVu().script).toBe("path/script2.js");

    rand.returns(0.99999);
    expect(picker.getVu().script).toBe("path/script2.js");
  });

  test("should work for array of script with equal weight", () => {
    const picker = new VuPicker([
      {
        script: "path/script1.js",
        weight: 1337
      },
      {
        script: "path/script2.js",
        weight: 1337
      }
    ]);
    rand.returns(0);
    expect(picker.getVu().script).toBe("path/script1.js");

    rand.returns(0.5);
    expect(picker.getVu().script).toBe("path/script2.js");

    rand.returns(0.99999);
    expect(picker.getVu().script).toBe("path/script2.js");
  });

  test("should work for array of script with different weight", () => {
    const picker = new VuPicker([
      {
        name: "script1",
        script: "path/script1.js",
        weight: 90
      },
      {
        name: "script2",
        script: "path/script2.js",
        weight: 10
      },
      {
        name: "script3",
        script: "path/script3.js",
        weight: 1
      },
      {
        name: "script4",
        script: "path/script4.js",
        weight: 99
      }
    ]);

    rand.returns(0);
    expect(picker.getVu().script).toBe("path/script1.js");
    expect(picker.getVu().name).toBe("script1");

    rand.returns(0.45);
    expect(picker.getVu().script).toBe("path/script2.js");
    expect(picker.getVu().name).toBe("script2");

    rand.returns(0.5);
    expect(picker.getVu().script).toBe("path/script3.js");
    expect(picker.getVu().name).toBe("script3");

    rand.returns(0.505);
    expect(picker.getVu().script).toBe("path/script4.js");
    expect(picker.getVu().name).toBe("script4");

    rand.returns(0.99999);
    expect(picker.getVu().script).toBe("path/script4.js");
    expect(picker.getVu().name).toBe("script4");
  });
});
