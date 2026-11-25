import * as sinon from "sinon";
import { expect } from "chai";
import { Change } from "firebase-functions/v2/firestore";
import { Context } from "./context";
import { firestoreOnWrite } from "./firestore_handler";
import { fakeSnapshot } from "./testing";

function writeEvent(before?: Record<string, any>, after?: Record<string, any>) {
    return {
        params: { id: "doc1" },
        data: new Change(fakeSnapshot("doc1", before), fakeSnapshot("doc1", after)),
    } as any;
}

describe("Firestore Handler Tests", () => {
    let sandbox: sinon.SinonSandbox;
    let identifyStub: sinon.SinonStub;
    let destroyStub: sinon.SinonStub;
    const ctx = Context.get();

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        identifyStub = sandbox.stub(ctx.client, "identify").resolves();
        destroyStub = sandbox.stub(ctx.client, "destroy").resolves();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should trigger on documents in the USERS_COLLECTION param", () => {
        const pattern = (firestoreOnWrite as any).__endpoint.eventTrigger.eventFilterPathPatterns.document;

        expect(pattern.toCEL()).to.equal("{{ params.USERS_COLLECTION }}/{id}");
    });

    it("should identify on doc update and clear removed attributes", async () => {
        const identifiers = { email: "fake@customer.io" };

        await firestoreOnWrite.run(writeEvent(
            { identifiers, attributes: { "attr1": "value1", "attr2": "someValue" } },
            { identifiers, attributes: { "attr1": "value2" } },
        ));

        sinon.assert.calledWith(identifyStub, "fake@customer.io", {
            "attr1": "value2",
            "attr2": "",
            "id": "doc1",
        });
    });

    it("should identify by doc id and set created_at on doc create", async () => {
        await firestoreOnWrite.run(writeEvent(undefined, { attributes: { "plan": "basic" } }));

        sinon.assert.calledOnce(identifyStub);
        const [id, attrs] = identifyStub.firstCall.args;
        expect(id).to.equal("doc1");
        expect(attrs.plan).to.equal("basic");
        expect(attrs.created_at).to.be.a("number");
    });

    it("should destroy on doc delete", async () => {
        await firestoreOnWrite.run(writeEvent({ identifiers: { email: "fake@customer.io" } }, undefined));

        sinon.assert.calledWith(destroyStub, "fake@customer.io");
        sinon.assert.notCalled(identifyStub);
    });

    it("should skip documents with invalid identifiers", async () => {
        await firestoreOnWrite.run(writeEvent(undefined, { identifiers: { phone: "123" } }));

        sinon.assert.notCalled(identifyStub);
        sinon.assert.notCalled(destroyStub);
    });
});
