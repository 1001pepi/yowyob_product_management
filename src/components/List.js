import {useState} from 'react'
import React, {useEffect} from 'react'

import '../styles/Common.css'
import '../styles/List.css'
import '../styles/Form.css'
import '../styles/smallDisplay.css'
import '../styles/bigDisplay.css'

function List({ data, setData, 
    canDeleteCategory, setCanDeleteCategory, 
    canDeleteConditioning, setCanDeleteConditioning,
    canDeleteLanguage, setCanDeleteLanguage,
    productsCategories, setProductsCategories,
    displaySuccessAlert, 
    listType,
    spaceName, setSpaceName, 
    itemType, setItemType, 
    item, setItem,  
    update, setUpdate, 
    itemToUpdate, setItemToUpdate, updateFromDetails, setUpdateFromDetails,

    categoriesRequestURL, conditioningsRequestURL, languagesRequestURL, productsRequestURL,

    userName, passWord,

    packagingsList, setPackagingsList, packagingsRequestURL
}){

    //languages request url
    var taxesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/taxes/'
    
    //etat contenant le message à afficher dans l'alerte de confirmation
    const [confirmAlertMsg, setConfirmAlertMsg] = useState('')

    //etat contenant la liste des éléments cochés de la liste
    const [checkedItems, setCheckedItems] = useState([])

    //etat contenant l'ID de l'élément de la liste sélectionné pour une action
    const [selectedItemId, setSelectedItemId] = useState('')

    //état indiquant la réussite d'une suppression
    const [displaySuccessfulDeleteAlert, setDisplaySuccessfulDeleteAlert] = useState(false)

    //état contenant le message à afficher dans l'alerte de succès de suppression
    const [SuccessfulDeleteAlertMsg, setSuccessfulDeleteAlertMsg] = useState('')

    //état indiquant le critère de tri de la liste
    //1: tri suivant le nom
    //2: tri suivant la date de création
    const [sortCriterion, setSortCriterion] = useState(1)

    //état indiquant l'ordre de tri de la liste
    //1: tri dans l'ordre croisant
    //2: tri dans l'ordre décroissant
    const [sortOrder, setSortOrder] = useState(1)

    //définition du titre de la liste
    let listTitle

    //définition du titre du bouton d'ajout
    let addButtonTitle

    //définition du message de succès de création d'un nouvel élément
    let successfulCreatedMsg

    //fonction d'encodage des paramètres de connexion à l'API//
    function authenticateUser(user, password){
        var token = user + ":" + password;

        var hash = btoa(token); 

        return "Basic " + hash;
    }

    //instructions s'éxécutant après le rendu du composant
    useEffect(() =>{
        var selectSortCriterion = document.querySelector('#select-sort-criterion')
        selectSortCriterion.addEventListener('change', (event) => {
            setSortCriterion(event.target.value)
            console.log(event.target.value)
        })

        var selectSortOrder = document.querySelector('#select-sort-order')
        selectSortOrder.addEventListener('change', (event) => {
            setSortOrder(event.target.value)
            console.log(event.target.value)
        })

        //on indique que les updates ne viennent pas des détais
        setUpdateFromDetails(false)
        
    }, [])

   //fonction permettant de construire l'id du checkboxList d'un élément de la liste//
   function getCheckboxId(item){
        return 'checkbox_' + item['id']
    }

    //fonction permettant de construire l'id du bouton de suppression d'un élément//
    function getDeleteButtonId(item){
        return 'deleteButton_' + item['id']
    }

    //fonction permettant de construire l'id du bouton de mise à jour d'un élément//
    function getUpdateButtonId(item){
        return 'updateButton_' + item['id']
    }

    //fonction permettant de sélectionner tous les éléments de la liste
    function selectAll(){
        const checked = document.getElementById('selectAll').checked
        
        if(checked){
            const tmpList = []

            //on coche tous les checkboxs
            data.forEach(function(item){
                const htmlElement = document.getElementById(getCheckboxId(item))
                if(htmlElement != null){
                    htmlElement.checked = true
                    tmpList.push(item['id'])
                }
                
            })

        }else{
            //on vide la liste des éléments cochés
            setCheckedItems([])

            //on décoche tous les checkboxs
            data.forEach(function(item){
                const htmlElement = document.getElementById(getCheckboxId(item))
                if(htmlElement != null){
                    htmlElement.checked = false
                }
            })
        }
    }

    //fonction appelée lorqu'on clique sur un checkbox de la liste
    function handleCheckboxClick(event, itemId){
        var checked = event.target.checked;
        

        if(checked){
            //si le checkbox est coché on récupère l'id de l'élément correspondant et on le stocke dans la lste des éléments sélectionnés de la liste
            setCheckedItems([...checkedItems, itemId])
            
        }else{
            
            //on retire l'id de l'élément dans la liste des éléments cochés
            const tmpList = checkedItems.filter(function(el){
                return el != itemId
            })
            setCheckedItems(tmpList)
        }
    }

    //fonction pour supprimer la liste des catégories sélectionnées//
    function deleteItems(itemsList, checkedItemIndex){
        if(checkedItemIndex < checkedItems.length){
            const itemId = checkedItems[checkedItemIndex]

            //création de la requête
            var requestURL

            switch(listType){
                case 'categories':
                    requestURL = categoriesRequestURL + itemId + "/"
                    break;
                case 'conditionings':
                    requestURL = conditioningsRequestURL + itemId + "/"
                    break;
                case 'languages':
                    requestURL = languagesRequestURL + itemId + "/"
                    break;
                case 'products':
                        requestURL = productsRequestURL + itemId + "/"
                    break;
                case 'taxes':
                    requestURL = taxesRequestURL + itemId + "/"
                    break;       
            }

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
                    const deletedItemIndex = itemsList.findIndex(item => item['id'] === itemId);
                    
    
                    if(deletedItemIndex > -1){
                        
                        //on retire l'élément supprimé de la liste
                        itemsList = itemsList.filter(function(value, index, arr){
                            return index != deletedItemIndex
                        })
                        
                        setData(itemsList)
                        

                        deleteItems(itemsList, checkedItemIndex + 1)
                    }
                }
            }

        }else{
            
            //on vide la liste des éléments sélectionnés
            setCheckedItems([])

            //affichage du message de succès de la suppression
            setDisplaySuccessfulDeleteAlert(true)
        }
    }

    //fonction permettant de supprimer un élément ayant son id//
    function deleteItem(itemId){
        //création de la requête
        var requestURL

        switch(listType){
            case 'categories':
                requestURL = categoriesRequestURL + itemId + "/"
                break;
            case 'conditionings':
                requestURL = conditioningsRequestURL + itemId + "/"
                break;
            case 'languages':
                requestURL = languagesRequestURL + itemId + "/"
                break; 
        }

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
                const deletedItemIndex = data.findIndex(item => item['id'] === itemId);

                if(deletedItemIndex > -1){
                    
                    //on retire l'élément supprimé de la liste
                    const itemsList = data.filter(function(value, index, arr){
                        return index != deletedItemIndex
                    })
                    
                    setData(itemsList)
                }

                //on vide la liste des éléments sélectionnés
                setCheckedItems([])

                //affichage du message de succès de la suppression
                setDisplaySuccessfulDeleteAlert(true)
            }
        }
    }

    //fonction permettantt de récupérer la liste des catégories//
    function getCategories(requestURL, tmpList){
        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status

            if(requestStatus === 200){
                var next = response['next']
    
                tmpList = tmpList.concat(response['results'])

                //tri de la liste récupérée dans l'ordre croissant
                tmpList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

                //on vérifie si on peut supprimer les éléments récupérés
                response['results'].forEach((category) => checkCanDeleteCategory(category))
            
                setData(tmpList)

                if(next != null){
                    tmpList = getCategories(next, tmpList)
                }
            }
        } 
    }

    //fonction permettant de savoir si on peut supprimer une catégorie
    function checkCanDeleteCategory(category){
        //on commmence par vérifier le nombre de produits dans la catégorie
        //création de la requête
        const requestURL = category['list_of_products_in_a_category']

        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status

            if(requestStatus === 200){
                //la requête a réussi
                //nombre de produits dans la catégorie
                const nbProducts = response.length

                if(nbProducts > 0){
                    canDeleteCategory.set(category['id'], false)

                }else{
                    //on vérifie le nombre de sous catégories de la catégorie
                    //création de la requête
                    const requestURL2 = category['list_of_subcategories']

                    var request2 = new XMLHttpRequest();
                    
                    request2.open('GET', requestURL2);
                    request2.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                    request2.responseType = 'json';
                    request2.send();

                    request2.onload = function(){
                        var response2 = request2.response;
                        var requestStatus2 = request2.status

                        if(requestStatus2 === 200){
                            //la requête a réussi
                            //nombre de produits dans la catégorie
                            const nbSubCategories = response2.length

                            if(nbSubCategories > 0){
                                canDeleteCategory.set(category['id'], false)

                            }else{
                                
                                canDeleteCategory.set(category['id'], true)
                            }
                        }
                    }
                    
                }
            }
        }
    }

    //fonction permettantt de récupérer la liste des taxes//
    function getConditionings(requestURL, tmpList){
        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status
            
            if(requestStatus === 200){
                var next = response['next']
    
                tmpList = tmpList.concat(response['results'])

                //tri de la liste récupérée dans l'ordre croissant
                tmpList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

                //on vérifie si on peut supprimer les éléments récupérés
                response['results'].forEach((conditioning) => checkCanDeleteConditioning(conditioning))
                
                setData(tmpList)
                
                if(next != null){
                    tmpList = getConditionings(next, tmpList)
                }
            }
        }
    }

    //fonction permettant de savoir si on peut supprimer un conditiionnement
    function checkCanDeleteConditioning(conditioning){
        //on vérifie s'il existe des produits utilisant le conditionnement
        //création de la requête
        const requestURL = conditioning['packaged_products']

        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status

            if(requestStatus === 200){
                //la requête a réussi
                //nombre de produits utilisant le conditionnement
                const nbProducts = response.length

                if(nbProducts > 0){
                    canDeleteConditioning.set(conditioning['id'], false)

                }else{
                    canDeleteConditioning.set(conditioning['id'], true)
                }
            }
        }
    }

    //fonction permettant de récupérer la liste des langues disponibles//
    function getLanguages(requestURL, tmpList){
        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status

            if(requestStatus === 200){
                var next = response['next']
    
                tmpList = tmpList.concat(response['results'])

                //tri de la liste récupérée dans l'ordre croissant
                tmpList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

                //on vérifie si on peut supprimer les éléments récupérés
                response['results'].forEach((language) => checkCanDeleteLanguage(language))

                setData(tmpList)
                
                if(next != null){
                    tmpList = getLanguages(next, tmpList)
                }
            }
        }
    }

    //fonction permettant de savoir si on peut supprimer une langue
    function checkCanDeleteLanguage(language){
        //on commmence par vérifier le nombre de descriptions de produit utilsant la langue
        //création de la requête
        const requestURL = language['list_of_products_described_in_a_language']

        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status

            if(requestStatus === 200){
                //la requête a réussi
                //nombre de descriptions de produits utiliisatnt la langue
                const nbProductDescriptions = response.length

                if(nbProductDescriptions > 0){
                    canDeleteLanguage.set(language['id'], false)
                    

                }else{
                    //on vérifie le nombre de descriptions de catégorie utilisant la langue
                    //création de la requête
                    const requestURL2 = language['list_of_categories_described_in_a_language']

                    var request2 = new XMLHttpRequest();
                    
                    request2.open('GET', requestURL2);
                    request2.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                    request2.responseType = 'json';
                    request2.send();

                    request2.onload = function(){
                        var response2 = request2.response;
                        var requestStatus2 = request2.status

                        if(requestStatus2 === 200){
                            //la requête a réussi
                            //nombre de descriptions de catégorie utilisant la langue
                            const nbCategoryDescriptions = response2.length

                            if(nbCategoryDescriptions > 0){
                                canDeleteLanguage.set(language['id'], false)

                            }else{
                                
                                canDeleteLanguage.set(language['id'], true)
                            }
                        }
                    }
                    
                }
            }
        }
    }

    //fonction permettant de récupérer la liste des prodduits
    function getProducts(requestURL, tmpList){
        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status

            if(requestStatus === 200){
                var next = response['next']
    
                tmpList = tmpList.concat(response['results'])

                //tri de la liste récupérée dans l'ordre croissant
                tmpList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

                //enregistrement des catégories des produits
                tmpList.forEach((product) => getCategoryNameFromProduct(product))
                
                setData(tmpList)

                if(next != null){
                    tmpList = getProducts(next, tmpList)
                }
            }
        }   
    }

    //fonction permettant de récupérer le nom de la catégorie d'un produit
    function getCategoryNameFromProduct(product){
        //on envoie une requête à l'API pour récupérer la catégorie du produit
        //création de la requête
        const requestURL = categoriesRequestURL + product['category'] + "/"

        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status

            if(requestStatus === 200){
               //la requête a réussi
               productsCategories.set(product['id'], response['name'])
            }
        }
    }

    //fonction permettant de récupérer les packagings
    function getPackagings(requestURL, tmpList){
        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status

            if(requestStatus === 200){
                var next = response['next']
    
                tmpList = tmpList.concat(response['results'])

                setPackagingsList(tmpList)

                if(next != null){
                    tmpList = getPackagings(next, tmpList)
                }else{
                    console.log("packagings loaded")
                }
            }
        }
    }

    
    //fonction d'affichage de la liste des catégories//
    function displayCategoriesList(){
        return(
            <div>
                <div className="row">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr className="no-gutters not-display-on-small-screens">
                                    <th className="col-1 text bold" style={{paddingLeft:"15px"}}>
                                        <input type="checkbox" id="selectAll" title="tout sélectionner" value="1" onClick={selectAll}></input>
                                    </th>
                                    <th className="col-3 text bold">
                                        <span>Nom</span>
                                    </th>
                                    <th className="col-2 text bold">
                                        <span>Code</span>
                                    </th>
                                    <th className="col-3 text bold">
                                        <span>Date création</span>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Dernière modification</span>
                                    </th>
                                    <th className="col-1 text bold">
                                    </th>
                                </tr>
                            </thead>
                        </table>    
                    </div>
                </div>

                <div className="row overflow-auto form-div" style={{height:"60vh"}}>
                    <div class="table-responsive">
                        <table className="table list-small-screen">
                            <tbody>
                                {
                                    data.map((category) => (
                                        <tr className="list-item no-gutters" key={category['id']} id={category['id']} onMouseOver={()=>{
                                            //on affiche le bouton de suppression de l'élément survolé
                                            if(document.getElementById(getDeleteButtonId(category))){
                                                document.getElementById(getDeleteButtonId(category)).style.visibility = "visible"
                                            }

                                            if( document.getElementById(getUpdateButtonId(category))){
                                                document.getElementById(getUpdateButtonId(category)).style.visibility = "visible"
                                            }  
                                            
                                        }}
                                        onMouseOut={() =>{
                                            //on retire le bouton de suppression de l'élément survolé
                                            if( document.getElementById(getDeleteButtonId(category))){
                                                document.getElementById(getDeleteButtonId(category)).style.visibility = "hidden"
                                            }

                                            if( document.getElementById(getUpdateButtonId(category))){
                                                document.getElementById(getUpdateButtonId(category)).style.visibility = "hidden"
                                            }
                                            
                                        }}
                                        onClick={(event)=>{
                                            const parentTagName = event.target.parentElement.tagName

                                            if(parentTagName === "TR" || parentTagName === "TD"){
                                                setItem(category)
                                                setItemType(listType)
                                                setSpaceName('details')
                                            }
                                        
                                        }}>
                                            <td className="col-1 not-display-on-small-screens" style={{paddingLeft:"15px", paddingTop:"2px", paddingBottom:"2px"}}>
                                                <span>
                                                    {
                                                        canDeleteCategory.get(category['id']) ? <input type="checkbox" id={getCheckboxId(category)} onClick={(event)=>handleCheckboxClick(event, category['id'])}></input> : null
                                                    }
                                                </span>
                                            </td>
                                            <td className="col-md-3 text" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{category['name']}</span></td>
                                            <td className="col-2 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{category['code']}</span></td>
                                            <td className="col-3 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{category['created_at']}</span></td>
                                            <td className="col-2 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{category['update_at']}</span></td>

                                            <td className="col-1 vertical-center not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}>
                                                {
                                                    canDeleteCategory.get(category['id']) ? <a className="item-delete material-icons md-48 delete-icon" id={getDeleteButtonId(category)}  title="supprimer" onClick={(event) =>{

                                                        setDisplaySuccessfulDeleteAlert(false)
                                                        setSuccessfulDeleteAlertMsg("Catégoirie supprimée!")

                                                        //on vide la liste des checkbox sélectionnés
                                                        setCheckedItems([])

                                                        //affichage du popup de confirmation
                                                        document.getElementById(getDeleteButtonId(category)).href="#confirm-delete-alert"
                                                        setConfirmAlertMsg("Voulez-vous supprimer la catégorie " + category['name'] + " ?")
                                                    
                                                        setSelectedItemId(category['id'])
                                                    }} style={{marginRight:"10px"}}>
                                                        <span className="material-icons md-48 delete-icon">delete</span>
                                                    </a> : null
                                                }
                                                
                                                <a className="update-icon item-update" id={getUpdateButtonId(category)} onClick={(event) =>{
                                                        setSpaceName('createCategory')
                                                        setUpdate(true)
                                                        setItemToUpdate(category)
                                                        event.preventDefault()
                                                    }}>
                                                    <span className="material-icons md-48 delete-icon">edit</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>    
                    </div>
                </div>
            </div>        
        );
    }

    //fonction d'affichage de la liste des Conditionnements//
   function displayConditionings(){
        return(
            <div>
                <div className="row">
                    <div class="table-responsive">   
                        <table className="table">
                            <thead>
                                <tr className="no-gutters not-display-on-small-screens">
                                    <th className="col-1 text bold" style={{paddingLeft:"15px"}}>
                                            <input type="checkbox" id="selectAll" title="tout sélectionner" value="1" onClick={selectAll}></input>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Nom</span>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Description</span>
                                    </th>
                                    <th class="col-1 text bold">
                                        <span>Quantité</span>
                                    </th>
                                    <th class="col-3 text bold">
                                        <span>Date création</span>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Dernière modification</span>
                                    </th>
                                    <th className="col-1 text bold">
                                    </th>
                                    
                                </tr>
                            </thead>
                        </table>    
                    </div>
                </div>

                <div className="row overflow-auto form-div" style={{height:"60vh"}}>
                    <div class="table-responsive">
                        <table className="table list-small-screen">
                            <tbody>
                                {
                                    data.map((conditioning) => (
                                        <tr className="list-item no-gutters" key={conditioning['id']} id={conditioning['id']} onMouseOver={()=>{
                                            //on affiche le bouton de suppression de l'élément survolé
                                            if(document.getElementById(getDeleteButtonId(conditioning))){
                                                document.getElementById(getDeleteButtonId(conditioning)).style.visibility = "visible"
                                            }

                                            if(document.getElementById(getUpdateButtonId(conditioning))){
                                                document.getElementById(getUpdateButtonId(conditioning)).style.visibility = "visible"
                                            }  
                                            
                                        }}
                                        onMouseOut={() =>{
                                            //on retire le bouton de suppression de l'élément survolé
                                            if(document.getElementById(getDeleteButtonId(conditioning))){
                                                document.getElementById(getDeleteButtonId(conditioning)).style.visibility = "hidden"
                                            }

                                            if(document.getElementById(getUpdateButtonId(conditioning))){
                                                document.getElementById(getUpdateButtonId(conditioning)).style.visibility = "hidden"
                                            }  
                                            
                                        }}
                                        onClick={(event)=>{
                                            const parentTagName = event.target.parentElement.tagName

                                            if(parentTagName === "TR" || parentTagName === "TD"){
                                                setItem(conditioning)
                                                setItemType(listType)
                                                setSpaceName('details')
                                            }
                                        
                                        }}>
                                            <td className="col-1 not-display-on-small-screens" style={{paddingLeft:"15px", paddingTop:"2px", paddingBottom:"2px"}}>
                                                <span>
                                                    {
                                                        canDeleteConditioning.get(conditioning['id']) ? <input type="checkbox" id={getCheckboxId(conditioning)} onClick={(event)=>handleCheckboxClick(event, conditioning['id'])}></input> : null
                                                    }
                                                </span>
                                            </td>
                                            <td className="col-2 text" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{conditioning['name']}</span></td>
                                            <td className="col-2 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{conditioning['description']}</span></td>
                                            <td className="col-1 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{conditioning['quantity']}</span></td>
                                            <td className="col-3 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{conditioning['created_at']}</span></td>
                                            <td className="col-2 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{conditioning['update_at']}</span></td>
                                            <td className="col-1 not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}>
                                                {
                                                    canDeleteConditioning.get(conditioning['id']) ? <a className="item-delete" id={getDeleteButtonId(conditioning)} title="supprimer" onClick={(event) =>{
                                                        setDisplaySuccessfulDeleteAlert(false)
                                                        setSuccessfulDeleteAlertMsg("Conditionnement supprimé!")

                                                        //on vide la liste des checkbox sélectionnés
                                                        setCheckedItems([])

                                                        //affichage du popup de confirmation
                                                        document.getElementById(getDeleteButtonId(conditioning)).href="#confirm-delete-alert"
                                                        setConfirmAlertMsg("Voulez-vous supprimer le conditionnement " + conditioning['name'] + " ?")
                                                    
                                                        setSelectedItemId(conditioning['id'])
                                                    
                                                    
                                                    }} style={{marginRight:"10px"}}>
                                                        <span className="material-icons md-48 delete-icon">delete</span>
                                                    </a> : null
                                                }
                                                <a className="update-icon item-update" id={getUpdateButtonId(conditioning)} onClick={(event) =>{
                                                            setUpdate(true)
                                                            setItemToUpdate(conditioning)
                                                            setSpaceName('createConditioning')
                                                            event.preventDefault()
                                                        }}>
                                                    <span className="material-icons md-48 delete-icon">edit</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>    
                    </div>
                </div>
            </div>        
        );
    }

    //fonction d'affichage de la liste des langues//
   function displayLanguagesList(){
        return(
            <div>
                <div className="row">
                    <div class="table-responsive">
                        <table className="table">
                            <thead>
                                <tr className="no-gutters not-display-on-small-screens">
                                    <th className="col-1 text bold" style={{paddingLeft:"15px"}}>
                                            <input type="checkbox" id="selectAll" title="tout sélectionner" value="1" onClick={selectAll}></input>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Nom</span>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Code</span>
                                    </th>
                                    <th class="col-3 text bold">
                                        <span>Date création</span>
                                    </th>
                                    <th class="col-3 text bold">
                                        <span>Dernière modification</span>
                                    </th>
                                    <th className="col-1 text bold">
                                    </th>
                                    
                                </tr>
                            </thead>
                        </table>    
                    </div>
                </div>

                <div className="row overflow-auto form-div" style={{height:"60vh"}}>
                    <div class="table-responsive">
                        <table className="table list-small-screen">
                            <tbody>
                                {
                                    data.map((language) => (
                                        <tr className="list-item no-gutters" key={language['id']} id={language['id']} onMouseOver={()=>{
                                            //on affiche le bouton de suppression de l'élément survolé
                                            if(document.getElementById(getDeleteButtonId(language))){
                                                document.getElementById(getDeleteButtonId(language)).style.visibility = "visible"
                                            }

                                            if(document.getElementById(getUpdateButtonId(language))){
                                                document.getElementById(getUpdateButtonId(language)).style.visibility = "visible"
                                            }  
                                        }}
                                        onMouseOut={() =>{
                                            //on retire le bouton de suppression de l'élément survolé
                                            if(document.getElementById(getDeleteButtonId(language))){
                                                document.getElementById(getDeleteButtonId(language)).style.visibility = "hidden"
                                            }

                                            if(document.getElementById(getUpdateButtonId(language))){
                                                document.getElementById(getUpdateButtonId(language)).style.visibility = "hidden"
                                            }  
                                        }} 
                                        >
                                            <td className="col-1 not-display-on-small-screens" style={{paddingLeft:"15px", paddingTop:"2px", paddingBottom:"2px"}}>
                                                <span>
                                                    {
                                                        canDeleteLanguage.get(language['id']) ? <input type="checkbox" id={getCheckboxId(language)} onClick={(event)=>handleCheckboxClick(event, language['id'])}></input> : null
                                                    }
                                                </span>
                                            </td>
                                            <td className="col-2 text" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{language['name']}</span></td>
                                            <td className="col-2 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{language['code']}</span></td>
                                            <td className="col-3 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{language['created_at']}</span></td>
                                            <td className="col-3 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{language['update_at']}</span></td>
                                            <td className="col-1 not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}>
                                                {
                                                    canDeleteLanguage.get(language['id']) ? <a className="item-delete" id={getDeleteButtonId(language)} title="supprimer" onClick={(event) =>{
                                                        setDisplaySuccessfulDeleteAlert(false)
                                                        setSuccessfulDeleteAlertMsg("Langue supprimée!")

                                                        //on vide la liste des checkbox sélectionnés
                                                        setCheckedItems([])

                                                        //affichage du popup de confirmation
                                                        document.getElementById(getDeleteButtonId(language)).href="#confirm-delete-alert"
                                                        setConfirmAlertMsg("Voulez-vous supprimer la langue " + language['name'] + " ?")
                                                    
                                                        setSelectedItemId(language['id'])
                                                    
                                                    
                                                    }} style={{marginRight:"10px"}}>
                                                        <span className="material-icons md-48 delete-icon">delete</span>
                                                    </a> : null
                                                }
                                                {
                                                    canDeleteLanguage.get(language['id']) ? <a className="update-icon item-update" id={getUpdateButtonId(language)} onClick={(event) =>{
                                                                setSpaceName('createLanguage')
                                                                setUpdate(true)
                                                                setItemToUpdate(language)
                                                                event.preventDefault()
                                                            }}>
                                                        <span className="material-icons md-48 delete-icon">edit</span>
                                                    </a> : null
                                                }
                                            </td>
                                        </tr>
                                    ))
                                } 
                            </tbody>
                        </table>    
                    </div>
                </div>
            </div>        
        );
    }

    //fonction d'affichage de la liste des produits
    function displayProductsList(){
        return(
            <div>
                <div className="row">
                    <div className="table-responsive">
                        <table className="table not-display-on-small-screens">
                            <thead>
                                <tr className="no-gutters">
                                    <th className="col-1 text bold" style={{paddingLeft:"15px"}}>
                                       
                                    </th>
                                    <th className="col-2 text bold">
                                        <span>Nom</span>
                                    </th>
                                    <th className="col-2 text bold">
                                        <span>Code</span>
                                    </th>
                                    <th className="col-2 text bold">
                                        <span>Catégorie</span>
                                    </th>
                                    <th className="col-2 text bold">
                                        <span>Date création</span>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Dernière modification</span>
                                    </th>
                                    <th className="col-1 text bold">
                                    </th>
                                </tr>
                            </thead>
                        </table>    
                    </div>
                </div>

                <div className="row overflow-auto form-div" style={{height:"60vh"}}>
                    <div class="table-responsive">
                        <table className="table list-small-screen">
                            <tbody>
                                {
                                    data.map((product) => (
                                        <tr className="list-item no-gutters" key={product['id']} id={product['id']} onMouseOver={()=>{
                                            //on affiche le bouton de mise à jour de l'élément survolé
                                            document.getElementById(getUpdateButtonId(product)).style.visibility = "visible"
                                        }}
                                        onMouseOut={() =>{
                                            //on retire le bouton de mise à jour de l'élément survolé
                                            document.getElementById(getUpdateButtonId(product)).style.visibility = "hidden"
                                        }}
                                        onClick={(event)=>{
                                            const parentTagName = event.target.parentElement.tagName

                                            if(parentTagName === "TR" || parentTagName === "TD"){
                                                setItem(product)
                                                setItemType(listType)
                                                setSpaceName('details')
                                            }
                                           
                                        }}>
                                            <td className="col-1 not-display-on-small-screens" style={{paddingLeft:"15px", paddingTop:"2px", paddingBottom:"2px"}}>
                                                <svg width="20" height="20" className="pricing-indicator">
                                                    <rect rx="5" ry="5" width="15" height="15" style={{fill:"rgba(234, 137, 41, 0.4)"}}/>
                                                </svg> 
                                            </td>
                                            <td className="col-2 text" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{product['name']}</span></td>
                                            <td className="col-2 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{product['code']}</span></td>
                                            <td className="col-2 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{productsCategories.get(product['id'])}</span></td>
                                            <td className="col-2 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{product['created_at']}</span></td>
                                            <td className="col-2 text not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}><span>{product['update_at']}</span></td>
                                            <td className="col-1 vertical-center not-display-on-small-screens" style={{paddingTop:"2px", paddingBottom:"2px"}}>
                                            <a className="update-icon item-update" id={getUpdateButtonId(product)} onClick={(event) =>{
                                                            setUpdate(true)
                                                            setItemToUpdate(product)
                                                            setSpaceName('createProduct')
                                                            event.preventDefault()
                                                        }}>
                                                    <span className="material-icons md-48 delete-icon">edit</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>   
                    </div>
                </div>
            </div>
        );
    }

    //fonction d'affichage de la liste des langues//
    function displayTaxesList(){
        return(
            <div>
                <div className="row">
                    <div class="table-responsive">
                        <table className="table">
                            <thead>
                                <tr className="no-gutters">
                                    <th className="col-1 text bold" style={{paddingLeft:"15px"}}>
                                            <input type="checkbox" id="selectAll" title="tout sélectionner" value="1" onClick={selectAll}></input>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Libellé de la taxe</span>
                                    </th>
                                    <th class="col-1 text bold">
                                        <span>Valeur</span>
                                    </th>
                                    <th class="col-3 text bold">
                                        <span>Description</span>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Date de création</span>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Dernière modification</span>
                                    </th>
                                    <th className="col-1 text bold">
                                        </th>
                                </tr>
                            </thead>
                        </table>    
                    </div>
                </div>

                <div className="row overflow-auto form-div" style={{height:"60vh"}}>
                    <div class="table-responsive">
                        <table className="table">
                            <tbody>
                                {
                                    data.map((taxe) => (
                                        <tr className="list-item no-gutters" key={taxe['id']} id={taxe['id']} onMouseOver={()=>{
                                            //on affiche le bouton de suppression de l'élément survolé
                                            document.getElementById(getDeleteButtonId(taxe)).style.visibility = "visible"
                                        }}
                                        onMouseOut={() =>{
                                            //on retire le bouton de suppression de l'élément survolé
                                            document.getElementById(getDeleteButtonId(taxe)).style.visibility = "hidden"
                                        }}
                                        onClick={(event)=>{
                                            const parentTagName = event.target.parentElement.tagName

                                            if(parentTagName === "TR" || parentTagName === "TD"){
                                                setItem(taxe)
                                                setItemType(listType)
                                                setSpaceName('details')
                                            }
                                        
                                        }}>
                                            <td className="col-1" style={{paddingLeft:"15px"}}>
                                                <span>
                                                <input type="checkbox" id={getCheckboxId(taxe)} onClick={(event)=>handleCheckboxClick(event)}></input>
                                                </span>
                                            </td>
                                            <td className="col-2 text"><span>{taxe['label']}</span></td>
                                            <td className="col-1 text"><span>{taxe['value']}</span></td>
                                            <td className="col-3 text"><span>{taxe['description']}</span></td>
                                            <td className="col-2 text"><span>{taxe['created_at']}</span></td>
                                            <td className="col-2 text"><span>{taxe['update_at']}</span></td>
                                            <td className="col-1">
                                                <a className="item-delete" id={getDeleteButtonId(taxe)} title="supprimer" onClick={(event) =>{
                                                    //on vide la liste des checkbox sélectionnés
                                                    setCheckedItems([])

                                                    //affichage du popup de confirmation
                                                    document.getElementById(getDeleteButtonId(taxe)).href="#confirm-delete-alert"
                                                    setConfirmAlertMsg("Voulez-vous supprimer la taxe " + taxe['name'] + " ?")
                                                
                                                    setSelectedItemId(taxe['id'])
                                                
                                                    //on supprime l'élément sélectionné
                                                    //deleteItem(getItemIdFromDeleteButtonId(event.target.id))
                                                }}>
                                                    <span className="material-icons md-48 delete-icon">delete</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>    
                    </div>
                </div>
            </div>        
        );
    }

   //fonction permettant d'afficher la liste entrée
   function displayList(){
        switch(listType){
            case 'categories':
                return displayCategoriesList()
                break;
            
            case 'conditionings':
                return displayConditionings()
                break;
            
            case 'languages':
                return displayLanguagesList()
                break;
            
            case 'products':
                return displayProductsList()
                break;

            case 'taxes':
                return displayTaxesList()
                break;
        }
   }

   //tri de la liste en fonction du critère de tri et de l'ordre de tri
   switch(sortCriterion){
       case "1":
            //tri  par nom
            console.log("nom")
            switch(sortOrder){
                case "1":
                    //tri dans l'ordre croissant
                    console.log("croisssant")
                    setData(data.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0))))
                    break

                case "2":
                    //tri dans l'ordre décroissant
                    setData(data.sort((a, b) => (a['name'] < b['name'] ? 1 : (b['name'] < a['name'] ? -1 : 0))))
                    break
            }
            break
       case "2":
           //tri par date de création
           switch(sortOrder){
                case "1":
                    //tri dans l'ordre croissant
                    setData(data.sort((a, b) => (a['created_at'] > b['created_at'] ? 1 : (b['created_at'] > a['created_at'] ? -1 : 0))))
                    break

                case "2":
                    //tri dans l'ordre décroissant
                    setData(data.sort((a, b) => (a['created_at'] < b['created_at'] ? 1 : (b['created_at'] < a['created_at'] ? -1 : 0))))
                    break
            }
            break
   }

   switch(listType){
       case 'categories':
           listTitle = "Catégories"
           addButtonTitle="Créer une nouvelle catégorie"
           successfulCreatedMsg = "Catégorie enregistrée!"
           break;

        case 'conditionings':
           listTitle = "Conditionnements"
           addButtonTitle="Créer un nouveau conditionnement"
           successfulCreatedMsg = "Conditionnement enregistré!"
           break;
        
        case 'languages':
            listTitle="Langues"
            addButtonTitle="Créer une nouvelle langue"
            successfulCreatedMsg = "Langue enregistrée!"
            break;
        
        case 'products':
            listTitle="Produits"
            addButtonTitle="Créer une nouveau produit"
            successfulCreatedMsg = "Produit enregistré!"
            break;
        
        case 'taxes':
            listTitle = "Liste des taxes"
            addButtonTitle = "Créer une nouvelle taxe"
            successfulCreatedMsg = "Taxe enregistrée!"
            break;
   }

    return(
        <div className="container-fluid">
            <div className="row headSection" style={{fontSize:"large"}}>
                <h4 className="col-10 col-md-5">{listTitle}</h4>
                <div className="col-2 col-md-7 d-flex justify-content-end vertical-center hover-pointer">
                <a id="delete" className="not-display-on-small-screens" style={{color:"black"}} onClick={() => {
                        setDisplaySuccessfulDeleteAlert(false)
                        
                        if(checkedItems.length > 0){
                            document.getElementById('delete').href="#confirm-delete-alert"

                            if(checkedItems.length === 1){
                                switch(listType){
                                    case 'categories':
                                        setConfirmAlertMsg("Voulez-vous supprimer la catégorie sélectionnée?")
                                        setSuccessfulDeleteAlertMsg("Catégorie supprimée!")
                                        break;
                             
                                    case 'conditionings':
                                        setConfirmAlertMsg("Voulez-vous supprimer le conditionnement sélectionné?")
                                        setSuccessfulDeleteAlertMsg("Conditionnement supprimé!")
                                        break;
                                     
                                    case 'languages':
                                        setConfirmAlertMsg("Voulez-vous supprimer la langue sélectionnée?")
                                        setSuccessfulDeleteAlertMsg("Langue supprimée!")
                                        break;
                                }
                                
                            }else{
                                switch(listType){
                                    case 'categories':
                                        setConfirmAlertMsg("Voulez-vous supprimer les catégories sélectionnées?")
                                        setSuccessfulDeleteAlertMsg("Catégories supprimées!")
                                        break;
                             
                                    case 'conditionings':
                                        setConfirmAlertMsg("Voulez-vous supprimer les conditionnements sélectionnés?")
                                        setSuccessfulDeleteAlertMsg("Conditionnements supprimés!")
                                        break;
                                     
                                    case 'languages':
                                        setConfirmAlertMsg("Voulez-vous supprimer les langues sélectionnées?")
                                        setSuccessfulDeleteAlertMsg("Langues supprimées!")
                                         break;
                                } 
                            }   
                        }else{
                            document.getElementById('delete').href="#"
                        }

                    }}
                    style={{marginRight:"20px"}}>
                        <span style={{color:"black"}} className="material-icons md-48" title="supprimer">delete</span>
                    </a>

                    <span className="fa fa-refresh" title="rafraîchir" style={{fontSize:"x-large", marginRight:"20px"}} onClick={() =>{
                        setData([])
                        //on rafraîchi la liste
                        switch(listType){
                            case 'categories':
                                getCategories(categoriesRequestURL, [])
                                break;

                            case 'languages':
                                getLanguages(languagesRequestURL, [])
                                break;

                            case 'conditionings':
                                console.log("hi")
                                getConditionings(conditioningsRequestURL, [])
                                break;
    
                            case 'products':
                                getPackagings(packagingsRequestURL, [])
                                getProducts(productsRequestURL, [])
                                break;
                        }  
                    }}></span>

                    <div className="not-display-on-small-screens">
                        Trier par &nbsp;
                        <select className="select-sort-input" defaultValue="1" style={{marginRight:"20px"}} id="select-sort-criterion">
                            <option value="1">Nom</option>
                            <option value="2">Date de création</option>
                        </select>
                    </div>

                    <div  className="not-display-on-small-screens">
                        Ordre &nbsp;
                        <select className="select-sort-input" defaultValue="1" style={{marginRight:"20px"}} id="select-sort-order">
                            <option value="1">Croissant</option>
                            <option value="2">Décroissant</option>
                        </select>
                    </div> 
                </div>
            </div>

            <div className="d-flex flex-row-reverse" style={{marginTop:"10px"}}>
                <button className="add-button" onClick={() =>{
                    switch(listType){
                        case 'categories':
                            setSpaceName('createCategory')
                            break;

                        case 'conditionings':
                            setSpaceName('createConditioning')
                            break;

                        case 'languages':
                            setSpaceName('createLanguage')
                            break;

                        case 'products':
                            setSpaceName('createProduct')
                            break;
                        
                    }
                }
                } title={addButtonTitle}>
                    <span className="fa fa-plus fa-2x form-control-feedback font-weight-bold"></span>
                </button>
            </div>

            {
                displayList()
            }

            { 
                <div id="confirm-delete-alert" className="overlay">
                    <div className="container confirm-delete-alert bold-center" style={{fontSize:"large"}}>
                        <div className="row">
                            {confirmAlertMsg}
                        </div>
                        <div className="row d-flex justify-content-around" style={{marginBottom:"5px"}}>
                            <div className="col-6" onClick={() => {
                                if(checkedItems.length > 0){
                                    //on supprime les éléments sélectionnés
                                    deleteItems(data, 0)
                                }else{
                                    //on supprime l'élément sélectionné
                                    deleteItem(selectedItemId)
                                }
                                
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
                displaySuccessAlert && <div className="animated fadeOutDown delay-2s slower success-alert "> 
                    <div className="text-center" style={{paddingBottom:"5px"}}>
                        <h2></h2>{successfulCreatedMsg}<h2></h2>
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

export default List