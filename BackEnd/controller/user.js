const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');

exports.postSignUpUser = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = req.body.password;
    try{
        const user = await User.findOne({ where:{ email: email }})
        if (user) {
            return res.status(409).json({ error: "User already exists" });
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash)=>{
            if(err){
              console.log(err);  
            }
            const result= await User.create({
                name: name,
                email: email,
                mobile: mobile,
                password: hash
            })
                return res.json(result);
        })
       
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    };
}