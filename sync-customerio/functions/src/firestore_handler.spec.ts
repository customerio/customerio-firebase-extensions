import { Context } from "./context";
import * as sinon from "sinon";
import { firestoreOnWrite } from "./firestore_handler";
import * as firebaseFunctionsTest from "firebase-functions-test";

const {wrap, makeChange, firestore} = firebaseFunctionsTest();

process.env.GCLOUD_PROJECT = "fake";

describe("Utils Tests", () => {
    let sandbox:sinon.SinonSandbox;
    let ctx:Context = Context.get();
    let identifyStub:sinon.SinonStub;
    let destroyStub:sinon.SinonStub;
    
    before(() => {
    });


    beforeEach(() => {
        sandbox = sinon.createSandbox();

        identifyStub = sandbox.stub(ctx.client, "identify");
        destroyStub = sandbox.stub(ctx.client, "destroy");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should identify on doc update", () => {
        identifyStub.resolves();
        const wrapped = wrap(firestoreOnWrite);
        let identifiers = {
            email: "fake@customer.io"
        };
        let attributes1 = {
            "attr1": "value1"
        };
        let attributes2 = {
            "attr1": "value2"
        };
        const beforeSnap = firestore.makeDocumentSnapshot({ identifiers: { ...identifiers }, attributes: { ...attributes1 } }, 'users/doc1');
        const afterSnap = firestore.makeDocumentSnapshot({ identifiers: { ...identifiers }, attributes: { ...attributes2 } }, 'users/doc1');
        const change = makeChange(beforeSnap, afterSnap);

        wrapped(change);

        const expected = {
            "attr1": "value2",
            "id": "doc1",
        }
        sinon.assert.calledWith(identifyStub, "fake@customer.io", expected);
    });

    it("should destroy on doc delete", () => {
        destroyStub.resolves();
        const wrapped = wrap(firestoreOnWrite);
        let identifiers = {
            email: "fake@customer.io"
        };
        const beforeSnap = firestore.makeDocumentSnapshot({ identifiers: { ...identifiers } }, 'users/doc1');
        const afterSnap = firestore.makeDocumentSnapshot({} /* doc doesn't exist */ , 'users/doc1');
        const change = makeChange(beforeSnap, afterSnap);
        
        wrapped(change);

        sinon.assert.calledWith(destroyStub, "fake@customer.io");
    });
});