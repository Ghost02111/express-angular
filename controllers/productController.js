import Category from '../models/category.js';
import Product from '../models/product.js';
import fs from 'fs'


export const addProduct = async (req, res) => {
    console.log('file', req.file)
    const imgUrl = req.file ? req.file.path : null ;
    try {
        console.log('Here is the addProduct backend function!' , req.body)
        const { name, price, producer, country, category } = req.body;

        console.log('request', req.body)
        if (!name || !price) {
            
            if (imgurl) {
                fs.unlinkSync(imgUrl);
            }   

            return res.status(400).send({ message: "A product must have its name and price! Try again" });

        }

        const foundProduct = await Product.findOne({
            where: { name }
        });
        if (foundProduct) {
            if (imgUrl) {
                fs.unlinkSync(imgUrl);
            }   
            return res.status(400).json({
                message: " The product name already exists! "
            });
        }
        console.log('imgurl', imgUrl)
        // const createdCategory = await Category.findOne(
        //     {
        //         where : { name: category },
        //     }
        // ) ;
        // console.log(category)
        // if ( !createdCategory ) {
        //     return res.status(404).send({ message : 'The category not found! Try again.'})
        // }
        const product = await Product.create({
            name,
            price,
            producer,
            country,
            category,
            imgUrl: imgUrl.replace(/\\/g, '/') ,
        });
        console.log('console', product)

        res.status(201).json({
            message: "a new productor is created successfully.",
            new_product: product,
        })

    } catch (error) {
        res.status(500).json(
            {
                error: error.message,
            }
        )
    }
};


export const changeProduct = async (req, res) => {
    console.log("Here is the change product function")
    console.log('file', req.file)
    console.log('body', req.body)
    const imgUrl = req.file ? req.file.path : null ;
    try {

        const id = req.params.id;
        const { name, price, producer, country, category } = req.body;
        console.log('name', name)
        const product = await Product.findOne({
            where: { id },
        });
        if (imgUrl) {
            product.imgUrl = imgUrl.replace(/\\/g, '/');
        }

        if (name) {
            product.name = name;
        }
        if (price) {
            product.price = price;
        }
        if (producer) {
            product.producer = producer;
        }
        if (country) {
            product.country = country;
        }
        
        if (category) {

            const changedCategory = await Category.findOne({
                where: { name: category },
            });

            if (!changedCategory) {
                return res.status(404).json({ message: 'The category not found! ' });
            }

            product.category = changedCategory.name;
        }
        


        await product.save();
        console.log('product', product)
        res.status(200).json(
            {
                message: "The product is changed successfully.",
                result: product,
            }
        );

    } catch (error) {
        res.status(500).json(
            {
                message: error,
            }
        )
    }
};

export const getProducts = async (req, res) => {
    try {
        console.log('Here is the getProducts backend function!')
        const allProducts = await Product.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        res.status(200).json({
            message: 'Get products successfully!',
            result: allProducts,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted_product = await Product.destroy(
            {
                where: { id },
            }
        );
        if (deleted_product) {
            return res.status(200).json({ message: "The product is deleted successfully" });
        } else {
            return res.status(404).json({ message: "The product is not found" });
        }
    } catch (error) {
        res.status(500).json(
            {
                message: error.message
            }
        )
    }
}

export const getCurrentProduct = async (req, res) => {
    console.log('Here is the getCurrentProduct backend func, and the request: ')
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'There is no the product! ' })
        }
        res.status(200).json(
            {
                message: 'Get current product successfully',
                result: product,
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                message: error.message,
            }
        )
    }
}