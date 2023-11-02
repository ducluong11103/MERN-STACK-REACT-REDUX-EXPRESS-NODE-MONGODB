const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");




// Create product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next)=>{

    req.body.user = req.user.id

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors( async (req, res) =>{

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    
    const products = await apiFeature.query;
    // Product.find();  
    res.status(200).json({
        success:true,
        products
    });
});
// Get Product Details
exports.getProductDetails = catchAsyncErrors(async(req, res, next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found", 404));
    }
    
    res.status(200).json({
        success: true,
        product,
        productCount,
    });
});

// Update Product --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) =>{

    let product = await Product.findById(req.params.id);

    // if(!product){
    //     return res.status(500).json({
    //         success: false,
    //         message: "Product not found"
    //     })
    // }
    if(!product){
        return next(new ErrorHander("Product not found", 404));
    }
    

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators: true,
        useFindAndMofify: false
    });
    res.status(200).json({
        success:true,
        product
    });
});

//Delete Product

exports.deleteProduct = catchAsyncErrors(async(req, res, next)=>{

    const product = await Product.findById(req.params.id);

    // if(!product){
    //     return res.status(500).json({
    //         success: false,
    //         message:"Product not foung"
    //     })
    // }
    if(!product){
        return next(new ErrorHander("Product not found", 404));
    }
    

    await product.deleteOne({_id: req.params.id});

    res.status(200).json({
        success:true,
        message:"Product delete Successfully"
    });
});


// Create new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next)=>{

    const {rating, comment, productId} = req.body

    const review = {
        user: req.body._id,
        name: req.body.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev=> rev.user.toString()=== req.user._id.toString());

    if(isReviewed){
        product.reviews.forEach(rev =>{
            if(rev.user.toString() === req.user._id.toString())
            (rev.rating=rating), (rev.comment=comment);
        });
    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }


    let avg=0;

    product.reviews.forEach((rev) =>{
        avg += rev.rating;
    })

    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    });
});

// Get all Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
// exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

//     const product = await Product.findById(req.query.id);

//     if(!product){
//         return next(new ErrorHander("Product not found", 404));
//     }

//     const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());
    
//     let avg = 0;

//     reviews.forEach((rev) => {
//         avg += rev.rating;
//     });

//     const ratings = avg / reviews.length;

//     const numOfReviews = reviews.length;

//     await Product.findByIdAndUpdate(req.query.productId, {
//         reviews,
//         ratings,
//         numOfReviews,
//     },{
//         new: true,
//         runValidators:true,
//         useFindAndMofify: false,
//     });

//     res.status(200).json({
//         success: true,
//     });
// });

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const productId = req.query.id;
    const reviewId = req.query.id;

    // Tìm sản phẩm
    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHander("Không tìm thấy sản phẩm", 404));
    }

    // Tìm chỉ mục của đánh giá cần xóa
    const reviewIndex = product.reviews.findIndex(review => review._id.toString() === reviewId.toString());

    if (reviewIndex === -1) {
        return next(new ErrorHander("Đánh giá không tồn tại", 404));
    }

    // Xóa đánh giá khỏi mảng reviews
    product.reviews.splice(reviewIndex, 1);

    let ratings = 0;
    let numOfReviews = product.reviews.length;

    if (numOfReviews > 0) {
        // Tính toán lại điểm đánh giá nếu còn đánh giá
        let totalRatings = product.reviews.reduce((total, review) => total + review.rating, 0);
        ratings = totalRatings / numOfReviews;
    }

    // Cập nhật thông tin sản phẩm với reviews và ratings đã được điều chỉnh
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            reviews: product.reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    if (!updatedProduct) {
        return next(new ErrorHander("Cập nhật sản phẩm thất bại", 500));
    }

    res.status(200).json({
        success: true,
    });
});

    
