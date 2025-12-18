import type { SanityClient } from "next-sanity";
import type { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters";

export function SanityAdapter(client: SanityClient): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const doc = {
        _type: "user",
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      };

      const newUser = await client.create(doc);
      return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        emailVerified: newUser.emailVerified,
      };
    },

    async getUser(id) {
      const user = await client.fetch(`*[_type == "user" && _id == $id][0]`, {
        id,
      });

      if (!user) return null;

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      };
    },

    async getUserByEmail(email) {
      const user = await client.fetch(
        `*[_type == "user" && email == $email][0]`,
        { email }
      );

      if (!user) return null;

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await client.fetch(
        `*[_type == "account" && providerAccountId == $providerAccountId && provider == $provider][0]{
          user->{_id, name, email, image, emailVerified}
        }`,
        { providerAccountId, provider }
      );

      if (!account?.user) return null;

      return {
        id: account.user._id,
        name: account.user.name,
        email: account.user.email,
        image: account.user.image,
        emailVerified: account.user.emailVerified,
      };
    },

    async updateUser(user) {
      const updatedUser = await client
        .patch(user.id!)
        .set({
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        })
        .commit();

      return {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        emailVerified: updatedUser.emailVerified,
      };
    },

    async deleteUser(userId) {
      // Delete user's accounts
      await client.delete({
        query: `*[_type == "account" && user._ref == $userId]`,
        params: { userId },
      });

      // Delete user's sessions
      await client.delete({
        query: `*[_type == "session" && user._ref == $userId]`,
        params: { userId },
      });

      // Delete user
      await client.delete(userId);
    },

    async linkAccount(account: AdapterAccount) {
      const doc = {
        _type: "account",
        user: {
          _type: "reference",
          _ref: account.userId,
        },
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      };

      await client.create(doc);
    },

    async unlinkAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }) {
      await client.delete({
        query: `*[_type == "account" && providerAccountId == $providerAccountId && provider == $provider]`,
        params: { providerAccountId, provider },
      });
    },

    async createSession({ sessionToken, userId, expires }) {
      const doc = {
        _type: "session",
        sessionToken,
        user: {
          _type: "reference",
          _ref: userId,
        },
        expires: expires.toISOString(),
      };

      const session = await client.create(doc);
      return {
        sessionToken: session.sessionToken,
        userId: session.user._ref,
        expires: new Date(session.expires),
      };
    },

    async getSessionAndUser(sessionToken) {
      const session = await client.fetch(
        `*[_type == "session" && sessionToken == $sessionToken][0]{
          ...,
          user->{_id, name, email, image, emailVerified}
        }`,
        { sessionToken }
      );

      if (!session?.user) return null;

      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.user._id,
          expires: new Date(session.expires),
        },
        user: {
          id: session.user._id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          emailVerified: session.user.emailVerified,
        },
      };
    },

    async updateSession({ sessionToken, expires, userId }) {
      const updatedSession = await client
        .patch(sessionToken)
        .set({
          expires: expires?.toISOString(),
          user: userId ? { _type: "reference", _ref: userId } : undefined,
        })
        .commit();

      return {
        sessionToken: updatedSession.sessionToken,
        userId: updatedSession.user._ref,
        expires: new Date(updatedSession.expires),
      };
    },

    async deleteSession(sessionToken) {
      await client.delete({
        query: `*[_type == "session" && sessionToken == $sessionToken]`,
        params: { sessionToken },
      });
    },

    async createVerificationToken({ identifier, expires, token }) {
      const doc = {
        _type: "verificationToken",
        identifier,
        token,
        expires: expires.toISOString(),
      };

      const verificationToken = await client.create(doc);
      return {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: new Date(verificationToken.expires),
      };
    },

    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }) {
      // For now, return null - verification tokens can be implemented later
      // when the exact Sanity client API is clarified
      console.log("Verification token not implemented:", { identifier, token });
      return null;
    },
  };
}
