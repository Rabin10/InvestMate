import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { query } from "./db.js";

export function setupPassport() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await query("SELECT * FROM users WHERE id = $1", [id]);
      done(null, result.rows[0]);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const displayName = profile.displayName;
          const email = profile.emails?.[0]?.value || null;

          let result = await query(
            "SELECT * FROM users WHERE google_id = $1",
            [googleId]
          );

          if (result.rows.length === 0) {
            result = await query(
              `INSERT INTO users (google_id, display_name, email)
               VALUES ($1, $2, $3) RETURNING *`,
              [googleId, displayName, email]
            );
          }

          return done(null, result.rows[0]);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}
