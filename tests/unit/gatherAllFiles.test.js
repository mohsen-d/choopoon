const fs = require("fs");
const path = require("path");
const ajab = require("ajab");
const choopoon = ajab("../../index");

jest.mock("fs");
jest.mock("path");

describe("gatherAllFiles()", () => {
  beforeEach(() => {
    const isFile = {
      f: "",
      isFile: function () {
        return this.f.includes(".") ? true : false;
      },
    };

    path.resolve.mockReturnValue("\\");
    fs.readdirSync.mockReturnValue(["home.js", "admin.js"]);
    fs.lstatSync.mockImplementation((f) => {
      isFile.f = f;
      return isFile;
    });
  });

  it("should gather all files in the given folder", () => {
    const result = choopoon.gatherAllFiles("./routes");

    expect(result).toEqual(expect.arrayContaining(["./routes/home.js"]));
    expect(result).toEqual(expect.arrayContaining(["./routes/admin.js"]));
  });

  it("should filter files if a filter is given", () => {
    fs.readdirSync.mockReturnValue(["home.js", "admin.js", "help.txt"]);

    const result = choopoon.gatherAllFiles("./routes", (f) =>
      f.endsWith(".txt")
    );

    expect(result).not.toEqual(expect.arrayContaining(["./routes/home.js"]));
    expect(result).not.toEqual(expect.arrayContaining(["./routes/admin.js"]));
    expect(result).toEqual(expect.arrayContaining(["./routes/help.txt"]));
  });

  it("should look in subfolders as well", () => {
    fs.readdirSync
      .mockReturnValueOnce(["home.js", "admin.js", "auth"])
      .mockReturnValueOnce(["login.js"]);

    const result = choopoon.gatherAllFiles("./routes");

    expect(result).toEqual(expect.arrayContaining(["./routes/auth/login.js"]));
  });
});
