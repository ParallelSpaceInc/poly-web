import mongoose from 'mongoose'

const connectMongo = async () => {
    await mongoose.connect(String(process.env.MONGO_URL))
}

export default connectMongo;