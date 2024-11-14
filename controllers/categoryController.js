import { emitKeypressEvents } from "readline";
import Category from "../models/category.js";

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body ;
        if (!name) {
            return res.status(400).json(
                { message : ' You must enter the category name!'}
            );
        }

       const  foundedCategory = await Category.findOne( {
               where: { name },
     });
        if ( foundedCategory ) {
            return res.status(400).send({ message: "The name already exists, take another name! "});
        }
        const category = await Category.create( {
             name ,
        });
        res.status(201).json( { 
            message: 'A category is created sccessfully! ',
            CreatedCategory: category, 
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message, 
        });
    }

};

export const getCategory = async (req, res) => {
    try {
        const allCategory = await Category.findAll() ;
        
        res.status(200).json( 
            {
                message: 'Getting catetories are completed successful.',
                result: allCategory ,
            }
        );
    } catch (error) {
        res.status(500).send( { message : error.message } );
    }
}

export const changeCategory = async (req, res) => {
    try {
        console.log(req.body)
        const { name } = req.body ;  // Get the 'name' field from the request body
        console.log( name );  // Check if 'name' is properly logged
        if ( !name ) {
            return res.status(400).json({ message: 'You must write the name', });
        }
        const id = req.params.id;
        const category = await Category.findByPk( id );
        
        if (!category) {
            return res.status(404).send({ message: "The category can't be found!" });
        }

        await category.update({
            name: name
        })

        res.status(200).json({
            message: "The category is changed successfully.",
            changedCategory: category,
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id ;
        const deletedCategory = await Category.destroy( {
            where: { id }, 
        });
        if ( !deletedCategory) {
            return res.status(404).send({ message: 'The category not found.'});
        }
        res.status(200).json({ 
            message: " your deleting is successful! ",
            deleteCategory: deleteCategory,
        })
    } catch (error) {
        return res.status(500).send({ message : error.message } );
    }
}

