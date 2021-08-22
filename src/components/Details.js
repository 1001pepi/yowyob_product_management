import '../styles/Common.css'
import '../styles/Details.css'
import '../styles/bigDisplay.css'
import '../styles/smallDisplay.css'

import image_not_found from '../assets/image_not_found.png'

import {useState} from 'react'
import React, {useEffect, Fragment} from 'react'

function Details({spaceName, setSpaceName, itemType, setItemType, item, setItem, data, setData, isASearchResult, setIsASearchResult, languagesList, displaySuccessAlert, setDisplaySuccessAlert, canDeleteItem, setUpdate, setItemToUpdate, updateFromDetails, setUpdateFromDetails, packagingsList, setPackagingsList, productsCategories,

categoriesRequestURL,

userName, passWord
}){
    //informations relatives à l'affichage en détails d'une catégorie
    var [category_parent, setCategory_parent] = useState({})
    var [category_descriptions, setCategory_descriptons] = useState([])
    var [list_of_subcategories, setList_of_subcategories] = useState([])
    const [list_of_products_in_a_category, setList_of_products_in_a_category] = useState([])
    const [products_illustrations, setProducts_illustrations] = useState(new Map())

    //informations relatives à l'affichage des détails d'un conditionnement
    const [packaged_products_at_purchase, setPackaged_products_at_purchase] = useState([])
    const [packaged_products_for_sale, setPackaged_products_for_sale] = useState([])
    const [packaged_products_at_purchase_illustrations, setPackaged_products_at_purchase_illustrations] = useState(new Map())
    const [packaged_products_for_sale_illustrations, setPackaged_products_for_sale_illustrations] = useState(new Map())

    //informations relatives à l'affichage des détails d'un produit
    const [productIllustrations, setProductIllustrations] = useState([])
    const [productDetails, setProductDetails] = useState({})
    const [productDescriptions, setProductDescriptions] = useState([])
    const [productConditionings, setProductConditionings] = useState([])
    const [productPurchaseConditionings, setProductPurchaseConditionings] = useState([])
    const [productSaleConditionings, setProductSaleConditionings] = useState([])
    const [conditioningsIllustrations, setConditioningsillustrations] = useState(new Map())

    //etat contenant le message à afficher dans l'alerte de confirmation
    const [confirmAlertMsg, setConfirmAlertMsg] = useState('')

    //état indiquant si ont doit charger les données de l'élément à afficher
    const [loadData, setLoadData] = useState(true)

    //état indiquant si on doit afficher les descriptions ou pas
    const [showDescriptions, setShowDescriptions] = useState(true)

    //état indiquant si on doit afficher la liste des sous catégories ou pas
    const [showSubCategories, setShowSubCategories] = useState(true)

    //état indiquant si on doit afficher la liste des produits d'une catégorie ou pas
    const [showProductsList, setShowProductsList] = useState(true)

    //état indiquant si on doit afficher la iste des produits conditionnés à l'achat pour un conditionnemnt
    const [showPackaged_products_at_purchase, setShowPackaged_products_at_purchase] = useState(true)

    //état indiquant si on doit afficher la iste des produits conditionnés à la vente pour un conditionnemnt
    const [showPackaged_products_for_sale, setShowPackaged_products_for_sale] = useState(true)

    //état indiquant si on doit afficher la liste des détails d'un produit
    const [showProductDetails, setShowwProductDetails] = useState(true)

    //état indiquant si on doit afficher la liste des conditionnemnts d'achat d'un produit
    const [showPurchaseConditionings, setShowPurchaseConditionings] = useState(true)

    //état indiquant si on doit afficher la liste des conditionnemnts de vente d'un produit
    const [showSaleConditionings, setShowSaleConditionings] = useState(true)

    //état contenant la liste des éléments visités
    const [visitedItems, setVisitedItems] = useState([])

    //état indiquant la réussite d'une suppression
    const [displaySuccessfulDeleteAlert, setDisplaySuccessfulDeleteAlert] = useState(false)

    //état contenant le message à afficher dans l'alerte de succès de suppression
    const [SuccessfulDeleteAlertMsg, setSuccessfulDeleteAlertMsg] = useState('')

    //définition du titre de l'espace de travail
    let titleType

    //fonction d'encodage des paramètres de connexion à l'API//
    function authenticateUser(user, password){
        var token = user + ":" + password;

        // Should i be encoding this value????? does it matter???
        // Base64 Encoding -> btoa
        var hash = btoa(token); 

        return "Basic " + hash;
    }

    //fonction pour réinitialiser les variables d'état des détails
    function resetData(){
        setCategory_parent({})
        setCategory_descriptons([])
        setList_of_subcategories([])
        setList_of_products_in_a_category([])
        setProducts_illustrations(new Map())

        setPackaged_products_at_purchase([])
        setPackaged_products_for_sale([])
        setPackaged_products_at_purchase_illustrations(new Map())
        setPackaged_products_for_sale_illustrations(new Map())

        setProductIllustrations([])
        setProductDetails({})
        setProductDescriptions([])
        setProductConditionings([])
        setProductPurchaseConditionings([])
        setProductSaleConditionings([])
        setConditioningsillustrations(new Map())

        setLoadData(true)
    }

    switch(itemType){
        case 'categories':
            titleType = "Catégorie " + item['name']
            break;

        case 'conditionings':
            titleType = "Conditionnement " + item['name']
            break;
        
        case 'products':
            titleType = "Produit " + item['name']
            break;

    }

    useEffect(() => {
        setUpdateFromDetails(true)
    }, [])

    //fonction permettant de supprimer un élément//
    function deleteItem(){
        
        //création de la requête
        var requestURL = item['url']

        var request = new XMLHttpRequest();
        
        request.open('DELETE', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            const requestStatus = request.status

            if(requestStatus === 204){
                //succès de la suppression
                //on supprime l'élément de la liste des data*/
                const deletedItemIndex = data.findIndex(tmpItem => tmpItem['id'] === item['id']);

                if(deletedItemIndex > -1){
                    
                    //on retire l'élément supprimé de la liste
                    const itemsList = data.filter(function(value, index, arr){
                        return index != deletedItemIndex
                    })

                    //on affiche le message de réussite de la suppression
                    switch(itemType){
                        case "categories":
                            setSuccessfulDeleteAlertMsg("Catégorie supprimée")
                            setDisplaySuccessfulDeleteAlert(true)
                            break;

                        case "conditionings":
                            setSuccessfulDeleteAlertMsg("Conditionnement supprimé")
                            setDisplaySuccessfulDeleteAlert(true)
                            break;
                    }
                    
                    setData(itemsList)

                    //on affiche l'élément suivant de la liste des datas
                    resetData()
                    setItem(itemsList[(deletedItemIndex + 1) % itemsList.length])
                }
            }
        }

    }

    //fonction permettant de charger les illustrations d'une liste de produits
    function loadproductsIllustrations(productsList, index){
        if(index < productsList.length){
            //chargement des illustrations du produit
            var product = productsList[index]

            var requestURL = product["product_illustration_list"]
    
            var request = new XMLHttpRequest();
            request.open('GET', requestURL);
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
            request.responseType = 'json';
            request.send();

            request.onload = function(){
               
                if(request.status === 200){
                    if(request.response.length > 0){
                        products_illustrations.set(product['id'], request.response[0]['illustration'])

                        var tmpMap = new Map(products_illustrations)

                        setProducts_illustrations(tmpMap)
                    }

                    //chargement de l'illustration du produit suivant
                    loadproductsIllustrations(productsList, index + 1)
                }
            }
        }
    }

    //fonction pour afficher l'élément reçu
    function displayItem(item){
        switch(itemType){
            case 'categories':
                if(loadData){
                    setLoadData(false)
                   
                    //on récupère la catégorie parent de l'élément
                    //création de la requête
                    var requestURL = categoriesRequestURL + item['category_parent'] + "/"
                    var request = new XMLHttpRequest();
                    
                    request.open('GET', requestURL);
                    request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                    request.responseType = 'json';
                    request.send();

                    request.onload = function(){
                        if(request.status === 200){
                            //requête réussie
                            setCategory_parent(request.response)

                            //on récupère la lste des descriptions de l'élément
                            requestURL = item['list_of_category_descriptions']
                            var request2 = new XMLHttpRequest();
                            request2.open('GET', requestURL);
                            request2.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                            request2.responseType = 'json';
                            request2.send();

                            request2.onload = function(){
                                if(request2.status === 200){
                                    //la requête a réussi
                                    
                                    setCategory_descriptons(request2.response)

                                    //chargement de la liste des sous catégories
                                    requestURL = item["list_of_subcategories"]
                                    
                                    var request3 = new XMLHttpRequest();
                                    request3.open('GET', requestURL);
                                    request3.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                                    request3.responseType = 'json';
                                    request3.send();

                                    request3.onload = function(){
                                        if(request3.status === 200){
                                            //la requête a réussi
                                            setList_of_subcategories(request3.response)

                                            //chargement de la liste des produits de la catégorie
                                            requestURL = item["list_of_products_in_a_category"]
                                    
                                            var request4 = new XMLHttpRequest();
                                            request4.open('GET', requestURL);
                                            request4.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                                            request4.responseType = 'json';
                                            request4.send();
        
                                            request4.onload = function(){
                                                var response4 = request4.response

                                                if(request4.status === 200){
                                                    //la requête a réussi
                                                    setList_of_products_in_a_category(request4.response)

                                                    //chargement des différentes illustrations du produit
                                                    loadproductsIllustrations(request4.response, 0)
                                                }
                                            }
                                        }
                                    }      
                                }
                            }
                        }
                    }
                }

                return(
                    <div className="container overflow-auto details-small-screen" style={{marginTop: "10px", height:"80vh"}}>
                        <div className="row d-flex justify-content-center">
                            <center className="col-12 display-on-small-screens-portrait">
                                    <img className="illustration-image" src={item['image'] ? item['image'] : image_not_found} alt="image" style={{width:"60vw"}}></img>
                            </center>
                            <div className="col-4 not-display-on-small-screens-portrait">
                                <img className="illustration-image" src={item['image'] ? item['image'] : image_not_found} alt="image" style={{height:"30vh"}}></img>
                            </div>

                            <div className="col-6 not-display-on-small-screens-portrait">
                                <div className="row">
                                    <span className="bold">Nom:&nbsp; </span> {item['name']}
                                </div>
                                <div className="row">
                                    <span className="bold">Code:&nbsp; </span> {item['code']}
                                </div>
                                <div className="row">
                                    <span className="bold">Catégorie parent:&nbsp; </span>{category_parent['name']}
                                </div>
                                <div className="row">
                                    <span className="bold">Date de création:&nbsp; </span>  {item['created_at']}
                                </div>
                                <div className="row">
                                    <span className="bold">Dernière modification:&nbsp; </span>  {item['update_at']}
                                </div>
                            </div>

                            <div className="col-10 display-on-small-screens-portrait">
                                <div className="row">
                                    <span className="bold">Nom:&nbsp; </span> {item['name']}
                                </div>
                                <div className="row">
                                    <span className="bold">Code:&nbsp; </span> {item['code']}
                                </div>
                                <div className="row">
                                    <span className="bold">Catégorie parent:&nbsp; </span>{category_parent['name']}
                                </div>
                                <div className="row">
                                    <span className="bold">Date de création:&nbsp; </span>  {item['created_at']}
                                </div>
                                <div className="row">
                                    <span className="bold">Dernière modification:&nbsp; </span>  {item['update_at']}
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <div className="row">
                                <h6 className="col-9" style={{color:"#351FBC", fontWeight:"bolder"}}>Descriptions</h6>
                                <div className="col-3 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showDescriptions ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowDescriptions(!showDescriptions)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showDescriptions && <div className="d-flex flex-wrap">
                                    {
                                        category_descriptions.map((description) => (
                                            <div className="card col-12 col-md-3" key={description['id']} style={{marginRight:"4vw", marginBottom:"15px", paddingLeft:"25px"}}>
                                                <div className="row">
                                                    <span className="bold">Description:&nbsp; </span> {description['description']}
                                                </div><br/>
                                                <div className="row">
                                                    <span className="bold">Specification:&nbsp; </span> {description['specification']}
                                                </div><br></br>
                                                <div className="row">
                                                    <span className="bold">Langue:&nbsp; </span> {languagesList[languagesList.findIndex(item => item['id'] === description['language'])]['name']}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        <div className="section">
                            <div className="row">
                                <h6 className="col-9" style={{color:"#351FBC", fontWeight:"bolder"}}>Sous catégories</h6>
                                <div className="col-3 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showSubCategories ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowSubCategories(!showSubCategories)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showSubCategories && <div className="d-flex flex-wrap card-section-small-screens-portrait">
                                    {
                                        list_of_subcategories.map((category) => (
                                            <div className="card cardLink card-display" key={category['id']} onClick={() =>{
                                                setVisitedItems([...visitedItems, {
                                                    item: item,
                                                    type: itemType
                                                }])

                                                resetData()
                                                setItem(category)
                                            
                                            }}>
                                                
                                                <img className="card-img-top card-image" src={category['image'] ? category['image'] : image_not_found}  alt="image"/>
                                                <div className="card-body">
                                                    <span className="bold card-text-small-screens">{category['name']}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        <div className="section">
                            <div className="row">
                                <h6 className="col-9" style={{color:"#351FBC", fontWeight:"bolder"}}>Liste des produits</h6>
                                <div className="col-3 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showProductsList ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowProductsList(!showProductsList)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showProductsList && <div className="d-flex flex-wrap card-section-small-screens-portrait">
                                    {
                                        list_of_products_in_a_category.map((product) => (
                                            <div className="card cardLink card-display" key={product['id']} onClick={() =>{
                                                setVisitedItems([...visitedItems, {
                                                    item: item,
                                                    type: itemType
                                                }])

                                                resetData()
                                                setItemType("products")
                                                setItem(product)
                                            
                                            }}>
                                                
                                                <img className="card-img-top card-image" id={"img_" + product['id']} src={products_illustrations.get(product['id']) ? products_illustrations.get(product['id']) : image_not_found} alt="image"/>
                                                <div className="card-body">
                                                    <span className="bold card-text-small-screens">{product['name']}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    
                );
                break;
            
            case 'conditionings':
                if(loadData){
                    setLoadData(false)

                    //chargement de la liste des produits conditionnés à l'achat
                    //création de la requête
                    var requestURL = item['packaged_products_at_purchase']
                    var request = new XMLHttpRequest();
                
                    request.open('GET', requestURL);
                    request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                    request.responseType = 'json';
                    request.send();

                    request.onload = function(){
                        if(request.status === 200){
                            //la requête a réussi
                            var response = request.response

                            setPackaged_products_at_purchase(response)

                            //chargement des illustrations du produit
                            for(let i = 0; i < response.length; i++){

                                var product = response[i]

                                //recherche du packaging du prduit
                                const packagingIndex = packagingsList.findIndex(packaging => (packaging['product'] === product['id'] && packaging['conditioning'] === item['id'] && packaging['type_packaging'] === "PURCHASE"))

                                if(packagingIndex >= 0){
                                    //le packaging a été trouvé
                                    const packaging = packagingsList[packagingIndex]

                                    packaged_products_at_purchase_illustrations.set(product['id'], packaging['picture'])

                                    const tmpMap = new Map(packaged_products_at_purchase_illustrations)

                                    setPackaged_products_at_purchase_illustrations(tmpMap)
                                }
                            }

                            //chargement de la liste des produits conditionnés à la vente
                            requestURL = item['packaged_products_for_sale']

                            var request2 = new XMLHttpRequest();
                
                            request2.open('GET', requestURL);
                            request2.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                            request2.responseType = 'json';
                            request2.send();

                            request2.onload = function(){
                                if(request2.status === 200){
                                    //la requête a réussi
                                    var response2 = request2.response

                                    setPackaged_products_for_sale(response2)

                                    //chargement des illustrations du produit
                                    for(let i = 0; i < response2.length; i++){
                                        
                                        var product = response2[i]

                                        //recherche du packaging du prduit
                                        const packagingIndex = packagingsList.findIndex(packaging => (packaging['product'] === product['id'] && packaging['conditioning'] === item['id'] && packaging['type_packaging'] === "SALE"))

                                       

                                        if(packagingIndex >= 0){
                                            //le packaging a été trouvé
                                            const packaging = packagingsList[packagingIndex]
                                            console.log(packaging['picture'])

                                            packaged_products_for_sale_illustrations.set(product['id'], packaging['picture'])

                                            const tmpMap = new Map(packaged_products_for_sale_illustrations)
                                            setPackaged_products_for_sale_illustrations(tmpMap)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                return(
                    <div className="container overflow-auto details-small-screen" style={{marginTop: "10px", height:"80vh"}}>
                        <div style={{marginLeft:"40px"}}>
                            <div className="row">
                                <span className="bold">Nom :&nbsp; </span> {item['name']}
                            </div>
                            <div className="row">
                                <span className="bold">Description:&nbsp; </span> {item['description']}
                            </div>
                            <div className="row">
                                <span className="bold">Quantité:&nbsp; </span> {item['quantity']}
                            </div>
                            <div className="row">
                                <span className="bold">Date de création:&nbsp; </span>  {item['created_at']}
                            </div>
                            <div className="row">
                                <span className="bold">Dernière modification:&nbsp; </span>  {item['update_at']}
                            </div>
                        </div>
                        <div className="section">
                            <div className="row">
                                <h6 className="col-9" style={{color:"#351FBC", fontWeight:"bolder"}}>Produits conditionnés à l'achat</h6>
                                <div className="col-3 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showPackaged_products_at_purchase ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowPackaged_products_at_purchase(!showPackaged_products_at_purchase)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showPackaged_products_at_purchase && <div className="d-flex flex-wrap card-section-small-screens-portrait">
                                    {
                                        packaged_products_at_purchase.map((product) => (
                                            <div className="card cardLink card-display" key={product['id']} onClick={() =>{
                                                setVisitedItems([...visitedItems, {
                                                    item: item,
                                                    type: itemType
                                                }])

                                                resetData()
                                                setItemType("products")
                                                setItem(product)
                                               
                                            }}>
                                                
                                                <img className={"card-img-top card-image" + "img_" + product['id']} src={packaged_products_at_purchase_illustrations.get(product['id'])} alt="image"/>
                                                <div className="card-body">
                                                    <span className="bold card-text-small-screens">{product['name']}</span>
                                                </div>
                                               
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        <div className="section">
                            <div className="row">
                                <h6 className="col-9" style={{color:"#351FBC", fontWeight:"bolder"}}>Produits conditionnés à la vente</h6>
                                <div className="col-3 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showPackaged_products_for_sale ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowPackaged_products_for_sale(!showPackaged_products_for_sale)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showPackaged_products_for_sale && <div className="d-flex flex-wrap card-section-small-screens-portrait">
                                    {
                                        packaged_products_for_sale.map((product) => (
                                            <div className="card cardLink card-display" key={product['id']} onClick={() =>{
                                                setVisitedItems([...visitedItems, {
                                                    item: item,
                                                    type: itemType
                                                }])

                                                resetData()
                                                setItemType("products")
                                                setItem(product)
                                               
                                            }}>
                                                
                                                <img className={"card-img-top card-image" + "img_" + product['id']} src={packaged_products_for_sale_illustrations.get(product['id'])} alt="image"/>
                                                <div className="card-body">
                                                    <span className="bold card-text-small-screens">{product['name']}</span>
                                                </div>
                                               
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>      
                    </div>
                );
                break;

            case "products":
                if(loadData){
                    setLoadData(false)

                    //récupération de la liste des illustrations du produit
                    var requestURL = item["product_illustration_list"]
            
                    var request = new XMLHttpRequest();
                    request.open('GET', requestURL);
                    request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                    request.responseType = 'json';
                    request.send();

                    request.onload = function(){
                    
                        if(request.status === 200){
                        
                            setProductIllustrations(request.response)
                            
                            //chargment des détails du produit
                            requestURL = item['product_detail']
                            var request2 = new XMLHttpRequest();
                            request2.open('GET', requestURL);
                            request2.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                            request2.responseType = 'json';

                            request2.send();

                            request2.onload = function(){
                                var response2 = request2.response
                                const requestStatus2 = request2.status
                                
                                if(requestStatus2 === 200){
                                    //la requête a réussi
                                    //on enregistre les détails
                                    setProductDetails(response2)

                                    //chargement de la liste des descriptions du produit
                                    requestURL = item['product_description_list']
                                    var request3 = new XMLHttpRequest();
                                    request3.open('GET', requestURL);
                                    request3.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                                    request3.responseType = 'json';

                                    request3.send();

                                    request3.onload = function(){
                                        var response3 = request3.response
                                        const requestStatus3 = request3.status
                                        
                                        if(requestStatus3 === 200){
                                            //la requête a réussi
                                            //on enregistre les détails
                                            setProductDescriptions(response3)

                                            //chargement des conditionnements du produit
                                            requestURL = item['conditionnings_list']
                                            var request4 = new XMLHttpRequest();
                                            request4.open('GET', requestURL);
                                            request4.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                                            request4.responseType = 'json';
        
                                            request4.send();
        
                                            request4.onload = function(){
                                                var response4 = request4.response
                                                const requestStatus4 = request4.status
                                                
                                                if(requestStatus4 === 200){
                                                    //la requête a réussi
                                                    //on enregistre les conditionnements
                                                    setProductConditionings(response4)

                                                    const tmpPurchaseConditionings = []
                                                    const tmpSaleConditionings = []
                                                    const tmpConditioningsIllustrations = new Map(conditioningsIllustrations)

                                                    for(let i = 0; i < response4.length; i++){
                                                        const conditioning = response4[i]

                                                        if(response4.findIndex(item => item['id'] === conditioning['id']) === i){
                                                            
                                                            //vérification s'il s'agit d'un conditionnemt d'achat
                                                            var packagingIndex = packagingsList.findIndex(packaging => packaging['product'] === item['id'] && packaging['conditioning'] === conditioning['id'] && packaging['type_packaging'] === "PURCHASE")

                                                            if(packagingIndex >= 0){
                                                                const packaging = packagingsList[packagingIndex]

                                                                tmpPurchaseConditionings.push(conditioning)

                                                                tmpConditioningsIllustrations.set(conditioning['id'], packaging['picture'])
                                                            }

                                                            //vérification s'il s'agit d'un conditionnement de vente
                                                            packagingIndex = packagingsList.findIndex(packaging => packaging['product'] === item['id'] && packaging['conditioning'] === conditioning['id'] && packaging['type_packaging'] === "SALE")

                                                            if(packagingIndex >= 0){
                                                                const packaging = packagingsList[packagingIndex]

                                                                tmpSaleConditionings.push(conditioning)

                                                                tmpConditioningsIllustrations.set(conditioning['id'], packaging['picture'])
                                                            }
                                                        }
                                                    }

                                                    setConditioningsillustrations(tmpConditioningsIllustrations)
                                                    setProductPurchaseConditionings(tmpPurchaseConditionings)
                                                    setProductSaleConditionings(tmpSaleConditionings)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } 

                return(
                    <div className="container overflow-auto details-small-screen" style={{marginTop: "10px", height:"80vh"}}>
                        <div className="row d-flex justify-content-center">
                            {
                                productIllustrations.length ?
                                <Fragment>
                                    <div id="illustrations-small-screens-portrait" className="col-10 illustration-image carousel slide display-on-small-screens-portrait div-illustration-product-details" data-ride="carousel" data-interval="2500">
                                        <ol className="carousel-indicators">
                                            {
                                                productIllustrations.map((illustration, index) => (
                                                <li data-target="#illustrations-small-screens-portrait" key={index} data-slide-to={index} className={!index ? "active" : ""}></li>))
                                            }
                                        </ol>
                                        <div className="carousel-inner">
                                            {
                                                productIllustrations.map((illustration, index) => (
                                                    <div className={"carousel-item " + (!index ? "active" : "")} key={illustration['id']}> 
                                                        <img className="d-block img-illustration-product-details" src={illustration['illustration']} alt="illustration"/>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <a class="carousel-control-prev" href="#illustrations-small-screens-portrait" role="button" data-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Previous</span>
                                        </a>
                                        <a class="carousel-control-next" href="#illustrations-small-screens-portrait" role="button" data-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Next</span>
                                        </a>
                                    </div>

                                    <div id="illustrations" className="col-4 illustration-image carousel slide not-display-on-small-screens-portrait div-illustration-product-details" data-ride="carousel" data-interval="2500" style={{marginRight:"50px"}}>
                                        <ol className="carousel-indicators">
                                            {
                                                productIllustrations.map((illustration, index) => (
                                                <li data-target="#illustrations" key={index} data-slide-to={index} className={!index ? "active" : ""}></li>))
                                            }
                                        </ol>
                                        <div className="carousel-inner">
                                            {
                                                productIllustrations.map((illustration, index) => (
                                                    <div className={"carousel-item " + (!index ? "active" : "")} key={illustration['id']}> 
                                                        <img className="d-block img-illustration-product-details" src={illustration['illustration']} alt="illustration"/>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <a class="carousel-control-prev" href="#illustrations" role="button" data-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Previous</span>
                                        </a>
                                        <a class="carousel-control-next" href="#illustrations" role="button" data-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="sr-only">Next</span>
                                        </a>
                                    </div>
                                </Fragment> :

                                <div className="col-4">
                                    <img className="illustration-image" src={image_not_found} alt="image" style={{height:"30vh"}}/>
                                </div>
                            }

                            <Fragment>
                                <div className="col-10 display-on-small-screens-portrait">
                                    <div className="row">
                                        <span className="bold">Nom:&nbsp; </span> {item['name']}
                                    </div>
                                    <div className="row">
                                        <span className="bold">Code:&nbsp; </span> {item['code']}
                                    </div>
                                    <div className="row">
                                        <span className="bold">Catégorie:&nbsp; </span>{productsCategories.get(item['id'])}
                                    </div>
                                    <div className="row">
                                        <span className="bold">Date de création:&nbsp; </span>  {item['created_at']}
                                    </div>
                                    <div className="row">
                                        <span className="bold">Dernière modification:&nbsp; </span>  {item['update_at']}
                                    </div>
                                </div>

                                <div className="col-6 not-display-on-small-screens-portrait">
                                    <div className="row">
                                        <span className="bold">Nom:&nbsp; </span> {item['name']}
                                    </div>
                                    <div className="row">
                                        <span className="bold">Code:&nbsp; </span> {item['code']}
                                    </div>
                                    <div className="row">
                                        <span className="bold">Catégorie:&nbsp; </span>{productsCategories.get(item['id'])}
                                    </div>
                                    <div className="row">
                                        <span className="bold">Date de création:&nbsp; </span>  {item['created_at']}
                                    </div>
                                    <div className="row">
                                        <span className="bold">Dernière modification:&nbsp; </span>  {item['update_at']}
                                    </div>
                                </div>
                            </Fragment>
                        </div>

                        <div className="section">
                            <div className="row">
                                <h6 className="col-9" style={{color:"#351FBC", fontWeight:"bolder"}}>Détails</h6>
                                <div className="col-3 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showPackaged_products_at_purchase ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowwProductDetails(!showProductDetails)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showProductDetails &&
                                <Fragment>
                                    <div className="display-on-small-screens-portrait" style={{marginLeft:"20px"}}>
                                        <div className="row">
                                            <span className="bold">Modèle:&nbsp;&nbsp; </span>{productDetails['model']}
                                        </div>
                                        <div className="row">
                                            <span className="bold">Marque:&nbsp;&nbsp; </span>{productDetails['mark']}
                                        </div>
                                        <div className="row">
                                            <span className="bold">Poids:&nbsp;&nbsp; </span>{productDetails['weight']}
                                        </div>
                                        <div className="row">
                                            <span className="bold">Conservation:&nbsp;&nbsp; </span>{productDetails['conservation']}
                                        </div>
                                        <div className="row">
                                            <span className="bold">Origine:&nbsp;&nbsp; </span>{productDetails['origin']}
                                        </div>
                                        <div className="row">
                                            <span className="bold">Composition:&nbsp;&nbsp; </span>{productDetails['composition']}
                                        </div>
                                    </div>

                                    <div className="not-display-on-small-screens-portrait"style={{marginLeft:"40px"}}>
                                        <div className="row">
                                            <span className="bold">Modèle:&nbsp;&nbsp; </span>{productDetails['model']}
                                        </div>
                                        <div className="row">
                                            <span className="bold">Marque:&nbsp;&nbsp; </span>{productDetails['mark']}
                                        </div>
                                        <div className="row">
                                            <span className="bold">Poids:&nbsp;&nbsp; </span>{productDetails['weight']}
                                        </div>
                                        <div className="row">
                                            <span className="bold">Conservation:&nbsp;&nbsp; </span>{productDetails['conservation']}
                                        </div>
                                        <div className="row">
                                            <span className="bold">Origine:&nbsp;&nbsp; </span>{productDetails['origin']}
                                        </div>
                                        <div className="row">
                                            <span className="bold">Composition:&nbsp;&nbsp; </span>{productDetails['composition']}
                                        </div>
                                    </div>
                                </Fragment>
                            }
                        </div>
                        
                        <div className="section">
                            <div className="row">
                                <h6 className="col-9" style={{color:"#351FBC", fontWeight:"bolder"}}>Descriptions</h6>
                                <div className="col-3 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showDescriptions ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowDescriptions(!showDescriptions)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showDescriptions && <div className="d-flex flex-wrap">
                                    {
                                        productDescriptions.map((description) => (
                                            <div className="card col-12 col-md-3" key={description['id']} style={{marginRight:"4vw", marginBottom:"15px", paddingLeft:"25px"}}>
                                                <div className="row">
                                                    <span className="bold">Description:&nbsp; </span> {description['description']}
                                                </div><br/>
                                                <div className="row">
                                                    <span className="bold">Specification:&nbsp; </span> {description['specification']}
                                                </div><br></br>
                                                <div className="row">
                                                    <span className="bold">Langue:&nbsp; </span> {languagesList[languagesList.findIndex(item => item['id'] === description['language'])]['name']}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>

                        <div className="section">
                            <div className="row">
                                <h6 className="col-9" style={{color:"#351FBC", fontWeight:"bolder"}}>Conditionnements d'achat</h6>
                                <div className="col-3 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showPackaged_products_at_purchase ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowPurchaseConditionings(!showPurchaseConditionings)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showPurchaseConditionings && <div className="d-flex flex-wrap card-section-small-screens-portrait">
                                    {
                                        productPurchaseConditionings.map((conditioning) => (
                                            <div className="card cardLink card-display" key={conditioning['id']} onClick={() =>{
                                                setVisitedItems([...visitedItems, {
                                                    item: item,
                                                    type: itemType
                                                }])

                                                resetData()
                                                setItemType("conditionings")
                                                setItem(conditioning)
                                               
                                            }}>
                                                
                                                <img className="card-img-top card-image" src={conditioningsIllustrations.get(conditioning['id'])} alt="image"/>
                                                <div className="card-body">
                                                    <span className="bold card-text-small-screens">{conditioning['name']}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>

                        <div className="section">
                            <div className="row">
                                <h6 className="col-9" style={{color:"#351FBC", fontWeight:"bolder"}}>Conditionnements de vente</h6>
                                <div className="col-3 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showPackaged_products_at_purchase ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowSaleConditionings(!showSaleConditionings)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showSaleConditionings && <div className="d-flex flex-wrap card-section-small-screens-portrait">
                                    {
                                        productSaleConditionings.map((conditioning) => (
                                            <div className="card cardLink card-display" key={conditioning['id']} onClick={() =>{
                                                setVisitedItems([...visitedItems, {
                                                    item: item,
                                                    type: itemType
                                                }])

                                                resetData()
                                                setItemType("conditionings")
                                                setItem(conditioning)
                                               
                                            }}>
                                                
                                                <img className="card-img-top card-image" src={conditioningsIllustrations.get(conditioning['id'])} alt="image"/>
                                                <div className="card-body">
                                                    <span className="bold card-text-small-screens">{conditioning['name']}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                    </div>
                )
                break;
        }
    }

    return(
        <div className="container">
             <div className="row headSection" style={{fontSize:"large"}}>
                {
                isASearchResult ? <h4>Résultats de la recherche</h4> :
                <h4 className="col-12 col-md-6 title-small-screens">{titleType}</h4>
                }
                        
                <div className="col-12 col-md-6 d-flex justify-content-end vertical-center hover-pointer">
                    <div className="col-7 d-flex justify-content-end vertical-center hover-pointer">
                        <a style={{color:"black", fontSize:"larger"}} onClick={() => {
                            if(visitedItems.length == 0){
                                //on est au premier élément visité. On retourne à la liste
                                setDisplaySuccessAlert(false)
                                switch(itemType){
                                    case "categories":
                                        setSpaceName('listCategories')
                                        break
                                    case "conditionings":
                                        setSpaceName("listConditionings")
                                        break
                                    case "products":
                                        setSpaceName("listProducts")
                                        break
                                }
                            }else{
                                //on a déjà visité plusieurs élément. On se positionne sur l'élément précédent
                                resetData()
                                const lastVisitedItem = visitedItems.pop()
                                setItemType(lastVisitedItem.type)
                                setItem(lastVisitedItem.item)
                            }
                        
                        }}
                        style={{marginRight:"30px"}}>
                            <span style={{color:"black", fontSize:"larger"}} className="fa fa-arrow-left"></span>
                        </a>

                        {
                                canDeleteItem.get(item['id']) ? 
                                <a id="delete" className="black-link" style={{color:"black", marginRight:"30px"}} 
                                    onClick={() =>{
                                    document.getElementById('delete').href="#confirm-delete-alert"
                                    setDisplaySuccessfulDeleteAlert(false)
                                    
                                    switch(itemType){
                                        case 'categories':
                                            setConfirmAlertMsg("Voulez-vous supprimer la catégorie " + item['name'] + " ?")
                                            break;

                                        case 'conditionings':
                                            setConfirmAlertMsg("Voulez-vous supprimer le conditionnement " + item['name'] + " ?")
                                            break;
                                    }
                                }
                                }>  
                                    <span className="material-icons md-48" title="supprimer">delete</span>
                                </a> : 
                                <span className="material-icons md-48" style={{color:"grey", marginRight:"30px"}}>delete</span>
                            }

                            <a className="black-link" style={{color:"black", marginRight:"30px"}}  onClick={(event) =>{
                                        resetData()
                                        setUpdate(true)
                                        setItemToUpdate(item)
                                        switch(itemType){
                                            case "categories":
                                                setSpaceName('createCategory')
                                                break
                                            case "conditionings":
                                                setSpaceName("createConditioning")
                                                break;
                                            case "products":
                                                setSpaceName("createProduct")
                                                break;
                                        }
                                        
                                        event.preventDefault()
                                    }}>
                                <span className="material-icons md-48 delete-icon"  style={{color:"black"}} title="éditer">edit</span>
                            </a>

                            <span className="fa fa-caret-up" title="précédent" style={{fontSize:"x-large", marginRight:"10px"}} onClick={() =>{
                                //on remplace l'élément affiché par l'élément précédent dans la liste des datas
                                const itemIndex = data.findIndex(tmpItem => tmpItem['id'] === item['id']);

                                resetData()
                                setItem(data[(itemIndex - 1 + data.length) % data.length])                        
                            }
                                
                            }></span>

                            <span className="fa fa-caret-down" title="suivant" style={{fontSize:"x-large", marginRight:"40px"}} onClick={() =>{
                                //on remplace l'élément affiché par l'élément suivant dans la liste des datas
                                const itemIndex = data.findIndex(tmpItem => tmpItem['id'] === item['id']);

                                resetData()
                                setItem(data[(itemIndex + 1) % data.length])                        
                            }
                                
                            }></span>
                    </div> 
                </div>
            </div>

            {
                displayItem(item)
            }

            { 
                <div id="confirm-delete-alert" className="overlay">
                    <div className="container confirm-delete-alert bold-center" style={{fontSize:"large"}}>
                        <div className="row">
                            {confirmAlertMsg}
                        </div>
                        <div className="row d-flex justify-content-around" style={{marginBottom:"5px"}}>
                            <div className="col-6" onClick={() => {
                                //on supprime l'élément
                                deleteItem()
                            }
                            }>
                            <a  href="#" >Oui</a>
                            </div>
                                
                            <a className="col-6" href="#">Annuler</a>
                        </div>
                    </div>
                </div> 
            }

            {
                displaySuccessfulDeleteAlert && <div className="animated fadeOutDown delay-2s slower success-alert "> 
                    <div className="text-center" style={{paddingBottom:"5px"}}>
                        <h2></h2>{SuccessfulDeleteAlertMsg}<h2></h2>
                    </div>
                </div>
            }
        </div>
    );
}

export default Details