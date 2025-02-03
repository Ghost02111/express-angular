import Category from "../models/category.js";

export const createCategory = async (req, res) => {
    try {
        console.log('Here is the createCategory backend and the request: ', req.body)
        const { name } = req.body ;
        if (!name) {
            return res.status(400).json(
                { message : ' You must enter the category name!'}
            );
        }

       const  foundedCategory = await Category.findOne( {
               where: { name },
        });
     console.log('000000')
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
        const categories = await Category.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']]
        });

        // Check if categories exist
        if (!categories || categories.length === 0) {
            // If no categories exist, create default ones
            const defaultCategories = [
                { name: 'Electronics' },
                { name: 'Fashion' },
                { name: 'Home & Living' },
                { name: 'Sports' },
                { name: 'Books' },
                { name: 'Beauty' }
							];

            const createdCategories = await Category.bulkCreate(defaultCategories);

            return res.status(200).json({
                message: 'Default categories created successfully',
                result: createdCategories
            });
        }

        // Return existing categories
        return res.status(200).json({
            message: 'Getting categories completed successfully',
            result: categories
        });

    } catch (error) {
        console.error('Error in getCategory:', error);
        return res.status(500).json({
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

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
        console.log('Here is the deleteCategory backend function!')
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

