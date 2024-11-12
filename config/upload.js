// import multer from "multer";
// import path from "path";
// import Product from "../models/product";

// // Configure multer storage
// const storage = multer.diskStorage(
//     {
//         destination: (req, file, cb) => {
//             if (file.fieldname === 'avatars') {
//                 cb(null, 'uploads/image/avatars') ;  
//             } else if (file.fieldname ==='productImage') {
//                 cb(null, 'uploads/image/products');
//             } else {
//                 cb(new Error("Invalid field name"), false);
//             }

//         },
//         filename: (req, file, cb) => {
//             cb(null, Date.now() + path.extname(file.originalname)); //Generate unique filenames
//         }
//     }
// );
// //Initialize multer with storage configuration
// const upload = multer({ storage: storage }); 

// export default upload ;
