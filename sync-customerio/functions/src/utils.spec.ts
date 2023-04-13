import * as functions from "firebase-functions";
import { Context } from "./context";
import { buildUserRecord } from "./utils";
import * as sinon from "sinon";
import { expect } from "chai";

describe("Utils Tests", () => {
    let sandbox:sinon.SinonSandbox;
    let ctx:Context = Context.get();
    let doc:functions.firestore.DocumentSnapshot = {} as functions.firestore.DocumentSnapshot;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        doc.get = function() {
            return {}
        }
        doc.data = function() { return undefined; };
    })

    afterEach(() => {
        sandbox.restore();
    });

    it("should use id if given", () => {
        let id = "the-id";
        let attrs = {
            "one": "two",
            "three": "four"
        };
        sandbox.stub(doc, "get").callsFake((key) => {
            if(key === "identifiers") {
                return { id }
            } else if(key === "attributes") {
                return attrs;
            } else {
                expect.fail();
            }
        });

        let result = buildUserRecord(ctx, "fake", doc);

        expect(result.value?.identifier.type).to.equal("id");
        expect(result.value?.identifier.value).to.equal(id);
        expect(result.value?.attributes).to.equal(attrs);
    });

    it("should use email if given", () => {
        let email = "someone@customer.io";
        let attrs = {
            "one": "two",
            "three": "four"
        };
        sandbox.stub(doc, "get").callsFake((key) => {
            if(key === "identifiers") {
                return { email }
            } else if(key === "attributes") {
                return attrs;
            } else {
                expect.fail();
            }
        });

        let result = buildUserRecord(ctx, "fake", doc)

        expect(result.value?.identifier.type).to.equal("email");
        expect(result.value?.identifier.value).to.equal(email);
        expect(result.value?.attributes).to.equal(attrs);
    });
});