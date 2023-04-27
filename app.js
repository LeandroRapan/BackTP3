import  express  from "express";
import ProductManager from "./src/manager/productManager.js";

const app = express();
const path = './products.json'
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const productManager = new ProductManager(path)
const port = 8080;

app.get('/products', async(req, res)=>{
    const {limit} = req.query;
    try{
        const products = await productManager.getProducts(limit);
        res.status(200).json(products)
    }catch(error){
        res.status(400).json({message: error.message});
        console.log(error)
    }
})
app.get('/products/:id', async(req,res)=>{
    try{
        const { id } = req.params;
        const product = await productManager.getProductById(Number(id));
        if(product){
            res.status(200).json(product)
        }else{
            res.status(400).send('producto no encontrado')
        }
    }catch(error){
        res.status(400).json({message: error.message});
        console.log(error)

    }
})

app.post('/products', async(req,res)=>{
    try{
        const product = req.body;
        const newProduct = await productManager.createProduct(product)
        res.json(newProduct)

    }catch(error){
        res.status(400).json({message: error.message});
       
    }
})

app.put('/products/:id', async(req,res)=>{
    try{
        const product = req.body;
        const {id} = req.params;
        const productFile = await productManager.getProductById(Number(id));
        if (productFile){
            await productManager.updateProduct(product, Number(id));
            res.send('producto actualizado')
        }else{
            res.status(400).send('producto no encontrado')
        }

    }catch(error){
        res.status(400).json({message: error.message});
        
    }
})
app.delete('/products/:id', async(req,res)=>{
    try{
        const {id} = req.params;
        const products = await productManager.getProducts();
        if (products.length > 0){
            await productManager.deleteProductById(Number(id));
            res.send('producto eliminado')
        }else{
            res.send('el producto no existe')
        }

    }catch(error){
        res.status(400).json({message: error.message});
    }

})

app.delete('/products', async(req,res)=>{
    try{
        await productManager.deleteProducts();
        res.send('productos borrados')
    }catch(error){
        res.status(400).json({message: error.message});
    }

})
app.listen(port, ()=>{
    console.log('server ok')
})
