export const DATABASE_URI = process.env.DATABASE_URI!;
export const PORT = process.env.PORT!;
export const UNIQUE_HASH_SECRET = process.env.UNIQUE_HASH_SECRET!;


export enum Helpers {
    TEN_MINUTES_IN_MS = 10 * 60 * 1000,
    ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000,
    ONE_DAY_IN_MS = 24 * 60 * 60 * 1000,
    TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000,
  }