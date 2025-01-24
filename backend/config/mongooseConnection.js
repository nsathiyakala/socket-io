const mongoose = require("mongoose")

const  mongooseConnection = ()=>{
   
    try {
        mongoose.connect(process.env.DB_URL).then((connection) => {
            console.log("Connected to database "+ connection.connection.host)
        })
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = mongooseConnection