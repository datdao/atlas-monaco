import { Dialect } from "../../atlashcl/dialect";

describe("dialect", () => {
  test("enums", () => {
    expect(Dialect.sqlite).toEqual("sqlite");
    expect(Dialect.mysql).toEqual("mysql");
    expect(Dialect.postgresql).toEqual("postgresql");
  });
});
