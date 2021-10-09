import CreateCategoryForm from './CreateCategoryForm'
import CreateConditioningForm from './CreateConditioningForm'
import CreateLanguageForm from './CreateLanguageForm'
import CreateProductForm from './CreateProductForm'
import CreateTaxation from './CreateTaxation'
import List from './List'
import Details from './Details'
import SearchResults from './SearchResults'

import {useState} from 'react'
import React, {useEffect} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
  } from "react-router-dom";

function Workspace({findInCategories, findInConditionings, findInLanguages, findInProducts, findInTaxes,
    
    categoriesList, setCategoriesList,  canDeleteCategory, setCanDeleteCategory, updateCategoriesList, setUpdateCategoriesList, categoriesResult, setCategoriesResult, getCategories,

    conditioningsList, setConditioningsList, canDeleteConditioning, setCanDeleteConditioning, updateConditioningsList, setUpdateConditioningsList, conditioningResult, setConditioningResult, getConditionings,

    languagesList, setLanguagesList, canDeleteLanguage, setCanDeleteLanguage, updateLanguagesList, setUpdateLanguagesList, languagesResult, setLanguagesResult, getLanguages,

    productsList, setProductsList, packagingsList, setPackagingsList,  productsCategories, setProductsCategories, updateProductsList, setUpdateProductsList, canDeleteProduct, setCanDeleteProduct, productsResult, setProductsResult, getProducts, getPackagings,

    taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList, getTaxes,

    links,

    userName, password,
    
    spaceName, setSpaceName, spaceNameValues,
    
    displayLoadingModal, setDisplayLoadingModal,
    
    displaySuccessAlert, setDisplaySuccessAlert,

    listTypes, listType, setListType, 
    
    searching, setSearching, isSearchResults, setIsSearchResults, searchResults, setSearchResults, advancedSearchResults, setAdvancedSearchResults, handleSearch,
    
   
    
    stringToSearch
}){

    //etat définissant le type d'élément à afficher dans la fenêtre des détails
    const [itemType, setItemType] = useState('')

    //etat indiquant si on doit charger les formulaires pour un update ou pas
    const [update, setUpdate] = useState(false)

    //etat contenant l'élément à update dans le cas d'une mise à jour
    const [itemToUpdate, setItemToUpdate] = useState({})

    //etat indiquant si l'élément à afficher en détails est le résutat d'une recherche
    const [isASearchResult, setIsASearchResult] = useState(false)

    //état permettant d'indiquer si l'update vient de la liste ou du détail pour savoir où aller lorsqu'on clique sur la flèche de retour
    const [updateFromDetails, setUpdateFromDetails] = useState(false)

    //état définissant l'élément à afficher
    const [item, setItem] = useState({});

    //récupérer l'élément à afficher
    let{spaceNameParam, itemParam} = useParams();

    //fonction d'encodage des paramètres de connexion à l'API//
    function authenticateUser(user, password){
        var token = user + ":" + password;

        var hash = btoa(token); 

        return "Basic " + hash;
    }

    //fonction permettant de récupérer l'élément à afficher au niveau de l'API
    function getItem(requestURL){
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
                if(!item['id']) setItem(response);
            }
        }
    }

    //fonction permettant de récupérer l'élément à mettre à jour au niveau de l'API
    function getItemToUpdate(requestURL){
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
                
                if(!itemToUpdate['id']) setItemToUpdate(response)
                setUpdate(true)
            }
        }
    }

    switch(spaceName){
        case spaceNameValues.listCategories:
    
            if(updateLanguagesList){
                getLanguages(links.languagesRequestURL, [])
                setUpdateLanguagesList(false)
            }
            if(updateCategoriesList){
                getCategories(links.categoriesRequestURL, [])
                setUpdateCategoriesList(false)
            }else{

                //tri de la liste des catégories dans l'ordre croissant
                categoriesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
            }

            setListType(listTypes.categories);

            return(
                <List  data={searching? searchResults : (isSearchResults ? advancedSearchResults : categoriesList)} setData={searching? setSearchResults : (isSearchResults? setAdvancedSearchResults : setCategoriesList)} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory}
                listType={listTypes.categories}
                displaySuccessAlert={displaySuccessAlert}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType} item={item} setItem={setItem}
                update={update} setUpdate={setUpdate} 
                itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                links={links}

                userName={userName} password={password}

                displayLoadingModal={displayLoadingModal} setDisplayLoadingModal={setDisplayLoadingModal}

                searching={searching} setSearching={setSearching} isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults} handleSearch={handleSearch}

                getCategories={getCategories}
                />
            );
            break;
            
        case 'createCategory':
            //construction de la requête pour récupérer la catégorie à mettre à jour au niveau de l'API à partir de son id
            if(itemParam){
                var requestURL = links[spaceNameParam+"RequestURL"] + itemParam + "/"
                getItemToUpdate(requestURL)
            }

            //tri de la liste des catégories dans l'ordre croissant
            categoriesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

            //tri des langues dans l'odre croissant
            languagesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

            return(
                    <CreateCategoryForm setSpaceName={setSpaceName} setDisplaySuccessAlert={setDisplaySuccessAlert} categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} languagesList={languagesList} setLanguagesList={setLanguagesList} update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}
                    
                    links={links}

                    userName={userName} password={password}
                    />
            );
            break;

        case 'listConditionings':

            if(updateConditioningsList){
                getConditionings(links.conditioningsRequestURL, [])
                setUpdateConditioningsList(false)
            }else{
                //tri des conditionnements dans l'odre croissant
                conditioningsList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
            }

            setListType(listTypes.conditionings);

            return(
                <List data={searching? searchResults : conditioningsList} setData={searching ? setSearchResults : setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning}
                listType={listTypes.conditionings} 
                displaySuccessAlert={displaySuccessAlert}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType} item={item} setItem={setItem}
                update={update} setUpdate={setUpdate} 
                itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                links={links}

                userName={userName} password={password}

                isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults}

                displayLoadingModal={displayLoadingModal} setDisplayLoadingModal={setDisplayLoadingModal}

                getConditionings={getConditionings}
            />
            );
            break;

        case 'createConditioning':
            return(
                <CreateConditioningForm setSpaceName={setSpaceName} setDisplaySuccessAlert={setDisplaySuccessAlert} conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning} update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                links={links}

                userName={userName} password={password}
                /> 
            );
            break;
        
        case 'listLanguages':
            if(updateLanguagesList){
                getLanguages(links.languagesRequestURL, [])
                setUpdateLanguagesList(false)

            }else{
                 //tri des langues dans l'odre croissant
                languagesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
            }

            setListType(listTypes.languages);

            return(
                <List data={searching? searchResults : languagesList} setData={searching ? setSearchResults : setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage}
                listType={listTypes.languages} 
                displaySuccessAlert={displaySuccessAlert}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType} item={item} setItem={setItem}
                update={update} setUpdate={setUpdate} 
                itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                links={links}

                userName={userName} password={password}

                isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults}

                displayLoadingModal={displayLoadingModal} setDisplayLoadingModal={setDisplayLoadingModal}

                getLanguages={getLanguages}
            />
            );
            break;
        
        case 'createLanguage': 
            return(
                <CreateLanguageForm languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} setSpaceName={setSpaceName} setDisplaySuccessAlert={setDisplaySuccessAlert}  update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate}
                
                links={links}

                userName={userName} password={password}
                />
            );
            break;
        

        case 'listProducts':
            if(updateLanguagesList){
                getLanguages(links.languagesRequestURL, [])
                setUpdateLanguagesList(false)
            }
            if(updateCategoriesList){
                getCategories(links.categoriesRequestURL, [])
                setUpdateCategoriesList(false)
            }
            if(updateConditioningsList){
                getConditionings(links.conditioningsRequestURL, [])
                setUpdateConditioningsList(false)
            }
            if(updateProductsList){
                getProducts(links.productsRequestURL, [])
                setUpdateProductsList(false)
            }else{
                //tri de la liste des catégories dans l'ordre croissant
                productsList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
            }

            setListType(listTypes.products);

            return(
                <List listType={listTypes.products} displaySuccessAlert={displaySuccessAlert} data={searching? searchResults : (isSearchResults ? advancedSearchResults : productsList)}
                setData={searching ? setSearchResults : (isSearchResults ? setAdvancedSearchResults : setProductsList)} categoriesList={categoriesList}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType} item={item} setItem={setItem}
                update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                links={links}

                userName={userName} password={password}

                searching={searching} setSearching={setSearching} isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults}

                packagingsList={packagingsList} setPackagingsList={setPackagingsList}

                searching={searching} setSearching={setSearching} isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults} handleSearch={handleSearch}

                displayLoadingModal={displayLoadingModal} setDisplayLoadingModal={setDisplayLoadingModal}

                getProducts={getProducts} getPackagings={getPackagings}
                />
            );
            break;

        case 'createProduct':
            //tri de la liste des catégories dans l'ordre croissant
            categoriesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

            //tri des conditionnements dans l'odre croissant
            conditioningsList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

            return(
                    <CreateProductForm setSpaceName={setSpaceName} setDisplaySuccessAlert={setDisplaySuccessAlert}
                    categoriesList={categoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory}
                    conditioningsList={conditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning}
                    languagesList={languagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage}
                    productsList={productsList} setProducsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories}
                    update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                    links={links}

                    userName={userName} password={password}
                    />
            );
            break;

        case 'listTaxes':

            setListType(listTypes.taxes);

            return(
                <List listType={listTypes.taxes} displaySuccessAlert={displaySuccessAlert}
                data={searching? searchResults : taxesList} setData={searching ? setSearchResults : setTaxesList}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType} item={item} setItem={setItem}
                updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults}

                searching={searching} setSearching={setSearching} isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults}

                displayLoadingModal={displayLoadingModal} setDisplayLoadingModal={setDisplayLoadingModal}

                getTaxes={getTaxes}

                links={links}
            />
            );
            break;

        case 'createTaxation':
                return(
                    <CreateTaxation setSpaceName={setSpaceName} setDisplaySuccessAlert={setDisplaySuccessAlert} update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}
                    />
            );
            break;

        case 'details':
            //construction de la requête pour récupérer l'élément à afficher au niveau de l'API à partir de son id
            var requestURL = links[spaceNameParam+"RequestURL"] + itemParam + "/"
            getItem(requestURL)

            switch(spaceNameParam){
                case 'categories':
                    return(
                        <Details itemType={spaceNameParam} item={item} setItem={setItem} data={categoriesList} setData={setCategoriesList} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult} spaceName={spaceName} setSpaceName={setSpaceName} languagesList={languagesList} displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} canDeleteItem={canDeleteCategory} setUpdate={setUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}
                        
                        links={links}

                        userName={userName} password={password}
                        />
                    );
                    break

                case 'conditionings':
                    return(
                        <Details item={item} setItem={setItem} itemType={spaceNameParam} setItemType={setItemType} data={conditioningsList} setData={setConditioningsList} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult} spaceName={spaceName} setSpaceName={setSpaceName} languagesList={languagesList} displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} canDeleteItem={canDeleteConditioning} setUpdate={setUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails} packagingsList={packagingsList} setPackagingsList={setPackagingsList}
                        
                        userName={userName} password={password}
                        />
                    );
                    break
                
                case 'products':
                    return(
                        <Details item={item} setItem={setItem} itemType={spaceNameParam} setItemType={setItemType} data={productsList} setData={setProductsList} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult} spaceName={spaceName} setSpaceName={setSpaceName} languagesList={languagesList} displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} canDeleteItem={new Map()} setUpdate={setUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails} packagingsList={packagingsList} setPackagingsList={setPackagingsList} productsCategories={productsCategories}
                        
                        userName={userName} password={password}
                        />
                    );
                    break;
                
            }
           
            break;

        case 'searchResults':
            return(
                <SearchResults findInCategories={findInCategories} findInConditionings={findInConditionings} findInLanguages={findInLanguages} findInProducts={findInProducts} findInTaxes={findInTaxes} stringToSearch={stringToSearch} spaceName={spaceName} setSpaceName={setSpaceName} itemType={itemType} setItemType={setItemType} categoriesList={categoriesList} setCategoriesList={setCategoriesList} upadateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult}/>
            );
    }

   return null
}

export default Workspace