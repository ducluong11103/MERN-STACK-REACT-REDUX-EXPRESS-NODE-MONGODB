import React, { Fragment, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails } from "../../actions/productAction";
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  let { id } = useParams(); // Lấy giá trị id từ URL
  
  // Thực hiện việc sử dụng giá trị `id` ở đây, ví dụ:
  // console.log("ID Sản phẩm:", id);

  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.productDetails);

  useEffect(() => {
    dispatch(getProductDetails(id)); // Sử dụng giá trị `id` từ useParams
  }, [dispatch, id]);
  // console.log(product.images)

return (
  <Fragment>
    <div className="ProductDetails">
      <div>
        {product && product.images && product.images.length > 0 ? (
          <Carousel>
            {product.images.map((item, i) => (
              <img
                className="CarouselImage"
                key={item.url}
                src={item.url}
                alt={`${i} Slide`}
              />
            ))}
          </Carousel>
        ) : (
          <p>No images available</p>
        )}
      </div>
    </div>
  </Fragment>
);

};

export default ProductDetails;
