import * as functions from "firebase-functions";
import { Context } from "./context";
import * as sinon from "sinon";

import { authOnCreate, authOnDelete } from "./auth_handler";

process.env.GCLOUD_PROJECT = "fake";

describe("Utils Tests", () => {
    let sandbox:sinon.SinonSandbox;
    let ctx:Context = Context.get();
    let rec:functions.auth.UserRecord = {} as functions.auth.UserRecord;
    let identifyStub:sinon.SinonStub;
    let destroyStub:sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        identifyStub = sandbox.stub(ctx.client, "identify");
        destroyStub = sandbox.stub(ctx.client, "destroy");

        rec = {
            uid: "a-fake-uid",
            email: "fake@customer.io",
            phoneNumber: "+14252229999",
            emailVerified: true,
            displayName: "A User",
            photoURL: "http://example.com/example.png",
            disabled: false,
            metadata: {
                creationTime: "12 Mar 1988 00:00:00 GMT",
                lastSignInTime: "01 Jun 1988 00:00:00 GMT",
            }
        } as functions.auth.UserRecord;

    })

    afterEach(() => {
        sandbox.restore();
    });
    

    it("should identify with user record attributes", () => {
        identifyStub.resolves();
        authOnCreate(rec, { eventType: "" })
        sinon.assert.calledWith(identifyStub, rec.uid, {
            email: rec.email,
            phone: rec.phoneNumber,
            email_verified: rec.emailVerified,
            display_name: rec.displayName,
            photo_url: rec.photoURL,
            disabled: rec.disabled,
            created_at: 574128000,
            last_sign_in: 581126400,
        });
    });

    it("should destroy user", () => {
        destroyStub.resolves();
        authOnDelete(rec, { eventType: "" })
        sinon.assert.calledWith(destroyStub, rec.uid);
    });
});