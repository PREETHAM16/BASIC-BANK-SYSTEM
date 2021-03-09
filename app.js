const express=require('express');
const bp=require('body-parser');
const mongoose=require('mongoose');
const customer=require('./models/customerDetails.js');
const transhist=require('./models/transactionHistory.js');
const port=process.env.PORT || 1234;
const app=express();
app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(bp.urlencoded({extended:false}));
//connect to mangodb
const dburl='mongodb+srv://preetham:preetham@12@cluster0.1zuno.mongodb.net/bank?retryWrites=true&w=majority';
mongoose.connect(dburl,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>app.listen(port,()=>{console.log('Running at port number 1234')}))
.catch((err)=>console.log(err));

app.use("/favicon.ico", express.static('public/favicon.ico'));

app.get('/PRbank/home',(req,res)=>{
    res.render('home.ejs');
});
app.get('/',(req,res)=>{
    res.redirect('/PRbank/home');
});



function customerDet(res,i){
    customer.find().
    then((result)=>{
        if(i==-1)
        res.render('customerDetails',{cusdet:result})
        else if(i>=0)
        res.render('transaction',{cusdet:result,index:i});
    })
    .catch((err)=>console.log(err));    
}
app.get('/PRbank/customerDetails',(req,res)=>{
    customerDet(res,-1);
});

app.post('/PRbank/transaction/:index',(req,res)=>{
    customerDet(res,req.params.index);
});

app.post('/PRbank/transtable',(req,res)=>{
    console.log(req.body);
    if(req.body.receiversAccNo===req.body.sendersAccNo)return res.redirect('/PRbank/customerDetails');
    else{
        customer.findOne({accountNumber:req.body.receiversAccNo})
        .then((result)=>{
            console.log(result);
            let val=parseInt(req.body.amount);
            customer.findOneAndUpdate({accountNumber:result.accountNumber},{currentBalance:result.currentBalance+val})
            .then((result1)=>{
                console.log('updated receivers balance',result1);
                customer.findOneAndUpdate({accountNumber:req.body.sendersAccNo},{currentBalance:req.body.sendersBalance-val})
                .then((result2)=>{
                    console.log('updated senders balance',result2);
                    // let Time = new Date().toLocaleString("en-US",{timeZone:'Asia/Kolkata',timeStyle:'medium',hourCycle:'h24'});
                    let date=new Date().toLocaleString("en-US",{timeZone:'Asia/Kolkata'});
                    console.log(date);
                    transhist.create(
                        {
                            from:result2.name,
                            accNoF:result2.accountNumber,
                            to:result1.name,
                            accNoT:result1.accountNumber,
                            amount:req.body.amount,
                            time:date
                        }).then((result3)=>{
                        console.log('Transaction history table Created');
                        res.redirect('/PRbank/customerDetails');
                    })
                    .catch((err3)=>console.log(err3));
                }).catch((err2)=>console.log(err2));
            }).catch((err1)=>console.log(err1));
        })
        .catch((err)=>console.log(err));
    }
});

app.get('/PRbank/customerTransactions',(req,res)=>{
    transhist.find()
    .then((result)=>{console.log('Transaction history',result);
        res.render('transactionTable',{transaction:result});
        
    })
    .catch((err)=>console.log(err));
});
//dataBase Insertion
/*customer.create(
    {
        name:'Preetham',
        email:'pr12@gmail.com',
        accountNumber:'PR123',
        currentBalance:100000
    },
    {
        name:'Pavan',
        email:'pa21@gmail.com',
        accountNumber:'PR321',
        currentBalance:90000
    },
    {
        name:'Allu',
        email:'al12@gmail.com',
        accountNumber:'PR132',
        currentBalance:80000
    },
    {
        name:'Arjun',
        email:'ar12@gmail.com',
        accountNumber:'PR213',
        currentBalance:95000
    },
    {
        name:'Kalyan',
        email:'ka12@gmail.com',
        accountNumber:'PR312',
        currentBalance:85000
    },
    {
        name:'Prabhas',
        email:'pr11@gmail.com',
        accountNumber:'PR321',
        currentBalance:50000
    },
    {
        name:'Nani',
        email:'na12@gmail.com',
        accountNumber:'PR234',
        currentBalance:75000
    },
    {
        name:'Mahesh',
        email:'ma12@gmail.com',
        accountNumber:'PR243',
        currentBalance:30000
    },
    {
        name:'Ram',
        email:'ra12@gmail.com',
        accountNumber:'PR432',
        currentBalance:10000
    },
    {
        name:'Charan',
        email:'ch12@gmail.com',
        accountNumber:'PR324',
        currentBalance:65000
    },
).then((result)=>console.log('Successfully Inserted'))
.catch((err)=>console.log(err));*/
