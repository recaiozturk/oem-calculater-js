//Storage Controller
const StorageController=(function(){

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
        products:[],

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

        addingState:function(){
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display='inline';
            document.querySelector(Selectors.updateButton).style.display='none';
            document.querySelector(Selectors.deleteButton).style.display='none';
            document.querySelector(Selectors.cancelButton).style.display='none';
        },

        editState:function(tr){

            //arkaplanı olanları sil
            const parent=tr.parentNode;

            for(let i=0;i<parent.children.length;i++){
                parent.children[i].classList.remove('bg-warning');
            }

            //arka plan ekle
            tr.classList.add('bg-warning');

            document.querySelector(Selectors.addButton).style.display='none';
            document.querySelector(Selectors.updateButton).style.display='inline';
            document.querySelector(Selectors.deleteButton).style.display='inline';
            document.querySelector(Selectors.cancelButton).style.display='inline';

        }

    }

})();

//App Controller
const App=(function(ProductCtrl,UICtrl){

    const UISelectors=UIController.getSelectors();

    //Load Event Listeners
    const loadEventListeners=function(){

        //add product event
         document.querySelector(UISelectors.addButton).addEventListener('click',productAddSubmit);

         //edit product
         document.querySelector(UISelectors.productList).addEventListener('click',productEditSubmit);
        
    }

    const productAddSubmit=function(e){

        const productName=document.querySelector(UISelectors.productName).value;
        const productPrice=document.querySelector(UISelectors.productPrice).value;

        if(productName!==null && productPrice!==null){
            //add Product
            const newProduct=ProductController.addProduct(productName,productPrice);

            //add item to list
            UIController.addProduct(newProduct);

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

    const productEditSubmit=function(e){

        if(e.target.classList.contains('edit-product')){

            //id ye ulaşıyoruz
            const id=e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get selected dproduct
            const product = ProductCtrl.getProductById(id);
            
            //set current product
            ProductCtrl.setCurrentProduct(product);

            //addd product to UI
            UICtrl.addProductToForm();

            //edit state : butonları kaldır,getir,arka plan değiştir..
            UICtrl.editState(e.target.parentNode.parentNode); //tr ye ulaşıp parametre oalrak gönderiyoruz
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

})(ProductController,UIController);

//Uygulaam Başlasın
App.init();