import {useState} from 'react'

import '../styles/Common.css'
import '../styles/List.css'

function List({displaySuccessAlert, listType, data, setData, spaceName, setSpaceName, itemType, setItemType, item, setItem,  update, setUpdate, itemToUpdate, setItemToUpdate}){

    //lien vers les catégories
    const categoriesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/categories/'

    //produit request url
    var productsRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/products/'

    //languages request url
    var languagesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/languages/'

    //languages request url
    var taxesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/taxes/'

    //message d'enregistrement
    const [registration,setRegistration] = useState('') 

    //etat contenant le message à afficher dans l'alerte de confirmation
    const [confirmAlertMsg, setConfirmAlertMsg] = useState('')

    //etat contenant la liste des éléments cochés de la liste
    const [checkedItems, setCheckedItems] = useState([])

    //etat contenant l'ID de l'élément de la liste sélectionné pour une action
    const [selectedItemId, setSelectedItemId] = useState('')

    //définition du titre de la liste
    let listTitle

    //définition du titre du bouton d'ajout
    let addButtonTitle

    //paramètres de connexion à l'API
    var userName = "zang";
    var passWord = "harazangsuperuser";

    //fonction d'encodage des paramètres de connexion à l'API//
    function authenticateUser(user, password){
        var token = user + ":" + password;

        var hash = btoa(token); 

        return "Basic " + hash;
    }

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
                document.getElementById(getCheckboxId(item)).checked = true
                tmpList.push(item['id'])
            })

        }else{
            //on vide la liste des éléments cochés
            setCheckedItems([])

            //on décoche tous les checkboxs
            data.forEach(function(item){
                document.getElementById(getCheckboxId(item)).checked = false
            })
        }
    }

    //fonction permettant de retrouver l'id d'un élément à partir de l'id du checkbox correspondant//
    function getItemIdFromCheckboxId(checkboxId){
        const tmp = checkboxId.split('_')
        return tmp[1]
    }

    //fonction appelée lorqu'on clique sur un checkbox de la liste
    function handleCheckboxClick(event)
    {
        var checked = event.target.checked;

        if(checked){
            //si le checkbox est coché on récupère l'id de l'élément correspondant et on le stocke dans la lste des éléments sélectionnés de la liste
            setCheckedItems([...checkedItems, getItemIdFromCheckboxId(event.target.id)])
            
        }else{
            //on retire l'id de l'élément dans la liste des éléments cochés
            const itemId = getItemIdFromCheckboxId(event.target.id)
            const index = checkedItems.indexOf(itemId)
            if(index > -1){
                checkedItems.splice(index, 1)
            }
        }
    }

    //fonction pour supprimer la liste des catégories sélectionnées//
    function deleteItems(itemsList, checkedItemIndex){
        if(checkedItemIndex < checkedItems.length){
            const itemId = checkedItems[checkedItemIndex]

            //création de la requête
            var requestURL = categoriesRequestURL + itemId + "/"
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
        }
    }

    //fonction permettant de supprimer un élément ayant son id//
    function deleteItem(itemId){
        //création de la requête
        var requestURL = categoriesRequestURL + itemId + "/"
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

                setData(tmpList)

                if(next != null){
                    getCategories(next, tmpList)
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

                setData(tmpList)
                
                if(next != null){
                    tmpList = getLanguages(next, tmpList)
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
                
                setData(tmpList)
               

                if(next != null){
                    tmpList = getProducts(next, tmpList)
                }
            }
        }   
     }



    //fonction d'affichage de la liste des langues//
   function displayLanguagesList(){
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
                                    <th class="col-3 text bold">
                                        <span>Code</span>
                                    </th>
                                    <th class="col-2 text bold">
                                        <span>Nom</span>
                                    </th>
                                    <th class="col-2 text bold">
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

                <div className="row overflow-auto form-div" style={{height:"70vh"}}>
                    <div class="table-responsive">
                        <table className="table">
                            <tbody>
                                {
                                    data.map((language) => (
                                        <tr className="list-item no-gutters" key={language['id']} id={language['id']} onMouseOver={()=>{
                                            //on affiche le bouton de suppression de l'élément survolé
                                            document.getElementById(getDeleteButtonId(language)).style.visibility = "visible"
                                        }}
                                        onMouseOut={() =>{
                                            //on retire le bouton de suppression de l'élément survolé
                                            document.getElementById(getDeleteButtonId(language)).style.visibility = "hidden"
                                        }}
                                        onClick={(event)=>{
                                            const parentTagName = event.target.parentElement.tagName

                                            if(parentTagName === "TR" || parentTagName === "TD"){
                                                setItem(language)
                                                setItemType(listType)
                                                setSpaceName('details')
                                            }
                                        
                                        }}>
                                            <td className="col-1" style={{paddingLeft:"15px"}}>
                                                <span>
                                                <input type="checkbox" id={getCheckboxId(language)} onClick={(event)=>handleCheckboxClick(event)}></input>
                                                </span>
                                            </td>
                                            <td className="col-3 text"><span>{language['code']}</span></td>
                                            <td className="col-2 text"><span>{language['name']}</span></td>
                                            <td className="col-2 text"><span>{language['created_at']}</span></td>
                                            <td className="col-3 text"><span>{language['update_at']}</span></td>
                                            <td className="col-1">
                                                <a className="item-delete" id={getDeleteButtonId(language)} title="supprimer" onClick={(event) =>{
                                                    //on vide la liste des checkbox sélectionnés
                                                    setCheckedItems([])

                                                    //affichage du popup de confirmation
                                                    document.getElementById(getDeleteButtonId(language)).href="#confirm-delete-alert"
                                                    setConfirmAlertMsg("Voulez-vous supprimer la langue " + language['name'] + " ?")
                                                
                                                    setSelectedItemId(language['id'])
                                                
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

    //fonction retournant le nom de la catégorie d'un produit
    function getCategoryNameFromProduct(product){
        //on envoie une requête à l'API pour récupérer la catégorie du produit
        //création de la requête
        const requestURL = product['category']

        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status

            if(requestStatus === 200){
               
            }
        }

    }

    //fonction d'affichage de la liste des produits
    function displayProductsList(){
        return(
            <div>
                <div className="row">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr className="no-gutters">
                                    <th className="col-1 text bold" style={{paddingLeft:"15px"}}>
                                        <input type="checkbox" id="selectAll" title="tout sélectionner" value="1" onClick={selectAll}></input>
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

                <div className="row overflow-auto form-div" style={{height:"65vh"}}>
                    <div class="table-responsive">
                        <table className="table">
                            <tbody>
                                {
                                    data.map((product) => (
                                        <tr className="list-item no-gutters" key={product['id']} id={product['id']} onMouseOver={()=>{
                                            //on affiche le bouton de suppression de l'élément survolé
                                            document.getElementById(getDeleteButtonId(product)).style.visibility = "visible"
                                            document.getElementById(getUpdateButtonId(product)).style.visibility = "visible"
                                        }}
                                        onMouseOut={() =>{
                                            //on retire le bouton de suppression de l'élément survolé
                                            document.getElementById(getDeleteButtonId(product)).style.visibility = "hidden"
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
                                            <td className="col-1" style={{paddingLeft:"15px"}}>
                                                <span>
                                                    <input type="checkbox" id={getCheckboxId(product)} onClick={(event)=>handleCheckboxClick(event)}></input>
                                                </span>
                                            </td>
                                            <td className="col-2 text"><span>{product['name']}</span></td>
                                            <td className="col-2 text"><span>{product['code']}</span></td>
                                            <td className="col-2 text"><span>{product['']}</span></td>
                                            <td className="col-2 text"><span>{product['created_at']}</span></td>
                                            <td className="col-2 text"><span>{product['update_at']}</span></td>
                                            <td className="col-1 vertical-center">
                                                <a className="item-delete material-icons md-48 delete-icon" id={getDeleteButtonId(product)}  title="supprimer" onClick={(event) =>{
                                                    //on vide la liste des checkbox sélectionnés
                                                    setCheckedItems([])

                                                    //affichage du popup de confirmation
                                                    document.getElementById(getDeleteButtonId(product)).href="#confirm-delete-alert"
                                                    setConfirmAlertMsg("Voulez-vous supprimer le produit " + product['name'] + " ?")
                                                
                                                    setSelectedItemId(product['id'])
                                                }} style={{marginRight:"10px"}}>
                                                    <span className="material-icons md-48 delete-icon">delete</span>
                                                </a>
                                                <a className="update-icon item-update" id={getUpdateButtonId(product)} onClick={(event) =>{
                                                        setSpaceName('createProduct')
                                                        setUpdate(true)
                                                        setItemToUpdate(product)
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

                <div className="row overflow-auto form-div" style={{height:"70vh"}}>
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

   //fonction d'affichage de la liste des catégories//
   function displayCategoriesList(){
        return(
            <div>
                <div className="row">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr className="no-gutters">
                                    <th className="col-1 text bold" style={{paddingLeft:"15px"}}>
                                        <input type="checkbox" id="selectAll" title="tout sélectionner" value="1" onClick={selectAll}></input>
                                    </th>
                                    <th className="col-3 text bold">
                                        <span>Nom</span>
                                    </th>
                                    <th className="col-2 text bold">
                                        <span>Code</span>
                                    </th>
                                    <th className="col-2 text bold">
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

                <div className="row overflow-auto form-div" style={{height:"65vh"}}>
                    <div class="table-responsive">
                        <table className="table">
                            <tbody>
                                {
                                    data.map((category) => (
                                        <tr className="list-item no-gutters" key={category['id']} id={category['id']} onMouseOver={()=>{
                                            //on affiche le bouton de suppression de l'élément survolé
                                            document.getElementById(getDeleteButtonId(category)).style.visibility = "visible"
                                            document.getElementById(getUpdateButtonId(category)).style.visibility = "visible"
                                        }}
                                        onMouseOut={() =>{
                                            //on retire le bouton de suppression de l'élément survolé
                                            document.getElementById(getDeleteButtonId(category)).style.visibility = "hidden"
                                            document.getElementById(getUpdateButtonId(category)).style.visibility = "hidden"
                                        }}
                                        onClick={(event)=>{
                                            const parentTagName = event.target.parentElement.tagName

                                            if(parentTagName === "TR" || parentTagName === "TD"){
                                                setItem(category)
                                                setItemType(listType)
                                                setSpaceName('details')
                                            }
                                           
                                        }}>
                                            <td className="col-1" style={{paddingLeft:"15px"}}>
                                                <span>
                                                    <input type="checkbox" id={getCheckboxId(category)} onClick={(event)=>handleCheckboxClick(event)}></input>
                                                </span>
                                            </td>
                                            <td className="col-3 text"><span>{category['name']}</span></td>
                                            <td className="col-2 text"><span>{category['code']}</span></td>
                                            <td className="col-2 text"><span>{category['created_at']}</span></td>
                                            <td className="col-3 text"><span>{category['update_at']}</span></td>
                                            <td className="col-1 vertical-center">
                                                <a className="item-delete material-icons md-48 delete-icon" id={getDeleteButtonId(category)}  title="supprimer" onClick={(event) =>{
                                                    //on vide la liste des checkbox sélectionnés
                                                    setCheckedItems([])

                                                    //affichage du popup de confirmation
                                                    document.getElementById(getDeleteButtonId(category)).href="#confirm-delete-alert"
                                                    setConfirmAlertMsg("Voulez-vous supprimer la catégorie " + category['name'] + " ?")
                                                
                                                    setSelectedItemId(category['id'])
                                                }} style={{marginRight:"10px"}}>
                                                    <span className="material-icons md-48 delete-icon">delete</span>
                                                </a>
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

   //fonction permettant d'afficher la liste entrée
   function displayList(){
        switch(listType){
            case 'categories':
                setRegistration('Categorie enregistrée')
                return displayCategoriesList()
                break;
            
            case 'languages':
                setRegistration('Langue enregistrée')
                return displayLanguagesList()
                break;
            
            case 'products':
                setRegistration('produit enregistré')
                return displayProductsList()
                break;

            case 'taxes':
                setRegistration('taxe enregistrée')
                return displayTaxesList()
                break;
        }
   }

   switch(listType){
       case 'categories':
           listTitle = "Liste des catégories"
           addButtonTitle="Nouvelle catégorie"
           break;
        
        case 'languages':
            listTitle="Liste des langues"
            addButtonTitle="Nouvelle langue"
            break;
        
        case 'products':
            listTitle=" Liste des produits "
            addButtonTitle=" Nouveau produit"
            break;
        
        case 'taxes':
            listTitle = " Liste des taxes "
            addButtonTitle = " Nouvelle taxe"
            break;
   }

    return(
        <div className="container">
            <div className="row headSection" style={{fontSize:"large"}}>
                <h4 className="col-4">{listTitle}</h4>
                <div className="col-8 d-flex justify-content-end vertical-center hover-pointer">
                    <a id="delete" style={{color:"black"}} onClick={() => {
                        if(checkedItems.length > 0){
                            document.getElementById('delete').href="#confirm-delete-alert"
                            switch(listType){
                                    case 'categories':
                                        if(checkedItems.length === 1){
                                            setConfirmAlertMsg("Voulez-vous supprimer la catégorie sélectionnée?")
                                        }else{
                                            setConfirmAlertMsg("Voulez-vous supprimer les catégories sélectionnées?")
                                        } 
                                    break;
                                    case 'products':
                                        if(checkedItems.length === 1){
                                            setConfirmAlertMsg("Voulez-vous supprimer le produit sélectionnée?")
                                        }else{
                                            setConfirmAlertMsg("Voulez-vous supprimer les produits sélectionnées?")
                                        } 
                                    break;

                            }
                           
                        }

                    }}
                    style={{marginRight:"10px"}}>
                        <span className="material-icons md-48" title="supprimer">delete</span>
                    </a>

                    <span className="fa fa-refresh" title="rafraîchir" style={{fontSize:"x-large"}} onClick={() =>{
                        //on rafraîchi la liste
                        switch(listType){
                            case 'categories':
                                getCategories(categoriesRequestURL, [])
                                break;
    
                            case 'products':
                                getProducts(productsRequestURL, [])
                                break;
    
                            case 'languages':
                                getLanguages(languagesRequestURL, [])
                                break;
                        }
                        
                    }}></span>
                </div>
            </div>

            <div className="d-flex flex-row-reverse" style={{marginTop:"10px"}}>
                <button className="button" style={{fontSize:"20px"}} onClick={() =>{
                    switch(listType){
                        case 'categories':
                            setSpaceName('createCategory')
                            break;

                        case 'products':
                            setSpaceName('createProduct')
                            break;

                        case 'languages':
                            setSpaceName('')
                            break;
                    }
                }
                }>
                    <span title ={ addButtonTitle} className="fa fa-plus form-control-feedback font-weight-bold fa-2x" style={{color:'blue'}}></span>
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
                        
                        <h2></h2>{registration}<h2></h2>
                    </div>
                </div>
            }
        </div>             
    );
}

export default List