const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const customerSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    accountNumber:{
        type:String,
        required:true
    },
    currentBalance:{
        type:Number,
        required:true
    }
},{timestamps:true});

const customer=mongoose.model('customerDetails',customerSchema);
module.exports=customer;