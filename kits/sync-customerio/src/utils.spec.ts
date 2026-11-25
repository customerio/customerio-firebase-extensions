import { expect } from "chai";
import { Context } from "./context";
import { buildUserRecord } from "./utils";
import { fakeSnapshot } from "./testing";

describe("Utils Tests", () => {
    const ctx = Context.get();

    it("should default to doc id as identifier", () => {
        const attrs = { "one": "two", "three": "four" };
        const result = buildUserRecord(ctx, "fake", fakeSnapshot("fake", { attributes: attrs }));

        expect(result.value?.identifier).to.deep.equal({ type: "id", value: "fake" });
        expect(result.value?.attributes).to.deep.equal(attrs);
    });

    it("should use id if given", () => {
        const attrs = { "one": "two", "three": "four" };
        const result = buildUserRecord(ctx, "fake", fakeSnapshot("fake", { identifiers: { id: "the-id" }, attributes: { ...attrs } }));

        expect(result.value?.identifier).to.deep.equal({ type: "id", value: "the-id" });
        expect(result.value?.attributes).to.deep.equal(attrs);
    });

    it("should use email if given and default attribute id to the doc id", () => {
        const email = "someone@customer.io";
        const result = buildUserRecord(ctx, "fake", fakeSnapshot("fake", { identifiers: { email }, attributes: { "one": "two" } }));

        expect(result.value?.identifier).to.deep.equal({ type: "email", value: email });
        expect(result.value?.attributes).to.deep.equal({ "one": "two", "id": "fake" });
    });

    it("should preserve attrs id if present", () => {
        const attrs = { "one": "two", "three": 4, "id": "an-attr-id" };
        const result = buildUserRecord(ctx, "fake", fakeSnapshot("fake", { identifiers: { email: "someone@customer.io" }, attributes: { ...attrs } }));

        expect(result.value?.attributes).to.deep.equal(attrs);
    });

    it("should reject more than one identifier", () => {
        const result = buildUserRecord(ctx, "fake", fakeSnapshot("fake", { identifiers: { id: "a", email: "b@customer.io" } }));

        expect(result.error?.field).to.equal("identifiers");
    });

    it("should reject an unknown identifier", () => {
        const result = buildUserRecord(ctx, "fake", fakeSnapshot("fake", { identifiers: { phone: "123" } }));

        expect(result.error?.field).to.equal("identifiers");
    });
});
