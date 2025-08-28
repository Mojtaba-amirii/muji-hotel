import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

import type { SanityClient } from "@sanity/client";

export function SanityCredentialsProvider(client: SanityClient) {
  return CredentialsProvider({
    id: "sanity-login",
    name: "credentials",
    credentials: {
      email: {
        label: "Email",
        type: "email",
        placeholder: "your-email@example.com",
      },
      password: {
        label: "Password",
        type: "password",
      },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      try {
        // Fetch user from Sanity
        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: credentials.email }
        );

        if (!user || !user.password) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      } catch (error) {
        console.error("Error authenticating user:", error);
        return null;
      }
    },
  });
}
