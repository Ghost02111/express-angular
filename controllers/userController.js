import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import validator from 'validator';



export const getUsers = async (req, res) => {
    console.log('Here is the getUser backend function!')
    try {
        const users = await User.findAll();
        
        const userValues = users.map(user => {
            const { password: _ , ..._user } = user.dataValues;
            return _user;
        })

         res.status(200).json({  
            message: `welcome ${req.user.name}! Here is the list of users.` , 
            users: userValues
        });
    } catch (error) {
        res.status(400).json( {error: error.message} )
    }
  };

export const addUser = async (req, res) => {
    
    try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).send({
            message: "Email and password should be provided"
        })
    } 
    const isValidEmail = validator.isEmail(email);
    if ( !isValidEmail) {
        return res.send({ message: 'Your email is invalid, enter the real email! '});
    }
    // check user exists or not
    let user = await User.findOne({
        where: { email }
    })

    if (user) {
        // user already exists
        return res.status(400).send({
            message: "The email already exists. your request is invalid. please check and try again!"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create( {
        name, email, password: hashedPassword, role
    });
    
     res.status(200).json({ message: `Generated a new ${role} successfully` ,
          NewUserInfo: {
             id: newUser.id , name: newUser.name, email: newUser.email
          }
        });
    
    } catch (error) {
        res.status(400).json({ 
            Message: 'U cannot create a new person, there is a problem in your request.'
        });
    }
}

export const changeRole = async (req, res) => {
    try {
        console.log(" Here is changeRole function! ")
        
        const id = req.params.id;
        const { role } = req.body ;

        const user = await User.findByPk( id );
        if (!user) {
            return res.status(404).send({ message: " The User is not found! Check your request."})
        }

        await user.update({ 
            role, 
        })
        res.status(200).json({ 
            message: " You changed a person's role successfully! ",
            Result: { 
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }});
    } catch (error) {
        res.status(400).json( { 
            message: ' Your request is not valid. Please check your request. ',
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        console.log(" Here is the deleteUser function! ")
        const id = req.params.id ;
        const deleted_user = await User.destroy( { where: { id } });
        
        if (deleted_user) {
            return res.status(200).json({ message: "User deleted successfully" });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ 
            error: error,
            message: " You can't delete user, Server error. "
        })
    }
}

// export const getCurrentProduct = async (req, res) => {
//     try {
//         const id = req.params.id ;
//         const product = await Product.findByPk( id );
//         if ( !product ) {
//             return res.status(404).json({ message: 'There is no the product! '})
//         }
//         res.status(200).json(
//             {
//                 message: 'Get current product successfully',
//                 result: product ,
//             }
//         );
//     } catch (error) {
//         res.status(500).json(
//             {
//                 message: error.message ,
//             }
//         )
//     }
// }