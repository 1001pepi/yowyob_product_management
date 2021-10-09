import '../styles/Menu.css'
import '../styles/smallDisplay.css'

import React, {Fragment, useState} from 'react'
import { useHistory } from "react-router-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
  } from "react-router-dom";

function Menu({categoriesList, setCategoriesList, canDeleteCategory, setCanDeleteCategory, updateCategoriesList, setUpdateCategoriesList, getCategories,

    conditioningsList, setConditioningsList, canDeleteConditioning, setCanDeletCconditioning, updateConditioningsList, setUpdateConditioningsList, getConditionings,

    languagesList, setLanguagesList, canDeleteLanguage, setCanDeleteLanguage, updateLanguagesList, setUpdateLanguagesList, getLanguages,

    productsList, setProductsList,updateProductsList, setUpdateProductsList, updatePackagings, setUpdatePackagings, canDeleteProduct, setCanDeleteProduct, packagingsList, setPackagingsList, getProducts, getPackagings,

    taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList, getTaxes,

    links,

    userName, password,
    
    displaySuccessAlert, setDisplaySuccessAlert, smallScreen,

    searching, setSearching, isSearchResults, setIsSearchResults,

    displayLoadingModal, setDisplayLoadingModal,
    
    spaceName, setSpaceName
}){   
    //state to force update
    const [forceUpdate, setForceUpdate] = useState(0);

    //informations utiles pour le routage
    const history = useHistory();

    //fonction d'encodage des paramètres de connexion à l'API//
    function authenticateUser(user, password){
        var token = user + ":" + password;

        var hash = btoa(token); 

        return "Basic " + hash;
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

    return(
        <Fragment>
            <div className="row d-flex justify-content-left"
                style={{marginBottom:"15px", marginTop:"15px"}}>
            
                <button className="col-12 menu-button" id="button-0" onClick={(event) => {
                    if(updateLanguagesList){
                        getLanguages(links.languagesRequestURL, [])
                        setUpdateLanguagesList(false)
                    }
                    if(updateCategoriesList){
                        getCategories(links.categoriesRequestURL, [])
                        setUpdateCategoriesList(false)
                        
                    }
                    
                    
                    setSearching(false)
                    setIsSearchResults(false)
                    setDisplaySuccessAlert(false)

                    history.push(`/categories`);
                    history.push(`/categories`);
                    history.goBack();

                    closeNav();

                    }}><i className="fa fa-list-ul link-item" ></i> Catégories
                </button>
            </div>

            <div className="row d-flex justify-content-left" 
                style={{marginBottom:"15px", marginTop:"15px"}}>
            
                <button className="col-12 menu-button" id="button-1" onClick={(event) => {
                    if(updateConditioningsList){
                        getConditionings(links.conditioningsRequestURL, [])
                        setUpdateConditioningsList(false)
                    }
                    if(updatePackagings){
                        getPackagings(links.packagingsRequestURL, [])
                        setUpdatePackagings(false)
                    }

                    setSearching(false)
                    setIsSearchResults(false)
                    setDisplaySuccessAlert(false)

                    history.push(`/conditionings`);
                    history.push(`/conditionings`);
                    history.goBack();

                    closeNav();

                    }}><i className="fa fa-product-hunt link-item" ></i> Conditionnements
                </button>
            </div>

            <div className="row d-flex justify-content-left" 
                style={{marginBottom:"15px", marginTop:"15px"}}>
            
                <button className="col-12 menu-button" id="button-2" onClick={(event) => {
                        if(updateLanguagesList){
                            getLanguages(links.languagesRequestURL, [])
                            setUpdateLanguagesList(false)
                        }

                        setSearching(false)
                        setIsSearchResults(false)
                        setDisplaySuccessAlert(false)

                        history.push(`/languages`);
                        history.push(`/languages`);
                        history.goBack();
                        
                        closeNav();
                        }}><i className="fa fa-language link-item" ></i> Langues
                </button>
            </div>

            <div className="row d-flex justify-content-left" 
                style={{marginBottom:"15px", marginTop:"15px"}}>
            
                <button className="col-12 menu-button" id="button-3" onClick={(event) => {
                        if(updateLanguagesList){
                            getLanguages(links.languagesRequestURL, [])
                            setUpdateLanguagesList(false)
                        }
                        if(updateCategoriesList){
                            getCategories(links.categoriesRequestURL, [])
                            setUpdateCategoriesList(false)
                        }
                        if(updatePackagings){
                            getPackagings(links.packagingsRequestURL, [])
                            setUpdatePackagings(false)
                        }
                        if(updateProductsList){
                            getProducts(links.productsRequestURL, [])
                            setUpdateProductsList(false)
                        }

                        setSearching(false)
                        setIsSearchResults(false)
                        setDisplaySuccessAlert(false)

                        history.push(`/products`);
                        history.push(`/products`);
                        history.goBack();
                        
                        closeNav();
                    }}><i className="fa fa-product-hunt link-item" ></i> Produits
                </button>
            </div>

            <div className="row d-flex justify-content-left" 
                style={{marginBottom:"15px", marginTop:"15px"}}>
            
                <button className="col-12 menu-button" id="button-4" onClick={(event) => {
                        if(updateTaxesList){
                            getTaxes(links.taxesRequestURL, [])
                            setUpdateTaxesList(false)
                        }
                        
                        setSearching(false)
                        setIsSearchResults(false)
                        setDisplaySuccessAlert(false)
                        
                        history.push(`/taxes`);
                        history.push(`/taxes`);
                        history.goBack();

                        closeNav();
                    }}><i className="fa fa-money link-item" ></i> Taxes
                </button>
            </div>
        </Fragment>
    );
}

export default Menu

