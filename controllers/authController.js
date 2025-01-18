import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import validator from 'validator';


export const register = async (req, res) => {
    console.log('register------------------>')
    try {
        const { name, email, password, confirmPassword } = req.body;
        console.log('register------------------>')
        // null checking 
        if (!email || !password) {
            return res.status(400).send({
                message: "Email and password should be provided"
            })
        }
        if (confirmPassword !== password) {
            return res.status(400).json({
                message: 'Confirming your password is failed.'
            });
        }
        
        const isValidEmail = validator.isEmail(email);
        if ( !isValidEmail) {
           return res.status(400).send({ message: 'Your email is invalid, enter the real email! '});
        }
        
        // check user exists or not
        let user = await User.findOne( {
                  where: { email }
                } );

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
                message: 'user registered successfully ',
                NewUser: {
                    name: user.name ,
                    email: user.email ,
                }
            });
    } catch (error) {
        res.status(400).json({
            error: error.message, 
            message: 'Your request is bad one, try again!'
        });
    }
};

export const login = async (req, res) => {

    try {
        console.log(" Welcome to login backend function! ")
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
            error,
            error: "Your request is bad one, it is failed" 
        });
    }
};

export const getMe = async (req, res) => {
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

export const changeMyInfo = async (req, res ) => {
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
