import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import AppleStrategy from "passport-apple";
import { env } from "./env";
import { prisma } from "./prisma";

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${env.CLIENT_URL.replace(":5173", ":4000")}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("Google email unavailable"));

          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || "Google User",
                image: profile.photos?.[0]?.value,
                emailVerified: true,
                accounts: { create: { provider: "google", providerAccountId: profile.id } },
              },
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

if (env.APPLE_CLIENT_ID && env.APPLE_TEAM_ID && env.APPLE_KEY_ID && env.APPLE_PRIVATE_KEY) {
  passport.use(
    new AppleStrategy(
      {
        clientID: env.APPLE_CLIENT_ID,
        teamID: env.APPLE_TEAM_ID,
        keyID: env.APPLE_KEY_ID,
        privateKeyString: env.APPLE_PRIVATE_KEY,
        callbackURL: `${env.CLIENT_URL.replace(":5173", ":4000")}/api/auth/apple/callback`,
      },
      async (_accessToken: string, _refreshToken: string, idToken: any, profile: any, done: any) => {
        try {
          const email = profile?.email || idToken?.email;
          if (!email) return done(new Error("Apple email unavailable"));
          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: profile?.name?.firstName ?? "Apple User",
                emailVerified: true,
                accounts: { create: { provider: "apple", providerAccountId: idToken?.sub ?? email } },
              },
            });
          }
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user ?? null);
  } catch (error) {
    done(error);
  }
});

export default passport;
