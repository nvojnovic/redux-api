"use strict";
/* global describe, it */

import { expect } from "chai";
import urlTransform from "../src/urlTransform";

describe("urlTransform", function() {
  it("check null params", function() {
    expect(urlTransform()).to.eql("");
    expect(urlTransform(null)).to.eql("");
    expect(urlTransform("")).to.eql("");
    expect(urlTransform("/test")).to.eql("/test");
  });

  it("check replace path", function() {
    expect(urlTransform("/test/:id", { id: 1 })).to.eql("/test/1");
    expect(urlTransform("/test/:id/hey/:id", { id: 1 })).to.eql("/test/1/hey/1");
  });

  it("check replace path with hostname", function() {
    expect(urlTransform("http://localhost:1234/test/:id", { id: 1 })).to.eql("http://localhost:1234/test/1");
    expect(urlTransform("http://localhost:1234/test/:id/hey/:id", { id: 1 })).to.eql("http://localhost:1234/test/1/hey/1");
    expect(urlTransform("http://localhost:1234/test/:id/hey/:id?hello=1", { id: 1 })).to.eql("http://localhost:1234/test/1/hey/1?hello=1");
    expect(urlTransform("http://localhost:1234/test/:id/hey/:id?hello=1&world=2", { id: 1 })).to.eql("http://localhost:1234/test/1/hey/1?hello=1&world=2");
  });

  it("check optional params path", function() {
    expect(urlTransform("/test/:id", { id: 1 })).to.eql("/test/1");
    expect(urlTransform("/test/(:id)", { id: 1 })).to.eql("/test/1");
    expect(urlTransform("/test/(:id)")).to.eql("/test/");
  });

  it("check non-pretty params in path", function() {
    expect(urlTransform("/test/(:id)", { id1: 1 })).to.eql("/test/?id1=1");
    expect(urlTransform("/test/?hello=1&(:id)", { id1: 1 })).to.eql("/test/?hello=1&id1=1");
    expect(urlTransform("/test/?hello=2(:id)", { id1: 1 })).to.eql("/test/?hello=2&id1=1");
  });

  it("check clean params", function() {
    expect(urlTransform("/test/:id")).to.eql("/test/");
    expect(urlTransform("/test/:id/")).to.eql("/test//");
    expect(urlTransform("/test/(:id)")).to.eql("/test/");
  });

  it("accepts url transform options", function() {
    expect(urlTransform("/test", { id: [1, 2] }, { arrayFormat: "repeat", delimiter: ";" })).to.eql("/test?id=1;id=2");
    expect(urlTransform("/test?id=1;id=2", null, { arrayFormat: "repeat", delimiter: ";" })).to.eql("/test?id=1;id=2");
  });

  it("accepts qsParseOptions", function() {
    expect(urlTransform("/test?id=1&id=2", { id: [1, 2] }, { arrayFormat: "indices", qsParseOptions: { arrayFormat: "repeat" } })).to.eql("/test?id%5B0%5D=1&id%5B1%5D=2");
  });

  it("accepts qsStringifyOptions", function() {
    expect(urlTransform("/test", { id: [1, 2] })).to.eql("/test?id%5B0%5D=1&id%5B1%5D=2");
    expect(urlTransform("/test", { id: [1, 2] }, { arrayFormat: "brackets", qsStringifyOptions: { arrayFormat: "repeat" } })).to.eql("/test?id=1&id=2");
  });
});
