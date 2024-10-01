const jwt = require('jsonwebtoken');
require('dotenv').config()
const sendtoken=async(user,statecode,res,message,id)=>{
   
    
    try {
    
        const secretKey ='defaultSecretKey';
        const token = await jwt.sign({ id: id }, secretKey, {
         expiresIn: '20d'
});
      
     const options = {
         expires: new Date(
                 Date.now() + 7 * 24 * 60 * 60 * 1000 
             ),
         httpOnly: true,
     }
 
     return res.status(statecode).cookie('token', token, options).json({
         sucess:true,
         message:message,
         data:user,
         token
         })
    } catch (error) {
        console.log(error);
        
     res.status(500).json({message:error})
    }

 
 }
 module.exports=sendtoken