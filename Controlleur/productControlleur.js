const express = require("express");
const router = express.Router(); 

const Product = require("../models/product");
const User = require("../models/user");
const Reservation = require("../models/Reservation"); 

const multer = require("multer");

const mystorage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, callback) => {
    let date = Date.now();
    let fl = date + "." + file.mimetype.split("/")[1];
    callback(null, fl);
  },
});

const upload = multer({ storage: mystorage });

router.post("/addproduct", upload.any("image"), (req, res) => {
  const productData = req.body;
  const product = new Product(productData);
  product.image = req.files[0].filename; 
  product
    .save()
    .then((savedProduct) => {
      console.log("Product added:", savedProduct);
      res.status(200).json({ message: "Product added successfully" });
    })
    .catch((error) => {
      console.error("Error adding Product:", error);
      res.status(500).json({ error: "Error adding Product" });
    });
});

router.put("/updateproduct/:id", upload.any("image"), (req, res) => {
  const productId = req.params.id;
  const updatedProductData = req.body;

  if (req.files && req.files.length > 0) {
    updatedProductData.image = req.files[0].filename;
  }

  Product.findByIdAndUpdate(productId, updatedProductData, { new: true })
    .then((updatedProduct) => {
      if (updatedProduct) {
        console.log("Product updated:", updatedProduct);
        res.status(200).json({ message: "Product updated successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    })
    .catch((error) => {
      console.error("Error updating Product:", error);
      res.status(500).json({ error: "Error updating Product" });
    });
});

router.get("/getallproduct", (req, res) => {
  Product.find()
    .then((products) => {
      console.log("All products:", products);
      res.json(products);
    })
    .catch((error) => {
      console.error("Error retrieving products:", error); 
      res.status(500).send("Error retrieving products");
    });
});

router.get("/getallproductnopromo", (req, res) => {
  Product.find({ promotion: false }) 
    .then((products) => {
      console.log("All products:", products);
      res.json(products);
    })
    .catch((error) => {
      console.error("Error retrieving products:", error);
      res.status(500).send("Error retrieving products");
    });
});


router.get("/getallproductwithpromo", (req, res) => {
  Product.find({ promotion: true }) 
    .then((products) => {
      console.log("All products:", products);
      res.json(products);
    })
    .catch((error) => {
      console.error("Error retrieving products:", error);
      res.status(500).send("Error retrieving products");
    });
});



router.get("/getpoloproducts", (req, res) => {
  const targetCategory = "POLO"; 

  Product.find({ categorie: targetCategory })
    .then((products) => {
      console.log("Polo products:", products);
      res.json(products);
    })
    .catch((error) => {
      console.error("Error retrieving polo products:", error);
      res.status(500).send("Error retrieving polo products");
    });
});

router.get("/getchemiseproducts", (req, res) => {
  const targetCategory = "chemise"; 

  Product.find({ categorie: targetCategory })
    .then((products) => {
      console.log("chemise products:", products);
      res.json(products);
    })
    .catch((error) => {
      console.error("Error retrieving chemise products:", error);
      res.status(500).send("Error retrieving chemise products");
    });
});

router.get("/get-shirt-products", (req, res) => {
  const targetCategory = "tshirt"; 

  Product.find({ categorie: targetCategory })
    .then((products) => {
      console.log("tshirt products:", products);
      res.json(products);
    })
    .catch((error) => {
      console.error("Error retrieving tshirt products:", error);
      res.status(500).send("Error retrieving tshirt products");
    });
});

router.delete("/deleteProduct/:id", (req, res) => {
  const myId = req.params.id;

  Product.findByIdAndDelete(myId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "Error deleting product" });
    });
});

router.get("/getProductById/:id", (req, res) => {
  const myId = req.params.id;

  Product.findById(myId)
    .then((product) => {
      if (!product) {
        return res.status(404).send("Product not found"); 
      }

      res.json(product);
    })
    .catch((err) => {
      console.error("Error retrieving product:", err); 
      res.status(500).send("Error retrieving product");
    });
});


router.get("/countProducts", async (req, res) => {
  try {
    const totalCount = await Product.countDocuments({});
    res.json({ totalCount });
  } catch (error) {
    console.error("Error counting products:", error);
    res.status(500).json({ error: "Error counting products" });
  }
});



module.exports = router;
