'use client';

import { useState, useEffect } from 'react';
import './StorePage.css';
import { supabase } from '@/lib/supabaseClient';
import { Product, CartItem } from '@/types';

export default function StorePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
  });
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);

    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else if (data) {
        const productsWithImages = data.map((product: any) => {
          let imageUrl = '';
          const nameLower = product.name.toLowerCase();

          if (nameLower.includes('ram') || nameLower.includes('memory')) {
            imageUrl = 'https://tiny.pl/1h6z5rp4h';
          } else if (nameLower.includes('graphics') || nameLower.includes('gpu') || nameLower.includes('card')) {
            imageUrl = 'https://tiny.pl/yw-rs730c';
          } else if (nameLower.includes('processor') || nameLower.includes('cpu')) {
            imageUrl = 'https://tiny.pl/chyncmq45';
          } else if (nameLower.includes('motherboard') || nameLower.includes('board')) {
            imageUrl = 'https://tiny.pl/y7-cpt91x';
          } else {
            imageUrl = 'https://tiny.pl/18_xybz9n';
          }

          return {
            ...product,
            image_url: imageUrl,
          };
        });

        const customOrder = ['ram', 'motherboard', 'processor', 'graphics'];

        productsWithImages.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          const indexA = customOrder.findIndex((keyword) => nameA.includes(keyword));
          const indexB = customOrder.findIndex((keyword) => nameB.includes(keyword));

          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;

          return nameA.localeCompare(nameB);
        });

        setProducts(productsWithImages);
      }
    }

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      setOrderStatus('Your cart is empty!');
      return;
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        totalPrice,
        items: cart,
      }),
    });

    if (response.ok) {
      setOrderStatus('Order placed successfully!');
      setCart([]);
      setFormData({ firstName: '', lastName: '', address: '' });
    } else {
      setOrderStatus('Error while placing the order.');
    }
  };

  if (!isMounted) {
    return (
      <main className="page">
        <p className="loadingText">Loading store...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        
        <header className="header">
          <h1 className="mainTitle">PC Parts Store</h1>
          <div data-testid="cart-counter" className="cartCounter">
            🛒 Cart: <span>{totalItemsCount} pcs</span>
          </div>
        </header>

        <section className="section">
          <h2 className="title">Available Products</h2>
          <div className="productsGrid">
            {products.map((product) => (
              <div key={product.id} className="productCard">
                <div className="productImageContainer">
                  <img src={product.image_url} alt={product.name}className="productImage"/>
                  </div>
              
                <div className="productContent">
                  <div className="productInfo">
                    <h3 className="productName">{product.name}</h3>
                    <p className="productPrice">{product.price}zł</p>
                  </div>

                  <button
                    className="btnGreen"
                    data-testid={`add-to-cart-${product.id}`}
                    onClick={() => addToCart(product)}> Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card section">
          <h2 className="title">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="emptyCart">Your cart is empty.</p>) : (
            <div className="cartList">
              {cart.map((item) => (
                <div key={item.id} className="cartItem">
                  <div>
                    <p className="cartItemName"><strong>{item.name}</strong></p>
                    <p className="cartItemDetails">{item.quantity} × {item.price}zł</p>
                  </div>
                  {}
                  <button className="btnRed" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card section">
          <h2 className="title">Summary & Checkout</h2>
          <p className="totalPrice">
            Total to pay: <span>{totalPrice.toFixed(2)}zł</span>
          </p>

          <form onSubmit={handleCheckout} className="form">
            <div className="formGroup">
              <label className="label">First Name</label>
              <input
                className="input"
                type="text"
                required
                data-testid="input-firstname"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div className="formGroup">
              <label className="label">Last Name</label>
              <input
                className="input"
                type="text"
                required
                data-testid="input-lastname"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="formGroup">
              <label className="label">Address</label>
              <textarea
                className="input textarea"
                required
                data-testid="input-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <button className="btnBlue" data-testid="submit-order" type="submit">
              Place Order & Pay
            </button>
          </form>

          {orderStatus && (
            <p data-testid="order-status" className="orderStatus">
              {orderStatus}
            </p>
          )}
        </section>
        <section className="card section portfolioSection">
          <h2 className="title">Project Overview</h2>
          <p className="portfolioDescription">
            Here is a quick project overview. Hope it helps.
          </p>
          
          <div className="videoContainer">
            <iframe
              src="https://www.youtube.com/embed/_v_ddbTG8UI"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="portfolioFooter">
            <div className="portfolioAuthor">
            </div>
            <div className="socialLinks">
              <a href="https://github.com/PolishTango" target="_blank" rel="noopener noreferrer" className="socialLink github">
                GitHub Repository
              </a>
              <a href="https://www.linkedin.com/in/daniel-fronczak-profile/" target="_blank" rel="noopener noreferrer" className="socialLink linkedin">
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}