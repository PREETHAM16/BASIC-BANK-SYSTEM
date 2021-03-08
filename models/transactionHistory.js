const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const transSchema=new Schema({
    from:{
        type:String,
        required:true
    },
    accNoF:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    accNoT:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    time:{
        type:String,
        required:true
    }
},{timestamps:true});

const transhistory=mongoose.model('transactionHistory',transSchema);
module.exports=transhistory;