const { connectToCosmos } = require("../Database/cosmosDBcatalogue");

let cosmosContainer;
connectToCosmos().then(({ container }) => {
  cosmosContainer = container;
  console.log('databaseconnection:'+"successfully");
}).catch((err)=>{console.log(err.message);
});


 exports.addcatalogue=async (req, res) => {
    const {catalogSections,company}=req.body
    const userId=req.user.id
    console.log(req.body);
    
    
    
  if (!company ||!catalogSections ||!userId) {
    return res.status(400).json({ message: "Please provide company title,descriptionand url and userId" });
}
    try {
   
      const newItem = {
        userId:userId,
        company:company,
        catalogSections:catalogSections
      };
      
      const { resource: createdItem } = await cosmosContainer.items.create(newItem);
      
        
      res.status(201).json({success:true,message:"Added successfully",createdItem});
    } catch (err) {
      res.status(500).json({ message:err.body.code,error: err.message });
  
      console.log(err);
      
      
      
    }
  };
  
  exports.getcatalogue= async (req, res) => {
    try {
      const { resources: items } = await cosmosContainer.items.query("SELECT * FROM c").fetchAll();
      if (items.length === 0) {
        return res.status(404).json({ error: "Cateloguedatas not found" });
      }
      res.status(200).json({success:true,message:"All items get successfully",data:items});
    } catch (err) {
      res.status(500).json({ message:err.body.code,error: err.message });
    }
  };





  exports.getallcataloguedata =async (req, res) => {
    const id=req.user.id
    if (!id) {
      return res.status(404).json({ error: "UserId required" });
    }
    try {
     
      const querySpec = {
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [
          { name: "@userId", value: id }
        ]
      };
  
      const { resources: items } = await cosmosContainer.items
        .query(querySpec)
        .fetchAll();
        
        if (items.length === 0) {
          return res.status(404).json({ error: "All items  not found" });
        }
        console.log(items);
        
        res.status(200).json({success:true,message:"All items get successfully",data:items});
          
      
    } catch (error) {
      return  res.status(500).json({
          success: false,
          message: error.message || 'Internal Server Error',
      })
    }
  };






  
   exports.getsinglecatalogue= async (req, res) => {
    const itemId = req.params.id;
  try {
      const { resource: item } = await cosmosContainer.item(itemId,itemId).read();
      res.status(200).json({
        success:true,
        message:"Singdata get successfully",
        item});
    } catch (err) {
      res.status(404).json({message:err.body.code, error: "Item not found" });
    }
  };
  
  
  




exports.updatecatalogue = async (req, res) => {
  const {id,company,catalogSections}=req.body
  const userId=req.user.id
  const itemId = req.params.id;
  console.log(req.body );


   
if (!id || !company||!catalogSections ||!userId) {
  return res.status(400).json({ message: "Please provide title,descriptionand url and userId" });
}

  try {
    
    const updatedItem ={
    userId:userId,
    company:company,
    catalogSections:catalogSections,
    id:itemId
  };

    const { resource: item } = await cosmosContainer.item(itemId,itemId).replace(updatedItem);
    if (item.length === 0) {
      return res.status(404).json({ error: "Cateloguedatas not found" });
    }
    res.status(200).json({success:true,message:"Updated successfully",item});
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(404).json({ 
      message:"Item not found or update failed" });
  }
};


exports.deletecatalogue = async (req, res) => {
  const itemId = req.params.id;

  try {
    const { resource: item} =await cosmosContainer.item(itemId,itemId).delete();
   
    if(item==null){
      res.status(200).json({success:true, message:"Deleted successfully" });
    }
  } catch (err) {
    console.error("Error deleting item:", err);
   res.status(404).json({ 
    message:err.body.code,
    error: "Item not found or delete failed" });
  }
};


  
  