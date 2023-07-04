const express = require("express");
const fs = require("fs");
const ProductManager = require("./ProductManager");
const CartManager = require("./CartManager");

const app = express();
app.use(express.json());

const productManager = new ProductManager("./src/productos.json");
const cartManager = new CartManager("./src/carts.json");


app.get("/api/productos", (req, res) => {
  const limit = req.query.limit;
  const productos = productManager.getproductos(limit);
  res.json(productos);
});

app.get("/api/productos/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.post("/api/productos", (req, res) => {
  const product = req.body;

  try {
    productManager.addProduct(product);
    res.json({ message: "Producto agregado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/productos/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const productData = req.body;

  try {
    productManager.updateProduct(productId, productData);
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete("/api/productos/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    productManager.deleteProduct(productId);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

const cartsRouter = express.Router();

cartsRouter.post("/", (req, res) => {
  const newCart = cartManager.createCart();
  res.json(newCart);
});

cartsRouter.get("/:cid", (req, res) => {
  const cartId = req.params.cid;
  const cart = cartManager.getCartById(cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

cartsRouter.post("/:cid/productos/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = parseInt(req.params.pid);
  const quantity = req.body.quantity || 1;

  const product = productManager.getProductById(productId);
  const cart = cartManager.getCartById(cartId);

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  if (!cart) {
    res.status(404).json({ error: "Carrito no encontrado" });
    return;
  }

  cartManager.addProductToCart(cartId, productId, quantity);
  res.json({ message: "Producto agregado al carrito correctamente" });
});

app.use("/api/carts", cartsRouter);

app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});
