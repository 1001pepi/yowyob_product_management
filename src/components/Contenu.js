import '../styles/Contenu.css'
import '../styles/bigDisplay.css'
import '../styles/smallDisplay.css'
import '../styles/Common.css'

import Workspace from './Workspace'
import Menu from './Menu'

import React, {useEffect, useState} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
  } from "react-router-dom";

function Contenu({findInCategories, findInConditionings, findInLangues, findInProducts, findInTaxes,

    categoriesList, setCategoriesList, canDeleteCategory, setCanDeleteCategory, categoriesResult, setCategoriesResult, updateCategoriesList, setUpdateCategoriesList,

    conditioningsList, setConditioningsList, canDeleteConditioning, setCanDeleteConditioning, conditioningsResult, setConditioningsResult, updateConditioningsList, setUpdateConditioningsList,

    languagesList, setLanguagesList, canDeleteLanguage, setCanDeleteLanguage, languagesResult, setLanguagesResult, updateLanguagesList, setUpdateLanguagesList, 

    productsList, setProductsList, packagingsList, setPackagingsList, updatePackagings, setUpdatePackagings, canDeleteProduct, setCanDeleteProduct, productsResult, setProductsResult, productsCategories, setProductsCategories, updateProductsList, setUpdateProductsList,

    taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList,

    links, 

    userName, password,

    displaySuccessAlert, setDisplaySuccessAlert,

    listTypes, listType, setListType,
    
    searching, setSearching, isSearchResults, setIsSearchResults, searchResults, setSearchResults, advancedSearchResults, setAdvancedSearchResults, handleSearch,

    spaceName, setSpaceName, spaceNameValues, stringToSearch 
}){
    let{spaceNameParam, subSpaceNameParam, itemParam, description} = useParams();

    switch(spaceNameParam){
        case "categories":
            setSpaceName("listCategories")
            setIsSearchResults(false);
            break;

        case "conditionings":
            setSpaceName("listConditionings"); 
            setIsSearchResults(false);
            break;
        
        case "languages":
            setSpaceName("listLanguages");
            setIsSearchResults(false);
            break;

        case "products":
            setSpaceName("listProducts");
            setIsSearchResults(false);
            break;

        case "taxes":
            setSpaceName("listTaxes");
            setIsSearchResults(false);
            break;
    }

    switch(subSpaceNameParam){
        case "details":
            setSpaceName("details")
            break;
        case "createCategory":
            setSpaceName("createCategory")
            break;

        case "createProduct":
            setSpaceName("createProduct")
            break;

        case "search":
            setIsSearchResults(true);
            break;
    }

    //état permettant de savoir si on doit afficher le modal de chargement ou pas
    const [displayLoadingModal, setDisplayLoadingModal] = useState(true);


    //fonction d'encodage des paramètres de connexion à l'API//
    function authenticateUser(user, password){
        var token = user + ":" + password;

        var hash = btoa(token); 

        return "Basic " + hash;
    }

    //fonction permettant de récupérer la liste des catégories//
    function getCategories(requestURL, tmpList){
        setDisplayLoadingModal(true)

        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
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
                }else{
                    setDisplayLoadingModal(false);
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
        request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
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
                    request2.setRequestHeader("Authorization", authenticateUser(userName, password)); 
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

    //fonction permettantt de récupérer la liste des conditionnements//
    function getConditionings(requestURL, tmpList){
        setDisplayLoadingModal(true)

        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
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
                
                setConditioningsList(tmpList)
                
                if(next != null){
                    tmpList = getConditionings(next, tmpList)

                }else{
                    setDisplayLoadingModal(false)
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
        request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
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
        setDisplayLoadingModal(true)

        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
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
                }else{
                    setDisplayLoadingModal(false);
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
        request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
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
                    request2.setRequestHeader("Authorization", authenticateUser(userName, password)); 
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
        setDisplayLoadingModal(true)

        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status

            if(requestStatus === 200){
                //tri de la liste récupérée dans l'ordre croissant
                tmpList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
    
                tmpList = tmpList.concat(response['results'])
                
                setProductsList(tmpList)
               
                var next = response['next']

                if(next){
                    tmpList = getProducts(next, tmpList)
                }else{
                    setDisplayLoadingModal(false);
                }
            }
        }   
    }

    //fonction permettant de récupérer les packagings
    function getPackagings(requestURL, tmpList){
        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
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

    //fonction permettantt de récupérer la liste des taxes//
    function getTaxes(requestURL, tmpList){
        setDisplayLoadingModal(true)

        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status
            console.log(response)
            
            if(requestStatus === 200){
                var next = response['next']
    
                tmpList = tmpList.concat(response['results'])
               
                setTaxesList(tmpList)


                if(next != null){
                    tmpList = getTaxes(next, tmpList)
                }else{
                    setDisplayLoadingModal(false);
                }
            }
        }
    }


    return(
        <div className="row flex-grow-1 contenu-small-screen">
            <div className="col-12 col-md-2 not-display-on-small-screens right-border">
                <Menu categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} getCategories={getCategories}

                conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeletCconditioning={setCanDeleteConditioning} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList} getConditionings={getConditionings}

                languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList} getLanguages={getLanguages}

                productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} productsCategories={productsCategories} setProductsCategories={setProductsCategories} getProducts={getProducts} getPackagings={getPackagings}

                taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList} getTaxes={getTaxes}

                links={links}

                userName={userName} password={password}

                displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} smallScreen={false}

                searching={searching} setSearching = {setSearching} isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults}

                displayLoadingModal={displayLoadingModal} setDisplayLoadingModal={setDisplayLoadingModal}

                spaceName={spaceName} setSpaceName={setSpaceName}
                />
            </div>

            <div className="col-12 col-md container-fluid workspace-div" style={{paddingTop:"10px"}}>
                <Router>
                    <Switch>
                        <Route path="/:spaceNameParam/:subSpaceNameParam?/:itemParam?/">
                        <Workspace findInCategories={findInCategories} findInConditionings={findInConditionings} findInLangues={findInLangues} findInProducts={findInProducts} findInTaxes={findInTaxes}

                        categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} getCategories={getCategories}

                        conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList} conditioningsResult={conditioningsResult} setConditioningsResult={setConditioningsResult} getConditionings={getConditionings}

                        languagesList={languagesList} setLanguagesList={setLanguagesList} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} languagesResult={languagesResult} setLanguagesResult={setLanguagesResult} getLanguages={getLanguages}

                        productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} productsResult={productsResult} setProductsResult={setProductsResult} getProducts={getProducts} getPackagings={getPackagings}

                        taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList} getTaxes={getTaxes}

                        links={links}

                        userName={userName} password={password}

                        spaceName={spaceName} setSpaceName={setSpaceName} spaceNameValues={spaceNameValues}
                        
                        displayLoadingModal={displayLoadingModal} setDisplayLoadingModal={setDisplayLoadingModal}

                        displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert}

                        listTypes={listTypes} listType={listType} setListType={setListType} 
                        
                        searching={searching} setSearching = {setSearching} isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults} searchResults={searchResults} setSearchResults={setSearchResults} advancedSearchResults={advancedSearchResults} setAdvancedSearchResults={setAdvancedSearchResults} handleSearch={handleSearch}
                        
                        stringToSearch={stringToSearch}
                        />
                    </Route>
                    </Switch>
                </Router>
            
            </div>
        </div>
       
    );
}

export default Contenu