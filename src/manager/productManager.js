import fs from 'fs';

export default class ProductManager{
    constructor (path){
        this.path = path
    }
    async #getMaxId(){
        let maxId= 0;
        const products = await  this.getProducts();
        products.map((prod)=>{
            if(prod.id > maxId){
                maxId = prod.id
            }
            console.log(maxId)
            return maxId
        })
        return maxId
    }
    async getProducts(limit){
        try{
            if(fs.existsSync(this.path)){
                const products = await fs.promises.readFile(this.path, 'utf-8');
                const productsJSON = JSON.parse(products);
                if (limit) {
                    return productsJSON.slice(0, limit);
                }
                return productsJSON
            }else{ return []}
        }catch(error){
            console.log('error obteniendo productos')

        }
    }
    async getProductById(id){
        try{
            const products = await this.getProducts();
            const product = products.find((prod)=> prod.id === id);
            if (product){
                return product
            }else{
                return false
            }

        }catch(error){
           console.log('error obteniendo producto por id') 
        }
    }
    async createProduct(obj){
       try{
        const product = {
            id: await this.#getMaxId() +1,

            ...obj
        }
        const productsFile = await this.getProducts();
        productsFile.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
        return product
        }catch(error){
            console.log(error)
        }
    }
    async updateProduct(obj,id){
        try{
            const productsFile = await this.getProducts();
            const index = productsFile.findIndex(p => p.id === id);
            if(index === -1){
                throw new Error('id no encontrado') 
            }else{
                productsFile[index]= {...obj, id}
            }
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile))

        }catch(error){
            console.log(error)
        }}
    async deleteProductById(id){
        try{
            const productsFile = await this.getProducts();
            if(productsFile.length > 0){
               const newArray = productsFile.filter(p=> p.id !== id);
               await fs.promises.writeFile(this.path, JSON.stringify(newArray))
            }else{
                throw new Error(`product id: ${id} no encontrado`)
            }

        }catch(error){
            console.log(error)
            
        }}
    async deleteProducts(){
        try{
            if(fs.existsSync(this.path)){
                await fs.promises.unlink(this.path)
            }

        }catch(error){
            
        }}
}