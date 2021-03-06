import '../styles/Menu.css'
import '../styles/smallDisplay.css'

import React, {Fragment} from 'react'

function Menu({categoriesList, setCategoriesList, canDeleteCategory, setCanDeleteCategory, updateCategoriesList, setUpdateCategoriesList,

    conditioningsList, setConditioningsList, canDeleteConditioning, setCanDeletCconditioning, updateConditioningsList, setUpdateConditioningsList,

    languagesList, setLanguagesList, canDeleteLanguage, setCanDeleteLanguage, updateLanguagesList, setUpdateLanguagesList, 

    productsList, setProductsList,updateProductsList, setUpdateProductsList, updatePackagings, setUpdatePackagings, canDeleteProduct, setCanDeleteProduct, productsCategories, setProductsCategories, packagingsList, setPackagingsList,

    categoriesRequestURL, conditioningsRequestURL, languagesRequestURL, productsRequestURL, packagingsRequestURL,

    userName, passWord,
    
    displaySuccessAlert, setDisplaySuccessAlert, smallScreen,

    searching, setSearching,
    
     taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList,  spaceName, setSpaceName
}){    
    
    //languages request url
    var taxesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/taxes/'

    //fonction d'encodage des paramètres de connexion à l'API//
    function authenticateUser(user, password){
        var token = user + ":" + password;

        var hash = btoa(token); 

        return "Basic " + hash;
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
            
                setCategoriesList(tmpList)

                if(next != null){
                    tmpList = getCategories(next, tmpList)
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
            console.log(response)
            
            if(requestStatus === 200){
                var next = response['next']
    
                tmpList = tmpList.concat(response['results'])

                //tri de la liste récupérée dans l'ordre croissant
                tmpList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

                //on vérifie si on peut supprimer les éléments récupérés
                response['results'].forEach((conditioning) => checkCanDeleteConditioning(conditioning))
                
                setConditioningsList(tmpList)
                
                if(next != null){
                    tmpList = getConditionings(next, tmpList)
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

                setLanguagesList(tmpList)
                
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

                //tri de la liste récupérée dans l'ordre croissant
                tmpList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

                //enregistrement des catégories des produits
                tmpList.forEach((product) => getCategoryNameFromProduct(product))
                
                setProductsList(tmpList)

                if(next != null){
                    tmpList = getProducts(next, tmpList)
                }
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

    //fonction permettantt de récupérer la liste des taxes//
    function getTaxes(requestURL, tmpList){
        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status
            console.log(response)
            
            if(requestStatus === 200){
                var next = response['next']
    
                tmpList = tmpList.concat(response['results'])
                console.log("tmplist: " + tmpList.length)
                setTaxesList(tmpList)
                console.log("catlist: " + taxesList.length)

                if(next != null){
                    tmpList = getTaxes(next, tmpList)
                }
            }
        }
    }

    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
    function openNav() {
        if(document.getElementById("mySidebar"))
            document.getElementById("mySidebar").style.width = "250px";

        if(document.getElementById("main"))
            document.getElementById("main").style.marginLeft = "250px";
    }
    
    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    function closeNav() {
        if(document.getElementById("mySidebar"))
            document.getElementById("mySidebar").style.width = "0";

        if(document.getElementById("main"))
            document.getElementById("main").style.marginLeft = "0";
    }

    //changer la couleur de fond du bouton sélectionné
    function changeBackgroundColor(event){
        for(var i = 0; i < 5; i++){
            document.getElementById("button-" + i).style.backgroundColor = "white";
        }

        var  button = document.getElementById(event.target.id);
        button.style.backgroundColor = "rgba(41, 44, 234, 0.2)";
    }

    return(
        <Fragment>
            <div className="row d-flex justify-content-center"
                    style={{marginBottom:"15px", marginTop:"15px"}}>
                <button className="col-12 menu-button" id="button-0" onClick={(event) => {
                        if(updateLanguagesList){
                            getLanguages(languagesRequestURL, [])
                            setUpdateLanguagesList(false)
                        }
                        if(updateCategoriesList){
                            getCategories(categoriesRequestURL, [])
                            setUpdateCategoriesList(false)
                            
                        }
                        
                        changeBackgroundColor(event)
                        setSearching(false)
                        setDisplaySuccessAlert(false)
                        setSpaceName("listCategories")

                        closeNav();
                    }}><i className="fa fa-list-ul link-item" ></i>Catégories</button>
            </div>

            <div className="row d-flex justify-content-center" 
                    style={{marginBottom:"15px", marginTop:"15px"}}>
                <button className="col-12 menu-button" id="button-1" onClick={(event) => {
                        if(updateConditioningsList){
                            getConditionings(conditioningsRequestURL, [])
                            setUpdateConditioningsList(false)
                        }
                        if(updatePackagings){
                            getPackagings(packagingsRequestURL, [])
                            setUpdatePackagings(false)
                        }

                        changeBackgroundColor(event)
                        setSearching(false)
                        setDisplaySuccessAlert(false)
                        setSpaceName("listConditionings")
                        closeNav();
                        }}><i className="fa fa-product-hunt link-item" ></i>Conditionnements</button>
            </div>

            <div className="row d-flex justify-content-center" 
                    style={{marginBottom:"15px", marginTop:"15px"}}>
                <button className="col-12 menu-button" id="button-2" onClick={(event) => {
                        if(updateLanguagesList){
                            getLanguages(languagesRequestURL, [])
                            setUpdateLanguagesList(false)
                        }

                        changeBackgroundColor(event)
                        setSearching(false)
                        setDisplaySuccessAlert(false)
                        setSpaceName("listLanguages")
                        closeNav();
                        }}><i className="fa fa-language link-item" ></i>Langues</button>
            </div>

            <div className="row d-flex justify-content-center" 
                    style={{marginBottom:"15px", marginTop:"15px"}}>
                <button className="col-12 menu-button" id="button-3" onClick={(event) => {
                        if(updateLanguagesList){
                            getLanguages(languagesRequestURL, [])
                            setUpdateLanguagesList(false)
                        }
                        if(updateCategoriesList){
                            getCategories(categoriesRequestURL, [])
                            setUpdateCategoriesList(false)
                        }
                        if(updatePackagings){
                            getPackagings(packagingsRequestURL, [])
                            setUpdatePackagings(false)
                        }
                        if(updateProductsList){
                            getProducts(productsRequestURL, [])
                            setUpdateProductsList(false)
                        }

                        changeBackgroundColor(event)
                        setSearching(false)
                        setDisplaySuccessAlert(false)
                        setSpaceName("listProducts")
                        closeNav();
                    }}><i className="fa fa-product-hunt link-item" ></i>Produits</button>
            </div>

            <div className="row d-flex justify-content-left" 
                    style={{marginBottom:"15px", marginTop:"15px"}}>
                <button className="col-12 menu-button" id="button-4" onClick={(event) => {
                        if(updateTaxesList){
                            getTaxes(taxesRequestURL, [])
                            setUpdateTaxesList(false)
                        }
                        
                        changeBackgroundColor(event)
                        setSearching(false)
                        setDisplaySuccessAlert(false)
                        setSpaceName("listTaxations")
                        closeNav();
                    }}><i className="fa fa-money link-item" ></i>Taxes</button>
            </div>
        </Fragment>
    );
}

export default Menu

