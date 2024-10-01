const jwt = require('jsonwebtoken');
const { connectToCosmos } = require("../Database/cosmosDBusers");
let cosmosContainer;
connectToCosmos().then(({ container }) => {
  cosmosContainer = container;
  console.log('databaseconnection:'+"successfully");
}).catch((err)=>{console.log(err.message);
});

exports.isAuthenticate = async (req, res, next) => {
  
    try {
        const token  = req.headers.token||req.cookies.token;
       
        
        if (!token) {
            return res.status(400).json({ message: 'Login first to handle this resource' });
        }

        const decoded = await jwt.verify(token, 'defaultSecretKey');
        const id = decoded.id;
     
       
         if(!id){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid or missing token"
            });
         }
         
         const { resource: user } = await cosmosContainer.item(id,id).read();
         console.log(user);

            if (user) {
                req.user = await user;
                next(); 
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'No user found'
                });
            }
     
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
