const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const validator = require('validator');


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // null checking 
        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password should be provided"
            })
        }
        
        const isValidEmail = validator.isEmail(email);
        if ( !isValidEmail) {
           return res.status(400).send({ message: 'Your email is invalid, enter the real email! '});
        }
        
        // check user exists or not
        let user = await User.findOne({
            where: { email }
        })

        if (user) {
            // user already exists
            return res.status(400).send({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json(
            { 
                message: 'user registered successfully '
            });
    } catch (error) {
        res.status(400).json({
            error: error.message , 
            message: 'Your request is bad one, try again!'
        });
    }
};

exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const isValidEmail = validator.isEmail(email);
        if ( !isValidEmail) {
           return res.status(400).send({ message: ' Your email is invalid, enter the real email! '});
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found, please check your request'});
        }

        const isvalidPassword = await bcrypt.compare(password, user.password) ;
        if (!isvalidPassword) return res.status(400).json({ message: 'Invalid password'});

        if ( user.email === 'danielwhite02111@gmail.com' || user.email === 'samuelgreen02111@gmail.com') {
            user.role = 'ADMIN';
            
        }
        await user.save();
        const token = jwt.sign(
             { id: user.id, role: user.role, name: user.name, email: user.email }, 
              process.env.JWT_SECRET
            );
        const { password: _, ..._user } = user.dataValues;
        
        res.status(200).json({ 
            message:'Login successful! ',  
            user: _user,
            token,
            role: user.role
            
        });
    } catch (error) {
        res.status(400).json({ 
            error: "Your request is bad one, it is failed" 
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findOne({ 
            where: 
                { 
                    email: req.user.email
                } 
        });
     
        const { password: _, ..._user } = user.dataValues;
         res.status(200).json({ 
            user: _user, 
            message: `welcome ${ req.user.name } USER !` 
        });
    
    } catch (error) {
        res.status(400).json( {
            error: error.message, 
            message: "You can't do it, try again later."
        } );
    }
};

exports.changeMyInfo = async (req, res ) => {
    console.log("Here is changeMyInfo function! ")
    console.log('changeself==>', req.user)

    try {
        const email = req.user.email ;
        const { name, password } = req.body ;

        const newUser = await User.findOne({ where: { email: email }});
        console.log('new -->' , newUser)
        newUser.name = name ;

        const newPassword = await bcrypt.hash( password, 10);
     
        newUser.password = newPassword ;
        await newUser.save() ;
        

        res.status(200).json({ 
            message: 'Your information is changed successful! ' , 
            yourInfo :  { 
              name: newUser.name,
              email: newUser.email,
              yourNewPassword: req.body.password
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message ,
            message: 'Your information cannot be changed ' 
        });
    }
}