const { connectToCosmos } = require("../Database/cosmosDBusers");
const  bcrypt=require("bcrypt")
const sendtoken=require("../util/jwt");
let cosmosContainer;
connectToCosmos().then(({ container }) => {
  cosmosContainer = container;
  console.log('databaseconnection:'+"successfully");
}).catch((err)=>{console.log(err.message);
});



exports.userregister= async (req, res) => {
 console.log(req.body);
 
try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password" });
    }
      
    const querySpec = {
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [
          { name: "@email", value:email}
        ]
      };
    
      const { resources:userdata} = await cosmosContainer.items
        .query(querySpec)
        .fetchAll();
        console.log(userdata);
        
         if (!userdata.length==0) {
           
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
                 });
                       

         } else {

            const hashedPassword = await bcrypt.hash(password, 10);
            
             let newUser = { name: req.body.name, email: req.body.email,password:hashedPassword }
             const { resource: createdItem } = await cosmosContainer.items.create(newUser);


                return res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                   createdItem
                });
           
         }
  
} catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    });
}
    
  }

  


  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
     if(!req.body.email){
         return res.status(400).json({message:"please enter your mail id"})
     }
     if(!req.body.password){
         return  res.status(400).json({message:"please enter your password"})
 }
    
 const querySpec = {
    query: "SELECT * FROM c WHERE c.email = @email",
    parameters: [
      { name: "@email", value:email}
    ]
  };

  const { resources:userdata} = await cosmosContainer.items
    .query(querySpec)
    .fetchAll();
         if (!userdata.length==0) {
             
        
             
             const match = await bcrypt.compare(req.body.password,userdata[0].password);
 
             if (match) {
                
              let message="login successfully"
              sendtoken(userdata,201,res,message,userdata[0].id)
                
            
             } else {
                 return res.status(400).json({
                     success: false,
                     message: 'Incorrect password'
                 });
             }
         } else {
             return res.status(404).json({
                 success: false,
                 message: 'No user found with this email'
             });
         }
     
    } catch (error) {
     return  res.status(500).json({
         success: false,
         message: error.message || 'Internal Server Error',
     })
 
    }   
 };
 





 exports.getUserById =async (req, res) => {
  const id=req.user.id
  
  if(!id){
    return res.status(401).json({
        success: false,
        message: "Unauthorized or userid Required"
    });
 }
  try {

        
    const { resource: user } = await cosmosContainer.item(id,id).read();

       if (user) {
        return res.status(201).json({
          success:true,
          data:user,  
          message:'Userdata successfully...'});
       } else {
           return res.status(404).json({
               success: false,
               message: 'No user found'
           });
       }

  } catch (error) {
    return  res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
  }
};


















  
exports.singplayers= async (req, res) => {
    const playerId = req.params.id;
    
    if (!playerId) {
      return res.status(404).json({ error: "PlayerId required" });
    }
    
    try {
      const querySpec = {
          query: "SELECT * FROM c WHERE c.playerId = @playerId",
          parameters: [
            { name: "@playerId", value: playerId }
          ]
        };
    
        const { resources: players } = await cosmosContainer.items
          .query(querySpec)
          .fetchAll();
    
        if (players.length === 0) {
          return res.status(404).json({ error: "Player not found" });
        }
    
  
        res.status(200).json(players);
    } catch (err) {
      res.status(404).json({ error: "Item not found" });
    }
  };
  
  
  
   exports.singplayerssecond= async (req, res) => {
     const playerId = req.params.playerId;
     const partitionKey = req.params.id;
   console.log(playerId,partitionKey);
  
     if (!playerId || !partitionKey) {
       return res.status(404).json({ error: "PlayerId,partitionKey required" });
     }
    
     try {
    
      const { resource: player } = await cosmosContainer.item(partitionKey).read();
        
    
     
        
  
         res.status(200).json(player);
     } catch (err) {
       console.log(err);
      
       res.status(404).json({ error: "Item not found" });
    }
   };
  