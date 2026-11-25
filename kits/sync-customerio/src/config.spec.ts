import { expect } from "chai";
import { RegionEU, RegionUS } from "customerio-node";
import { loadConfig } from "./config";

describe("Config Tests", () => {
    const original = { ...process.env };

    beforeEach(() => {
        process.env.SITE_ID = "site";
        process.env.API_KEY = "key";
        process.env.USERS_COLLECTION = "users";
    });

    afterEach(() => {
        process.env = { ...original };
    });

    it("should read params from the environment", () => {
        process.env.REGION = "us";
        const config = loadConfig();
        expect(config.site_id).to.equal("site");
        expect(config.api_key).to.equal("key");
        expect(config.collection).to.equal("users");
        expect(config.region).to.equal(RegionUS);
    });

    it("should use the EU region when REGION is eu", () => {
        process.env.REGION = "eu";
        expect(loadConfig().region).to.equal(RegionEU);
    });
});
