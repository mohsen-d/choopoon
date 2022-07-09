const choopoon = require("../../index");

describe("addTo", () => {
  it("should apply callback to the found module", () => {
    const math = {
      sub: function (a, b) {
        return a - b;
      },
    };

    choopoon.addTo("./files", (f) => {
      const methods = f();
      Object.keys(methods).forEach((m) => (math[m] = methods[m]));
    });

    expect(math.sum(2, 1)).toBe(3);
  });
});
