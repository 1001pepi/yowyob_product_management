import '../styles/Common.css'
import '../styles/List.css'

import {useState} from 'react'

function SearchResults({findInCategories, findInConditionnements, findInLangues, findInProducts, findInTaxes, stringToSearch, categoriesList, setCategoriesList, upadateCategoriesList, setUpdateCategoriesList, item, setItem, spaceName, setSpaceName, itemType, setItemType, categoriesResult, setCategoriesResult, isASearchResult, setIsASearchResult}){
    //lien vers les catégories
    const categoriesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/categories/'

     //etat contenant la liste des éléments cochés de la liste des catégories
     const [categoriesCheckedItems, setCategoreiesCheckedItems] = useState([])

    //etat contenant l'ID de l'élément de la liste sélectionné pour une action
    const [selectedItemId, setSelectedItemId] = useState('')

    //état contenant le type de l'élément de la liste sélectionné pour une action
    const [selectedItemType, setSelectedItemType] = useState('')

     //etat contenant la liste des éléments cochés de la liste
     const [checkedItems, setCheckedItems] = useState([])

     //etat contenant le message à afficher dans l'alerte de confirmation
    const [confirmAlertMsg, setConfirmAlertMsg] = useState('')

    //etat indiquant l'endroit où on doit supprimer l'élément sélectionné
    const [deletIn, setDeleteIn] = useState('')

    //paramètres de connexion à l'API
    var userName = "zang";
    var password = "harazangsuperuser";

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

    //fonction permettant de retrouver l'id d'un élément de la liste à partir de l'id du bouton de suppression//
    function getItemIdFromDeleteButtonId(deleteButtonId){
        const tmp = deleteButtonId.split('_')
        return tmp[1]
    }

    //fonction permettant de construire l'ide du bouton de suppression d'un élément//
    function getDeleteButtonId(item){
        return 'deleteButton_' + item['id']
    }

    //fonction permettant de sélectionner tous les éléments de la liste//
    function selectAll(event){
        const checked = event.target.checked
        const checkboxId = event.target.id

        let data

        switch(checkboxId){
            case 'selectAll_categories':
                data = categoriesResult;
                break;
        }
        
        if(checked){
            const tmpList = []

            //on coche tous les checkboxs
            data.forEach(function(item){
                document.getElementById(getCheckboxId(item)).checked = true
                tmpList.push(item['id'])
            })

        }else{
            //on vide la liste des éléments cochés
            switch(checkboxId){
                case 'selectAll_categories':
                    setCategoreiesCheckedItems([])
                    break;
            }
           
            //on décoche tous les checkboxs
            data.forEach(function(item){
                document.getElementById(getCheckboxId(item)).checked = false
            })
        }

    }

    //fonction permettant de supprimer les éléments sélectionnnés//
    function deleteItems(varCategoriesList, varCategoriesResult, index){
        //index indique l'indice de l'élément de la liste à supprimer
        if(index < checkedItems.length){
            const type = checkedItems[index]['type']
            const id = checkedItems[index]['id']

            //création de la requête
            let requestURL

            switch(type){
                case 'category':
                    requestURL = categoriesRequestURL + id + "/"
                    break;
            }

            var request = new XMLHttpRequest();
        
            request.open('DELETE', requestURL);
            request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
            request.responseType = 'json';
            request.send();

            request.onload = function(){
                const requestStatus = request.status

                if(requestStatus === 204){
                    //succès de la suppression
                    switch(type){
                        case 'category':
                            const deletedItemIndex = varCategoriesList.findIndex(item => item['id'] === id);
                            const deletedItemIndex2 = varCategoriesResult.findIndex(item => item['id'] === id)

                            if(deletedItemIndex > -1){
                        
                                //on retire l'élément supprimé de la liste
                                varCategoriesList = varCategoriesList.filter(function(value, index, arr){
                                    return index != deletedItemIndex2
                                })
                                
                                setCategoriesList(varCategoriesList)
                            }

                            if(deletedItemIndex2 > -1){
                                //on retire l'élément de la liste des résultats de recherche
                                varCategoriesResult = varCategoriesResult.filter(function(item, index, arr){
                                    return index != deletedItemIndex2
                                })
        
                                setCategoriesResult(varCategoriesResult)
                            }

                            deleteItems(varCategoriesList, varCategoriesResult, index + 1)
                            
                            break;
                    }
                }
            }

        }else{
            setCheckedItems([])
        }
    }

    //fonction appelée lorqu'on clique sur un checkbox de la liste
    function handleCheckboxClick(event, type, itemId){
        var checked = event.target.checked;

        if(checked){
            //si le checkbox est coché on récupère l'id de l'élément correspondant et on le stocke dans la lste des éléments sélectionnés de la liste
            setCheckedItems([...checkedItems, {
                id:itemId,
                type: type
            }])
            
        }else{
            //on retire l'id de l'élément dans la liste des éléments cochés
            const index = checkedItems.findIndex(tmpItem => tmpItem['id'] === itemId)

            if(index > -1){
                checkedItems.splice(index, 1)
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
                                <tr className="no-gutters">
                                    <th className="col-1 text bold" style={{paddingLeft:"15px"}}>
                                        <input type="checkbox" id="selectAll_categories" title="tout sélectionner" value="1" onClick={(event) => selectAll(event)}></input>
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

                <div className="row form-div">
                    <div class="table-responsive">
                        <table className="table">
                            <tbody>
                                {
                                    categoriesResult.map((category) => (
                                        <tr className="list-item no-gutters" key={category['id']} id={category['id']} onMouseOver={()=>{
                                            //on affiche le bouton de suppression de l'élément survolé
                                            document.getElementById(getDeleteButtonId(category)).style.visibility = "visible"
                                        }}
                                        onMouseOut={() =>{
                                            //on retire le bouton de suppression de l'élément survolé
                                            document.getElementById(getDeleteButtonId(category)).style.visibility = "hidden"
                                        }}
                                        onClick={(event)=>{
                                            const parentTagName = event.target.parentElement.tagName

                                            if(parentTagName === "TR" || parentTagName === "TD"){
                                                setItem(category)
                                                setItemType('categories')
                                                setIsASearchResult(true)
                                                setSpaceName('details')
                                            }
                                        
                                        }}>
                                            <td className="col-1" style={{paddingLeft:"15px"}}>
                                                <span>
                                                    <input type="checkbox" id={getCheckboxId(category)} onClick={(event)=>handleCheckboxClick(event, 'category', category['id'])}></input>
                                                </span>
                                            </td>
                                            <td className="col-3 text"><span>{category['name']}</span></td>
                                            <td className="col-2 text"><span>{category['code']}</span></td>
                                            <td className="col-2 text"><span>{category['created_at']}</span></td>
                                            <td className="col-3 text"><span>{category['update_at']}</span></td>
                                            <td className="col-1">
                                                <a className="item-delete" id={getDeleteButtonId(category)} title="supprimer" onClick={(event) =>{
                                                    //on vide la liste des checkbox sélectionnés
                                                    setCheckedItems([])

                                                    //affichage du popup de confirmation
                                                    document.getElementById(getDeleteButtonId(category)).href="#confirm-delete-alert"
                                                    setConfirmAlertMsg("Voulez-vous supprimer la catégorie " + category['name'] + " ?")
                                                
                                                    setSelectedItemId(category['id'])
                                                    setSelectedItemType('category')
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

    //fonction de recherche dans les catégories//
    function displayCategoriesResults(){
        
        


        return(
            <div className="section">
                <h6 style={{color:"#351FBC", fontWeight:"bolder"}}>Catégories</h6>
                <hr></hr>
                {
                    displayCategoriesList()
                }
            </div>
        );
    }

     //fonction de recherche dans les conditionnements//
     function searchInConditionings(entry){
        
        return(
            <div>
                conditionnements
            </div>
        );
    }

     //fonction de recherche dans les langues//
     function searchInLanguages(entry){
        return(
            <div>
                langues
            </div>
        );
    }

     //fonction de recherche dans les produits//
     function searchInProducts(entry){
        return(
            <div>
                produits
            </div>
        );
    }

     //fonction de recherche dans les taxes//
     function searchInTaxations(entry){
        return(
            <div>
                taxes
            </div>
        );
    }

    //fonction permettant de supprimer un élément ayant son id et son type//
    function deleteItem(itemId, type){
        //création de la requête
        let requestURL

        switch(type){
            case 'category':
                requestURL = categoriesRequestURL + itemId + "/"
                break;
        }
         
        var request = new XMLHttpRequest();
        
        request.open('DELETE', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            const requestStatus = request.status

            if(requestStatus === 204){
                //succès de la suppression
                
                switch(type){
                    case 'category':
                        const deletedItemIndex = categoriesList.findIndex(item => item['id'] === itemId);
                        const deletedItemIndex2 = categoriesResult.findIndex(item => item['id'] === itemId);

                        //on supprime l'élément de la liste des data*/
                        if(deletedItemIndex > -1){
                    
                            //on retire l'élément supprimé de la liste
                            const itemsList = categoriesList.filter(function(value, index, arr){
                                return index != deletedItemIndex
                            })
                            
                            setCategoriesList(itemsList)
                        }

                        //on supprime l'élément de la liste des résultats
                        if(deletedItemIndex2 > -1){
                    
                            //on retire l'élément supprimé de la liste
                            const itemsList2 = categoriesResult.filter(function(value, index, arr){
                                return index != deletedItemIndex2
                            })
                            
                            setCategoriesResult(itemsList2)
                        }

                        break;
                }
                
                 //on vide la liste des éléments sélectionnés
                setCheckedItems([])
            }
        }

    }

    return(
        <div className="container">
             <div className="row headSection" style={{fontSize:"large"}}>
                <h4>{'Résultats de la recherche "' + stringToSearch + '"'}</h4>
            </div>

            <div className="overflow-auto form-div" style={{height:"80vh"}}>
                {
                    findInCategories ? displayCategoriesResults() : null
                }
                {
                   findInConditionnements ? searchInConditionings(stringToSearch) : null
                }
                {
                    findInLangues ? searchInLanguages(stringToSearch) : null
                }
                {
                    findInProducts ? searchInProducts(stringToSearch) : null
                }
                {
                    findInTaxes ? searchInTaxations(stringToSearch) : null
                }
               
            </div>
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
                                    deleteItems(categoriesList, categoriesResult, 0)
                                }else{
                                    //on supprime l'élément sélectionné               
                                    deleteItem(selectedItemId, selectedItemType)
                                
                                    setCheckedItems([])
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
        </div>
    );
}

export default SearchResults