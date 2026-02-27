import { useEffect, useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import styles from "../styles/ProductList.module.css";

const STORAGE_KEY = "products";

function ProductList() {
  // ── Estado: productos (carga desde localStorage si existe) ──────────────
  const [productsState, setProductsState] = useState(() => {
    if (typeof window === "undefined") return products;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return products;

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : products;
    } catch {
      return products;
    }
  });

  // ── Estado: modal del formulario ────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Estado: producto que se está editando (null = modo agregar) ─────────
  const [editingProduct, setEditingProduct] = useState(null);

  // ── Persistencia: guarda en localStorage cuando cambia productsState ────
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(productsState));
    } catch (error) {
      void error;
    }
  }, [productsState]);

  // ── Cerrar modal y limpiar edición ──────────────────────────────────────
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // ── Abrir modal en modo "crear" ─────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // ── Abrir modal en modo "editar" ────────────────────────────────────────
  const handleEditStart = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // ── Agregar producto ────────────────────────────────────────────────────
  const handleAddProduct = (newProductData) => {
    const newProduct = {
      ...newProductData,
      id: Date.now(), // id único basado en timestamp
    };
    setProductsState((prev) => [...prev, newProduct]);
    handleCloseModal();
  };

  // ── Guardar edición ─────────────────────────────────────────────────────
  const handleEditSubmit = (updatedProduct) => {
    setProductsState((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    handleCloseModal();
  };

  // ── Eliminar producto ───────────────────────────────────────────────────
  const handleDeleteProduct = (id) => {
    setProductsState((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Lista de Productos</h1>
        <p className={styles.subtitle}>Explora nuestra selección de productos.</p>
      </header>

      {/* Toolbar con botón Agregar */}
      <div className={styles.toolbar}>
        <button type="button" className={styles.btnAdd} onClick={handleOpenCreate}>
          + Agregar producto
        </button>
      </div>

      {/* Grilla de tarjetas */}
      <div className={styles.grid}>
        {productsState.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            category={product.category}
            stock={product.stock}
            price={product.price}
            image={product.image}
            description={product.description}
            onEdit={() => handleEditStart(product)}
            onDelete={() => handleDeleteProduct(product.id)}
          />
        ))}
      </div>

      {/* Modal del formulario */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // evita cerrar al clickear dentro
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={handleCloseModal}
              aria-label="Cerrar"
            >
              ✕
            </button>
            <ProductForm
              initialValues={editingProduct}
              isEditing={Boolean(editingProduct)}
              onCancel={handleCloseModal}
              onSubmit={editingProduct ? handleEditSubmit : handleAddProduct}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;