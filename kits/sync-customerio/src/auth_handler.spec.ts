import * as sinon from "sinon";
import type { AuthEvent, User } from "firebase-functions/v2/identity";
import { Context } from "./context";
import { authOnCreate, authOnDelete } from "./auth_handler";

describe("Auth Handler Tests", () => {
    let sandbox: sinon.SinonSandbox;
    let identifyStub: sinon.SinonStub;
    let destroyStub: sinon.SinonStub;
    const ctx = Context.get();

    const user = {
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
        },
    } as unknown as User;
    const event = { data: user } as AuthEvent<User>;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        identifyStub = sandbox.stub(ctx.client, "identify").resolves();
        destroyStub = sandbox.stub(ctx.client, "destroy").resolves();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should identify with user record attributes", async () => {
        await authOnCreate.run(event);

        sinon.assert.calledWith(identifyStub, user.uid, {
            email: user.email,
            phone: user.phoneNumber,
            email_verified: user.emailVerified,
            display_name: user.displayName,
            photo_url: user.photoURL,
            disabled: user.disabled,
            created_at: 574128000,
            last_sign_in: 581126400,
        });
    });

    it("should destroy user", async () => {
        await authOnDelete.run(event);

        sinon.assert.calledWith(destroyStub, user.uid);
    });

    it("should not throw when Customer.io rejects the request", async () => {
        identifyStub.rejects(new Error("unauthorized"));

        await authOnCreate.run(event);
    });
});
