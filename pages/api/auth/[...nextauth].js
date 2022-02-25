import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { EncryptJWT, jwtDecrypt, importJWK } from "jose"
import uuid from "uuid"
import { Buffer } from 'buffer';
import { now } from "next-auth/client/_utils";
import crypto from "crypto"

const JWK = importJWK(JSON.parse(process.env.NEXTAUTH_ENCRYPT))

async function getJWK() {
  return await JWK;
}

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    encrypt: false,
    async encode({token,  secret,  maxAge}) {
      const encryptionSecret = await getJWK()
      return await new EncryptJWT(token)
          .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
          .setIssuedAt()
          .setExpirationTime(now() + maxAge)
          .setJti(crypto.randomUUID ? crypto.randomUUID() : uuid())
          .encrypt(encryptionSecret)
    },
    async decode({token,  secret}) {
      if (!token) return null
      const encryptionSecret = await getJWK()
      const { payload } = await jwtDecrypt(token, encryptionSecret, {
        clockTolerance: 15,
      })
      return payload
    },
  }
})