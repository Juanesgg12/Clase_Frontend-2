import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import styles from '../styles/ProductList.module.css';
import { useState } from 'react';


 
function ProductList() {


    const [productsState, setProductsState] = useState(products);

    return (
        <div className = {styles.container}>
            <header className = {styles.header}>
            <h1 className = {styles.title}>Lista de Productos</h1>
            <p className = {styles.description}>Explora nuestra selección de productos!</p>
            </header>
 
            <div>
                {productsState.map((product) => (
                <ProductCard key={product.id} name={product.name} />
                ))}
            </div>
        </div>
    )          
}
 
export default ProductList;