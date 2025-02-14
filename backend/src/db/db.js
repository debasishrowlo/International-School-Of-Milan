import mongoose from "mongoose";

const dbConnect = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }
  try {
    const isConnected = await mongoose.connect(process.env.MONGODB_URL)
    console.log(`Database connected to : ${isConnected.connection.name}`)

  } catch (error) {

    console.log("Failed to connect to the db", error)
    process.exit(1);

  }

}
export default dbConnect



