const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    obj = {num:23, name:'ops'}
    res.json(obj)
})

module.exports = router