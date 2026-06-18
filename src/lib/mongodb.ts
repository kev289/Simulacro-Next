import mongoose from 'mongoose';
import { startEmailAutomation } from '../services/mail.service';

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Error');
  }
  return uri;
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  interface CustomGlobal {
    mongooseCache: MongooseCache | undefined;
    cronInitialized: boolean | undefined;
  }
}

const globalContext = globalThis as unknown as CustomGlobal;

const cached: MongooseCache = globalContext.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalContext.mongooseCache = cached;

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(getMongoUri(), opts).then((m) => {
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    
    if (!globalContext.cronInitialized) {
      startEmailAutomation();
      globalContext.cronInitialized = true;
      console.log("Automatización de correos");
    }

  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;