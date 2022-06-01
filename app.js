//Storage Controller
const StorageController=(function(){

    return{

        //locale storage da kaydediyoruz
        storeProduct:function(product){

            let products;
            //local storage de daha önceden products key i var mı sorguluyoruz,sonuca göre products alanı oluşturum kaydetme yapacaz
            if(localStorage.getItem('products')===null){
                products=[];
                products.push(product);
                
            }else{
                products=JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }

            localStorage.setItem('products',JSON.stringify(products));
        },

        updateProduct:function(product){
            let products=JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd,index){
                if(product.id==prd.id){
                    products.splice(index,1,product); //indexten itibaren 1 lemmamn siler,yerine product i ekler
                }
            });
            localStorage.setItem('products',JSON.stringify(products));
        },

        deleteProduct:function(id){
            let products=JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd,index){
                if(id==prd.id){
                    products.splice(index,1); //indexten itibaren 1 lemmamn siler
                }
            });
            localStorage.setItem('products',JSON.stringify(products));
        },


        getProducts:function(){

            let products;
            if(localStorage.getItem('products')===null){
                products=[];
            }else{
                products=JSON.parse(localStorage.getItem('products'));
            }
            return products;
        }
    }

})();


//Product Controller
const ProductController=(function(){

    //private
    const Product=function(id,name,price){
        this.id=id;
        this.name=name;
        this.price=price;
    }

    const data={
        products:StorageController.getProducts(),

        selectedProduct:null,
        totalPrice:0
    }

    //public
    return{

        getProducts:function(){
            return data.products;
        },

        getData:function(){
            return data;
        },

        addProduct:function(name,price){
            let id;
            //data içinde eleman varsa
            if(data.products.length>0){
                //data içindeki son elemanın id sini al +1 ekle
                id=data.products[data.products.length-1].id+1;
            }
            else{
                id=0;
            }

            //yeni product ekleme
            const newProduct= new Product(id,name,parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },

        updateProdcut:function(name,price){
            let product = null;
            
            data.products.forEach(function(prd){
                if(prd.id==data.selectedProduct.id){
                    prd.name=name;
                    prd.price=parseFloat(price);
                    product=prd;
                }
            });

            return product;
        },

        deleteProduct:function(product){

            //ürün indexini bul splice ile o indexten sonra sil(farklı yöntemler kullanılabilir)
            data.products.forEach(function(prd,index){
                if(prd.id==product.id){
                    data.products.splice(index,1);
                }
            });
        },

        getProductById:function(id){
            let product =null;

            data.products.forEach(function(prd){
                if(prd.id==id){
                    product=prd;
                }
            });

            return product;
        },

        setCurrentProduct:function(product){
            data.selectedProduct=product;
        },

        getCurrrentProduct:function(){
            return data.selectedProduct;
        },

        getTotal:function(){
            let total=0;

            data.products.forEach(function(item){
                total+=item.price;
            });

            data.totalPrice=total;
            return data.totalPrice;
        }

    }

})();


//UI Controller
const UIController=(function(){

    const Selectors={
        productList:'#item-list',
        productListItems:'#item-list tr',   //item list altındaki tr ler
        addButton:'.addBtn',
        updateButton:'.updateBtn',
        cancelButton:'.cancelBtn',
        deleteButton:'.deleteBtn',
        productName:'#productName',
        productPrice:'#productPrice',
        productCard:'#productCard',
        totalTL:'#total-tl',
        totalDolar:'#total-dolar'
    }

    return{
        createProductList:function(products){

            let html='';

            products.forEach(prd => {

                html+=`

                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price}</td>
                    <td class="text-right">
                        
                            <i class="far fa-edit edit-product"></i> 
                        
                    </td>
                </tr>

                `;
                
            });

            document.querySelector(Selectors.productList).innerHTML=html;

        },

        getSelectors:function(){
            return Selectors;
        },

        addProduct:function(product){

            document.querySelector(Selectors.productCard).style.display='block';
            var item =`

            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td class="text-right">
                     <i class="far fa-edit edit-product"></i> 
                </td>
            </tr>

            `;

            document.querySelector(Selectors.productList).innerHTML+=item;
        },

        updateProductToForm:function(product){
            let updatedItem=null;

            let items=document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item){
                if(item.classList.contains('bg-warning')){
                    item.children[1].textContent=product.name;  //product name set
                    item.children[2].textContent=product.price+ '$';  //product price set
                    updatedItem=item;
                }
            });

            return updatedItem;
        },

        deleteProductToForm:function(product){
            let items=document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item){
                if(item.classList.contains('bg-warning')){
                    item.remove();
                };
            });
        },

        clearInputs:function(){
            document.querySelector(Selectors.productName).value="";
            document.querySelector(Selectors.productPrice).value="";
        },

        hideCard:function(){
            document.querySelector(Selectors.productCard).style.display='none';
        },

        showTotal:function(total){
            document.querySelector(Selectors.totalDolar).textContent=total;
            document.querySelector(Selectors.totalTL).textContent=total*16.37;
        },

        addProductToForm:function(){
            const selectedProduct=ProductController.getCurrrentProduct();
            document.querySelector(Selectors.productName).value=selectedProduct.name;
            document.querySelector(Selectors.productPrice).value=selectedProduct.price;
        },

        addingState:function(item){
            
            UIController.celarWarnings();

            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display='inline';
            document.querySelector(Selectors.updateButton).style.display='none';
            document.querySelector(Selectors.deleteButton).style.display='none';
            document.querySelector(Selectors.cancelButton).style.display='none';
        },

        editState:function(tr){

           

            //arka plan ekle
            tr.classList.add('bg-warning');

            document.querySelector(Selectors.addButton).style.display='none';
            document.querySelector(Selectors.updateButton).style.display='inline';
            document.querySelector(Selectors.deleteButton).style.display='inline';
            document.querySelector(Selectors.cancelButton).style.display='inline';

        },

        celarWarnings:function(){
            const items =document.querySelectorAll(Selectors.productListItems);

            items.forEach(function(item){
                if(item.classList.contains('bg-warning')){
                    item.classList.remove('bg-warning');
                }
            });
        }

    }

})();

//App Controller
const App=(function(ProductCtrl,UICtrl,StorageCtrl){

    const UISelectors=UIController.getSelectors();

    //Load Event Listeners
    const loadEventListeners=function(){

        //add product event
         document.querySelector(UISelectors.addButton).addEventListener('click',productAddSubmit);

         //edit product Click
         document.querySelector(UISelectors.productList).addEventListener('click',productEditClick);

         //edit product submit
         document.querySelector(UISelectors.updateButton).addEventListener('click',editProductSubmit);

         //cancel button click
         document.querySelector(UISelectors.cancelButton).addEventListener('click',cancelUpdate);

         //delete button click
        document.querySelector(UISelectors.deleteButton).addEventListener('click',deleteProductSubmit);
    }

    const productAddSubmit=function(e){

        const productName=document.querySelector(UISelectors.productName).value;
        const productPrice=document.querySelector(UISelectors.productPrice).value;

        if(productName!==null && productPrice!==null){
            //add Product
            const newProduct=ProductController.addProduct(productName,productPrice);

            //add item to list
            UIController.addProduct(newProduct);

            //add product to local storage
            StorageCtrl.storeProduct(newProduct);

            //get total
            const total=ProductController.getTotal();
            
            //show total
            UICtrl.showTotal(total);
            //clear inputs
            UIController.clearInputs();
            
        }

        //sayfa yeniden yüklenmesin.
        e.preventDefault();
    }

    const productEditClick=function(e){

        if(e.target.classList.contains('edit-product')){

            //id ye ulaşıyoruz
            const id=e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get selected dproduct
            const product = ProductCtrl.getProductById(id);
            
            //set current product
            ProductCtrl.setCurrentProduct(product);

            UIController.celarWarnings();

            //addd product to UI
            UICtrl.addProductToForm();

            //edit state : butonları kaldır,getir,arka plan değiştir..
            UICtrl.editState(e.target.parentNode.parentNode); //tr ye ulaşıp parametre oalrak gönderiyoruz
        }

        e.preventDefault();
    }

    const editProductSubmit=function(e){

        const productName=document.querySelector(UISelectors.productName).value;
        const productPrice=document.querySelector(UISelectors.productPrice).value;

        if(productName!=='' && productPrice!==''){

            //update product
            const updatedProduct=ProductCtrl.updateProdcut(productName,productPrice);

            //update ui
            let item=UICtrl.updateProductToForm(updatedProduct);

            //get total
            const total=ProductController.getTotal();
            
            //show total
            UICtrl.showTotal(total);

            //update storage
            StorageCtrl.updateProduct(updatedProduct);

            UICtrl.addingState();

        }

        e.preventDefault();
    }

    const cancelUpdate=function(e){

        
        UIController.addingState();
        UIController.celarWarnings();


        e.preventDefault();
    }

    const deleteProductSubmit=function(e){

        //get selected product
        const selectedProduct=ProductController.getCurrrentProduct();

        //delete product
        ProductController.deleteProduct(selectedProduct);

        //delete ui 
        UIController.deleteProductToForm();

        //get total
        const total=ProductController.getTotal();
            
        //show total
        UICtrl.showTotal(total);

        //delete from storages
        StorageCtrl.deleteProduct(selectedProduct.id);


        UICtrl.addingState();

        if(total==0){
            UIController.hideCard();
        }

        e.preventDefault();
    }

    return{
        init:function(){
            console.log("Starting App...");
            UICtrl.addingState();
            const products=ProductController.getProducts();

            if(products.length==0){
                UIController.hideCard();
            }else{
                UICtrl.createProductList(products);
            }
                   
            //Load Event Listeners
            loadEventListeners();
        }
    }

})(ProductController,UIController,StorageController);

//Uygulaam Başlasın
App.init();