import { useCart } from '../Context/CartContext';

const MyProduct = () => {
  const { products } = useCart(); 

  return (
    <>
      {products?.length === 0 ? (
        <p>You have not added any product</p>
      ) : (
        <>
          <p>Your products:</p>
          <ul>
            {products.map((product, index) => (
              <li key={index}>{product.name}</li> // Adjust based on your product structure
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default MyProduct;
