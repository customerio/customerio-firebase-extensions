import { expect } from "chai";
import { RegionEU, RegionUS } from "customerio-node";
import { loadConfig } from "./config";

describe("Config Tests", () => {
    const original = process.env.REGION;

    afterEach(() => {
        if ( original === undefined ) {
            delete process.env.REGION;
        } else {
            process.env.REGION = original;
        }
    });

    it("should use the EU region when REGION is eu", () => {
        process.env.REGION = "eu";
        expect(loadConfig().region).to.equal(RegionEU);
    });

    it("should default to the US region", () => {
        process.env.REGION = "us";
        expect(loadConfig().region).to.equal(RegionUS);
    });
});
