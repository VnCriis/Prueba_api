import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const connection = async ()=>{
    try{
        const {connection} = await mongoose.connect(process.env.MONGO_URI_LOCAL)
        console.log(`database is conected on ${connection.host}-${connection.port}`)
    }catch(error){
        console.log(error);

    }
}

export default connection