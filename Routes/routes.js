const express = require('express');
const { userregister, login, getUserById } = require('../Components/User');
const { addcatalogue, getcatalogue, updatecatalogue, deletecatalogue, getsinglecatalogue, getallcataloguedata } = require('../Components/Catelogue');
const { isAuthenticate } = require('../middleware/Userauthicate');
const router = express.Router();



router.post('/register',userregister);
router.post('/login',login);

 router.get('/profile',isAuthenticate,getUserById);
 router.get('/allitems',isAuthenticate,getallcataloguedata);

router.post('/items',isAuthenticate,addcatalogue);
router.get('/items',isAuthenticate,getcatalogue);
router.get('/items/:id',getsinglecatalogue);
router.put('/items/:id',isAuthenticate,updatecatalogue);
router.delete("/items/:id",isAuthenticate,deletecatalogue)


module.exports=router