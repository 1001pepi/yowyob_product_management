import '../styles/Common.css'
import '../styles/Details.css'

import {useState} from 'react'
import React, {useEffect} from 'react'

function Details({spaceName, setSpaceName, itemType, setItemType, item, setItem, data, setData, isASearchResult, setIsASearchResult, languagesList, displaySuccessAlert, setDisplaySuccessAlert, canDeleteItem, setUpdate, setItemToUpdate, updateFromDetails, setUpdateFromDetails, packagingsList, setPackagingsList}){
    //categories request url
    var categoriesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/categories/'

    
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

    //état contenant la liste des éléments visités
    const [visitedItems, setVisitedItems] = useState([])

    //état indiquant la réussite d'une suppression
    const [displaySuccessfulDeleteAlert, setDisplaySuccessfulDeleteAlert] = useState(false)

    //état contenant le message à afficher dans l'alerte de succès de suppression
    const [SuccessfulDeleteAlertMsg, setSuccessfulDeleteAlertMsg] = useState('')

    //définition du titre de l'espace de travail
    let titleType
    
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

        setLoadData(true)
    }

    switch(itemType){
        case 'categories':
            titleType = "Catégorie " + item['name']
            break;

        case 'conditionings':
            titleType = "Conditionnement " + item['name']
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
                    products_illustrations.set(product['id'], request.response[0]['illustration'])

                    var tmpMap = new Map(products_illustrations)

                    setProducts_illustrations(tmpMap)

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
                    <div className="container overflow-auto" style={{marginTop: "10px", height:"80vh"}}>
                        <div className="row d-flex justify-content-center">
                            <div className="col-4">
                                <img className="illustration-image" src={item['image']} alt="image"></img>
                            </div>
                            <div className="col-6">
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
                                <h6>Descriptions</h6>
                                <div className="col-10 d-flex justify-content-end vertical-center hover-pointer">
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
                                            <div className="card col-3" key={description['id']} style={{marginRight:"4vw", marginBottom:"15px", paddingLeft:"25px"}}>
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
                                <h6>Sous catégories</h6>
                                <div className="col-10 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showSubCategories ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowSubCategories(!showSubCategories)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showSubCategories && <div className="d-flex flex-wrap">
                                    {
                                        list_of_subcategories.map((category) => (
                                            <div className="card col-3 cardLink" key={category['id']} style={{marginRight:"4vw", marginBottom:"15px"}} onClick={() =>{
                                                setVisitedItems([...visitedItems, {
                                                    item: item,
                                                    type: itemType
                                                }])

                                                resetData()
                                                setItem(category)
                                               
                                            }}>
                                                
                                                <img className="card-img-top" src={category['image']} alt="image"/>
                                                <div className="card-body">
                                                    <span className="bold">{category['name']}</span>
                                                </div>
                                               
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        <div className="section">
                            <div className="row">
                                <h6>Liste des produits</h6>
                                <div className="col-10 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showProductsList ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowProductsList(!showProductsList)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showProductsList && <div className="d-flex flex-wrap">
                                    {
                                        list_of_products_in_a_category.map((product) => (
                                            <div className="card cardLink" key={product['id']} style={{marginRight:"3vw", marginBottom:"15px", width:"14vw"}} onClick={() =>{
                                                setVisitedItems([...visitedItems, {
                                                    item: item,
                                                    type: itemType
                                                }])

                                                resetData()
                                                setItemType("products")
                                                setItem(product)
                                               
                                            }}>
                                                
                                                <img className="card-img-top" id={"img_" + product['id']} src={products_illustrations.get(product['id'])} alt="image" style={{height:"20vh"}}/>
                                                <div className="card-body">
                                                    <span className="bold">{product['name']}</span>
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
                    <div className="container overflow-auto" style={{marginTop: "10px", height:"80vh"}}>
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
                                <h6>Produits conditionnés à l'achat</h6>
                                <div className="col-8 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showPackaged_products_at_purchase ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowPackaged_products_at_purchase(!showPackaged_products_at_purchase)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showPackaged_products_at_purchase && <div className="d-flex flex-wrap">
                                    {
                                        packaged_products_at_purchase.map((product) => (
                                            <div className="card cardLink" key={product['id']} style={{marginRight:"3vw", marginBottom:"15px", width:"14vw"}} onClick={() =>{
                                                setVisitedItems([...visitedItems, {
                                                    item: item,
                                                    type: itemType
                                                }])

                                                resetData()
                                                setItemType("products")
                                                setItem(product)
                                               
                                            }}>
                                                
                                                <img className={"card-img-top " + "img_" + product['id']} src={packaged_products_at_purchase_illustrations.get(product['id'])} alt="image" style={{height:"20vh"}}/>
                                                <div className="card-body">
                                                    <span className="bold">{product['name']}</span>
                                                </div>
                                               
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        <div className="section">
                            <div className="row">
                                <h6>Produits conditionnés à la vente</h6>
                                <div className="col-8 d-flex justify-content-end vertical-center hover-pointer">
                                    <span style={{color:"black", fontSize:"larger"}} className={showPackaged_products_for_sale ?"fa fa-chevron-up" : "fa fa-chevron-down"} onClick={() => {
                                        setShowPackaged_products_for_sale(!showPackaged_products_for_sale)
                                    }}></span>
                                </div>
                            </div>
                            <hr></hr>
                            {
                                showPackaged_products_for_sale && <div className="d-flex flex-wrap">
                                    {
                                        packaged_products_for_sale.map((product) => (
                                            <div className="card cardLink" key={product['id']} style={{marginRight:"3vw", marginBottom:"15px", width:"14vw"}} onClick={() =>{
                                                setVisitedItems([...visitedItems, {
                                                    item: item,
                                                    type: itemType
                                                }])

                                                resetData()
                                                setItemType("products")
                                                setItem(product)
                                               
                                            }}>
                                                
                                                <img className={"card-img-top " + "img_" + product['id']} src={packaged_products_for_sale_illustrations.get(product['id'])} alt="image" style={{height:"20vh"}}/>
                                                <div className="card-body">
                                                    <span className="bold">{product['name']}</span>
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
        }
    }

    return(
        <div className="container">
             <div className="row headSection" style={{fontSize:"large"}}>
                {
                isASearchResult ? <h4 className="col-4">Résultats de la recherche</h4> :
                <h4 className="col-4">{titleType}</h4>
                }
                        
                <div className="col-8 d-flex justify-content-end vertical-center hover-pointer">
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