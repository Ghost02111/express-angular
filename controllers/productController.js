import Category from '../models/category.js';
import Product from  '../models/product.js';



export const addProduct = async (req, res) => {
      try {
        const { name , price, producer, country, category } = req.body ;
        if( !name || !price ) {
            return res.status(400).send({ message: "A product must have its name and price! Try again"});
        }
        const foundProduct = await Product.findOne( {
            where: { name }
        });
        if ( foundProduct ) {
            return res.status(400).json( {
                message: " The product name already exists! "
            });
        }
        const createdCategory = await Category.findOne(
            {
                where : { name: category },
            }
        ) ;
        console.log(category)
        if ( !createdCategory ) {
            return res.status(404).send({ message : 'The category not found! Try again.'})
        }
        const product = await Product.create( { 
            name ,
            price,
            producer,
            country,
            categoryId: createdCategory.id,
        });

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


export const changeProduct = async (req, res)  =>  {
     try {
        console.log("Here is the change product function")
        const id = req.params.id;
         const { name, price, producer, country, category } = req.body;
         const product = await Product.findOne( {
            where: { id },
         });
         if ( name ) {
            product.name = name ;
         } 
         if ( price ) {
            product.price = price ;
         }
         if ( producer ) {
            product.producer = producer ;
         }
         if ( country ) {
            product.country = country;
         }  
         if( category ) {
           
            const changedCategory = await Category.findOne( { 
                where: { name: category },
              } );
            
              if ( !changedCategory ) {
                return res.status(404).json({ message : 'The category not found! '});
              }
              
              product.categoryId = changedCategory.id;
         }
         

        await product.save();
        res.status(200).json( 
             {
                message: "The product is changed successfully.",
                Result: product ,
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
        const allProducts = await Product.findAll( {
            attributes: { exclude: ['createdAt', 'updatedAt']}
        });
        res.status(200).json( {
            message: 'Get products successfully!',
            result: allProducts ,
        });
    } catch (error) {
        res.status(500).json( {
            message: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id ;
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