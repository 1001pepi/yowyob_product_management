import '../styles/Form.css'
import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import ProductDescriptionForm from './ProductDescriptionForm'
import Product_detailDescriptionForm from './Product_detailDescriptionForm'
import Product_taxationDescriptionForm from './Product_taxationDescriptionForm'
import PrixDescriptionForm from './PrixDescriptionForm'
import Product_illustrationDescriptionForm from './Product_illustrationDescriptionForm'

function CreateProductForm({setSpaceName, setDisplaySuccessAlertProduct, 
    updateProductList, setUpdateProductList, 
    productList, setProductList})
{
    //liste des clés des descriptions  produits
    const [product_descriptionsKeys, setProduct_descriptionsKeys] = useState([])

    //nombre de descriptions supplémentaire en dehors de la description par défaut*/
    const [nbProduct_descriptions, setNbProduct_descriptions] = useState(0)

     //liste des clés des illustrations
     const [illustrationKeys, setillustrationKeys] = useState([])

     //nombre de illustrations supplémentaire en dehors de la description par défaut*/
     const [nbillustration, setNbillustration] = useState(0)    

    //liste des clés des prix
    const [prixKeys, setprixKeys] = useState([])

    //nombre de prix supplémentaire en dehors de la description par défaut*/
    const [nbprix, setNbprix] = useState(0)

    //liste des clés des taxes
    const [taxationKeys, settaxationKeys] = useState([])

    //nombre de taxes supplémentaire */
    const [nbtaxation, setNbtaxation] = useState(0)


    //liste des clés des details
    const [detailKeys, setdetailKeys] = useState([])
    //nombre de taxes supplémentaire */
    const [nbdetail, setNbdetail] = useState(0)


    //etat pour contrôler l'affichage du message d'alerte pour le bon remplissage du formulaire
    const [displayAlert, setDisplayAlert] = useState(false)

    const [a, seta] = useState(false)

    //etat contenant le message d'alerte à afficher pour le remplissage des formulaires
    const [alertMsg, setAlertMsg] = useState('')


     //paramètres de connexion à l'API
     var userName = "zang";
     var passWord = "harazangsuperuser";
 
     //fonction d'encodage des paramètres de connexion à l'API//
     function authenticateUser(user, password){
         var token = user + ":" + password;
 
         // Should i be encoding this value????? does it matter???
         // Base64 Encoding -> btoa
         var hash = btoa(token); 
 
         return "Basic " + hash;
     }

    function addDescription(event){
        setProduct_descriptionsKeys([...product_descriptionsKeys, {value:nbProduct_descriptions}]);
        
        setNbProduct_descriptions(nbProduct_descriptions + 1);

        event.preventDefault();
    }
    function addillustration(event){
        setillustrationKeys([...illustrationKeys, {value:nbillustration}]);
        
        setNbillustration(nbillustration + 1);

        event.preventDefault();
    }
    function addpricing(event){
        setprixKeys([...prixKeys, {value:nbprix}]);
        
        setNbprix(nbprix + 1);

        event.preventDefault();
    }
    function addtaxation(event){
        settaxationKeys([...taxationKeys,{value:nbtaxation}]);
        
        setNbtaxation(nbtaxation + 1);

        event.preventDefault();
    }
    function adddetail(event){
        setdetailKeys([...detailKeys, {value:nbdetail}]);
        
        setNbdetail(nbdetail + 1);

        event.preventDefault();
    }
    //fonction pour enregistrer la description du produit//
    function saveProductDescription(product_id){
        //récupération des valeurs du formulaire
        const description = document.querySelector('#description').value
        const specification = document.querySelector('#specification')

        //recuperation de toutes les langues
        var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/languages/';
        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
        request.responseType = 'json';
        var response=request.response
    
        //variable qui signale la présence d'une erreur dans le formulaire
        var error = false

         //variable qui signale la présence d'une erreur au niveau du serveur
         var server_error = false

        //variable indiquant si l'utilisateur est connecté à internet
        var connected = window.navigator.onLine

        if(!connected) {
            error = true
            setAlertMsg("Vous n'êtes pas connecté à internet!")
        }

        if(description === ""){
            error = true
            setAlertMsg("Veuillez renseigner la description du produit!")
        }

        if(specification === ""){
            error = true
            setAlertMsg("Veuillez renseigner la specification du produit!")
        }

        if(error){
            setDisplayAlert(true)

        }else{
            setDisplayAlert(false)

            //construction de l'objet à envoyer
            var formData = new FormData()

            formData.append("description", description)
            formData.append("specification", specification)
            formData.append("languages",response["name"])
            formData.append("product",product_id)
            //création de la requête
            var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/product_descriptions/';
            var request = new XMLHttpRequest();
            request.open('POST', requestURL);
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
            request.responseType = 'json';

            request.send(formData);

            request.onload = function(){
                var response = request.response;
                const requestStatus = request.status
                
                if(requestStatus === 500){
                    server_error = true
                    setAlertMsg("Erreur au niveau du serveur. Il est possible que ce nom soit déjà utilisé pour une autre catégorie.")

                }else if(requestStatus === 201){
                    //requête réussie
                    //on retourne sur la page affichant la liste des produits
                    setDisplaySuccessAlertProduct(true)
                    
                    console.log(response)

                }

                if(server_error){
                    setDisplayAlert(true)

                }else{
                    setDisplayAlert(false)
                }
            }

        }
        
    }
     //fonction pour enregistrer le prix du produit//
     function savePrixDescription(product_id){
        //récupération des valeurs du formulaire
        const average_purchase_price = document.querySelector('#average_purchase_price').value
        const average_sale_price = document.querySelector('#average_sale_price').value
        const cost_price = document.querySelector('#cost_price').value
        const unit_pricing = document.querySelector('#prix').value
        const percentage_half_wholesale_price = document.querySelector('#percentage_half_wholesale_price').value
        const percentage_expence = document.querySelector('#percentage_expense').value
        const percentage_margin = document.querySelector('#percentage_margin').value
        const percentage_brand_taxe = document.querySelector('#percentage_brand_taxe').value
        const half_wholesale_price = document.querySelector('#half_wholesale_price').value
        const percentage_half_big_price = document.querySelector('#percentage_half_big_price').value
        const percentage_wholesale_price = document.querySelector('#percentage_wholesale_price').value
        const total_accumulated_selling_price = document.querySelector('#total_accumulated_selling_price').value
        const total_unit_sales_price = document.querySelector('#total_unit_sales_price').value 
        const type_princing  = document.querySelector('#type_princing').value

        //variable qui signale la présence d'une erreur dans le formulaire
        var error = false

         //variable qui signale la présence d'une erreur au niveau du serveur
         var server_error = false

        //variable indiquant si l'utilisateur est connecté à internet
        var connected = window.navigator.onLine

        
        if(!connected) {
            error = true
            setAlertMsg("Vous n'êtes pas connecté à internet!")
        }


        if(!(average_sale_price === "" || average_purchase_price ==="" || cost_price ==="" || unit_pricing === "" (percentage_expence) ==="" || (percentage_margin)==="" || (percentage_brand_taxe)==="" || (half_wholesale_price)==="" || (half_wholesale_price)==="" ||(percentage_half_big_price)==="" || (percentage_wholesale_price)===""|| (total_accumulated_selling_price)==="" | (total_unit_sales_price)==="" || (type_princing)===""|| product_id==="")){
            error = false
            setAlertMsg("false")
             //construction de l'objet à envoyer
             var formData = new FormData()

             formData.append("average_purchase_price", average_purchase_price)
             formData.append("average_sale_price", average_sale_price)
             formData.append("cost_price", cost_price)
             formData.append("unit_price", unit_pricing)
             formData.append("percentage_half_wholesale_price", percentage_half_wholesale_price)
             formData.append("percentage_expence", percentage_expence)
             formData.append("percentage_margin", percentage_margin)
             formData.append("percentage_brand_taxe", percentage_brand_taxe)
             formData.append("half_wholesale_price", half_wholesale_price)
             formData.append("percentage_half_big_price", percentage_half_big_price)
             formData.append("percentage_wholesale_price", percentage_wholesale_price)
             formData.append("total_accumulated_selling_price", total_accumulated_selling_price)
             formData.append("total_unit_sales_price", total_unit_sales_price)
             formData.append("type_princing",type_princing)
             formData.append("product",product_id)
            
              //création de la requête
            var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/pricing/';
            var request = new XMLHttpRequest();
            request.open('POST', requestURL);
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
            request.responseType = 'json';

             request.send(formData);
             request.onload = function(){
                 var response = request.response;
                 const requestStatus = request.status
                  if(requestStatus === 201){
                     //requête réussie
                     //on retourne sur la page affichant la liste des produits
                     setDisplayAlert(true)
                     
                     console.log(response)
 
                 }
 
                 
             }
        }


        else{
            setDisplayAlert(true)
        }

       
           

    }
    //fonction pour enregistrer les details du produit//
    function saveDetail(product_id){
        //récupération des valeurs du formulaire
        const model = document.querySelector('#model').value
        const mark = document.querySelector('#mark').value
        const weight = document.querySelector('#weight').value
        const conservation = document.querySelector('#conservation').value
        const origin = document.querySelector('#origin').value
        const composition = document.querySelector('#composition').value
       
            //construction de l'objet à envoyer
            var formData = new FormData()
            formData.append("model", model)
            formData.append("mark", mark)
            formData.append("weight", weight)
            formData.append("conservation", conservation)
            formData.append("origin", origin)
            formData.append("composition", composition)
            formData.append("product", product_id)
            
 
            //création de la requête
            var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/product_details/';
            var request = new XMLHttpRequest();
            request.open('POST', requestURL);
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
            request.responseType = 'json';
 
            request.send(formData);
 
            request.onload = function(){
                var response = request.response;
                const requestStatus = request.status
                 if(requestStatus === 201){
                    //requête réussie
                    //on retourne sur la page affichant la liste des details du produits
                    setDisplayAlert(true)
                    
                    console.log(response)
 
                }
 
                
            }
 
        }
        function saveIllustration(product_id){
            //récupération des valeurs du formulaire
            const illustration = document.querySelector('#illustration').value
            const type_illustration = document.querySelector('#type_illustration').file[0]

            //variable qui signale la présence d'une erreur dans le formulaire
            var error = false
            //variable qui signale la présence d'une erreur au niveau du serveur
            var server_error = false
            //variable indiquant si l'utilisateur est connecté à internet
             var connected = window.navigator.onLine

            
            if(!connected){
                error = true
                setAlertMsg("Vous n'êtes pas connecté à internet!")
            }
    
            if(illustration === ""){
                error = true
                setAlertMsg("Veuillez renseigner le nom de l'illustration!")
            }
    
            if(type_illustration === ""){
                error = true
                setAlertMsg("Veuillez choisir une image pour illustrer le produit!")
            }
    
            if(error){
                setDisplayAlert(true)
    
            }else{
                setDisplayAlert(false)
    
                //construction de l'objet à envoyer
                var formData = new FormData()
     
                formData.append("illustration", illustration)
                formData.append("type_illustration", type_illustration)
                formData.append("product", product_id)
               
     
                //création de la requête
                var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/product_illustrations/';
                var request = new XMLHttpRequest();
                request.open('POST', requestURL);
                request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                request.responseType = 'json';
     
                request.send(formData);
     
                request.onload = function(){
                    var response = request.response;
                    const requestStatus = request.status
                     if(requestStatus === 201){
                        //requête réussie
                        //on retourne sur la page affichant la liste des illustration du produits
                        setDisplayAlert(true)
                        
                        console.log(response)
     
                    }
     
                    
                }
            }
     
            }
    /*fonction pour enregistrer le produit*/
    function saveProduct(event){
        //récupération des valeurs du formulaire
        const name = document.querySelector('#name').value
        
        //recuperation de toutes les langues
        var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/conditionings/';
        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
        request.responseType = 'json';
        var response = request.response
        //variable qui signale la présence d'une erreur dans le formulaire
        var error = false

         //variable qui signale la présence d'une erreur au niveau du serveur
         var server_error = false

        //variable indiquant si l'utilisateur est connecté à internet
        var connected = window.navigator.onLine

        if(!connected){
            error = true
            setAlertMsg("Vous n'êtes pas connecté à internet!")
        }

        if(name === ""){
            error = true
            setAlertMsg("Veuillez renseigner le nom du produit!")
        }

        if(error){
            setDisplayAlert(true)

        }else{
            setDisplayAlert(false)

            //construction de l'objet à envoyer
            var formData = new FormData()
            formData.append("name", name)
            formData.append("conditionnement_purchase", response["name"])
            formData.append("conditionnement_sale", response["name"])
            formData.append("update_code", "YES")
         
            
            //création de la requête
            var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/products/';
            var request = new XMLHttpRequest();
            request.open('POST', requestURL);
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
            request.responseType = 'json';

            request.send(formData);

            request.onload = function(){
                var response = request.response;

                const requestStatus = request.status
                
                if(requestStatus === 500){
                    server_error = true
                    setAlertMsg("Erreur au niveau du serveur. Il est possible que ce nom soit déjà utilisé pour un autre produit.")

                }else if(requestStatus === 201){
                    //requête réussie
                    savePrixDescription(response["id"])
                    saveIllustration(response["id"])
                    saveDetail(response["id"])
                    saveProductDescription(response["id"])
                    //on retourne sur la page affichant la liste des produits
                    setDisplayAlert(true)

                    //si la liste des produits a déjà été chargée, on ajoute juste le nouveau produi à la liste pour ne plus avoir à recherger toute la liste
                    
                    console.log(response)
                    
                    setSpaceName('listProduits')
                }

                if(server_error){
                    setDisplayAlert(true)

                }else{
                    setDisplayAlert(false)
                }
            }

        }
        
        event.preventDefault()
    }
   
        return(
            <div className="container">
                <div className="row headSection">
                    <h4>Créer un nouveau produit</h4> 
                </div>
    
                <div className="overflow-auto form-div" style={{height:"76vh"}}>
                    <form>
                        <div className="form-section">
                            <div className="form-group row">
                                <label for="name" className="col-3 col-form-label label">Nom</label>
                                <div className="col-4">
                                    <input type="text" className="form-control text-input" id="product_name" placeholder="nom du produit"></input>
                                </div>
                            </div>
                            
                            <div className="form-group row">
                                    <label for="conditionnement_achat" className="col-3 col-form-label label">Conditionnement d'achat</label>
                                    <div className="col-2">
                                        <select id="conditionnement_achat" className="form-control select-input">
                                            <option selected>--aucune--</option>
                                            <option>Conditionnement 2</option>
                                            <option>Conditionnement 3</option>
                                        </select>                            
                                    </div>
                            </div>
                    
                            <div className="form-group row">
                                    <label for="conditionnement_vente" className="col-3 col-form-label label">Conditionnement de vente</label>
                                    <div className="col-2">
                                        <select id="conditionnement_vente" className="form-control select-input">
                                            <option selected>--aucune--</option>
                                            <option>Conditionnement 2</option>
                                            <option>Conditionnement 3</option>
                                        </select>                            
                                    </div>
                            </div>
                           
                            <div className="form-group row">
                                    <label for="category" className="col-3 col-form-label label">Catégorie</label>
                                    <div className="col-2">
                                        <select id="category" className="form-control select-input">
                                            <option selected>--aucune--</option>
                                            <option>Categorie 2</option>
                                            <option>Categorie 3</option>
                                        </select>                            
                                    </div>
                            </div>
                        
                           
                        </div>
    
                        <div className="form-section" id="descriptions">
                            <h6>Descriptions</h6>
                            <hr></hr>
                            <label className="col-3 col-form-label label">Description par défaut</label>
                            <ProductDescriptionForm descriptionId={"defaultDescription"}/>
                            {
                              product_descriptionsKeys.map((product_descriptionKey) => (<ProductDescriptionForm 
                                key={"ProductDescriptionForm_" + product_descriptionKey.value}
                                product_descriptionId={product_descriptionKey.value}
                                product_descriptionsKeys={product_descriptionsKeys}
                                setProduct_descriptionsKeys={setProduct_descriptionsKeys}
                                nbProduct_descriptions={nbProduct_descriptions}
                                setNbProduct_descriptions={setNbProduct_descriptions}/>))
                            }
                            <div className="d-flex flex-row-reverse">
                                <button className="add-button" onClick={(event) => addDescription(event)}>
                                    <span className="fa fa-plus form-control-feedback font-weight-bold" > Ajouter une description</span>
                                </button>
                            </div>
                            
                        </div>
                        <div className="form-section" id="prix">
                            <h6>Prix</h6>
                            <hr></hr>
                            <PrixDescriptionForm prixId={"defaultpricing"}/>
                            {
                               prixKeys.map((prixKey) => (<PrixDescriptionForm 
                                key={"PrixDescriptionForm_" + prixKey.value}
                                prixId={prixKey.value}
                                prixKeys={prixKeys}
                                setprixKeys={setprixKeys}
                                nbprix={nbprix}
                                setNbprix={setNbprix}/>))
                            }
                            <div className="d-flex flex-row-reverse">
                                <button className="add-button" onClick={(event) => addpricing(event)}>
                                    <span className="fa fa-plus form-control-feedback font-weight-bold" > Ajouter un nouvel prix</span>
                                </button>
                            </div>
                            
                        </div>
                        <div className="form-section" id="taxation">
                            <h6>Taxe du produit</h6>
                            <hr></hr>
                            <Product_taxationDescriptionForm taxationId={"defaulttaxation"}/>
                            {
                              taxationKeys.map((taxationKey) => (<Product_taxationDescriptionForm 
                                key={"Product_taxationDescriptionForm_" + taxationKey.value}
                                taxationId={taxationKey.value}
                                taxationKeys={taxationKeys}
                                settaxationKeys={settaxationKeys}
                                nbtaxation={nbtaxation}
                                setNbtaxation={setNbtaxation}/>))
                            }
                            <div className="d-flex flex-row-reverse">
                                <button className="add-button" onClick={(event) => addtaxation(event)}>
                                    <span className="fa fa-plus form-control-feedback font-weight-bold" > Ajouter une nouvelle taxe</span>
                                </button>
                            </div>
                            
                        </div>
                        
                        <div className="form-section">
                            <h6>Product_details</h6>
                            <hr></hr>
                            <Product_detailDescriptionForm detailId={"defaultdetail"}/>
                            {
                              detailKeys.map((detailKey) => (<Product_detailDescriptionForm 
                                key={"Product_detailDescriptionForm_" + detailKey.value}
                                detailId={detailKey.value}
                                detailKeys={detailKeys}
                                setDetailKeys={setdetailKeys}
                                nbdetail={nbdetail}
                                setNbdetail={setNbdetail}/>))
                            }
                               <div className="d-flex flex-row-reverse">
                                    <button className="add-button" onClick={(event) => adddetail(event)}>
                                        <span className="fa fa-plus form-control-feedback font-weight-bold" > Ajouter un nouveau detail</span>
                                    </button>
                                </div>
                            
                        </div>
                        <div className="form-section">
                            <h6>Product_illustration</h6>
                            <hr></hr>
                            <Product_illustrationDescriptionForm illustrationId={"defaultillustration"}/>
                            {
                                illustrationKeys.map((illustrationKey) => (<Product_illustrationDescriptionForm 
                                key={"Product_illustrationDescriptionForm_" + illustrationKey.value}
                                illustrationId={illustrationKey.value}
                                illlustrationKeys={illustrationKeys}
                                setillustrationKeys={setillustrationKeys}
                                nbillustration={nbillustration}
                                setNbillustration={setNbillustration}/>))
                            }
                            <div className="d-flex flex-row-reverse">
                                    <button className="add-button" onClick={(event) => addillustration(event)}>
                                        <span className="fa fa-plus form-control-feedback font-weight-bold" > Ajouter un nouvelle illustration</span>
                                    </button>
                            </div>
                            
                        </div>
    
                        
                        <div className="d-flex justify-content-center">
                            <button className="save-button" type="submit" 
                                    onClick={(event) => saveProduct(event)}>
                                <span className="fa fa-save form-control-feedback font-weight-bold"></span>
                                <span> Enregistrer</span>
                            </button>
                        </div>
    
                        {
                            false && <div className="animated fadeOutDown delay-1s slow test success-alert "> 
                                <div className="text-center" style={{paddingBottom:"5px"}}>
                                    <h2></h2>produit enregistré<h2></h2>
                                </div>
                            </div>
                        }
                        
                    </form>
                   
                    
                    
                </div>
                
            </div> 
        );
        
        
    }

export default CreateProductForm