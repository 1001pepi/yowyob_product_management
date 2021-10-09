import logo from '../assets/logo.png'

import SearchBar from './SearchBar'
import Langue from './Langue'
import Identity from './Identity'

import '../styles/Logo.css'
import '../styles/Banner.css'
import '../styles/smallDisplay.css'

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function Banner({findInCategories, findInConditionings, findInLanguages, findInProducts, findInTaxes,

    categoriesList, setCategoriesList, canDeleteCategory, setCanDeleteCategory, categoriesResult, setCategoriesResult, updateCategoriesList, setUpdateCategoriesList,

    conditioningsList, setConditioningsList, canDeleteConditioning, setCanDeleteConditioning, conditioningsResult, setConditioningsResult, updateConditioningsList, setUpdateConditioningsList,

    languagesList, setLanguagesList, canDeleteLanguage, setCanDeleteLanguage, languagesResult, setLanguagesResult, updateLanguagesList, setUpdateLanguagesList, 

    productsList, setProductsList, packagingsList, setPackagingsList, updatePackagings, setUpdatePackagings, canDeleteProduct, setCanDeleteProduct, productsResult, setProductsResult, productsCategories, setProductsCategories, updateProductsList, setUpdateProductsList,

    taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList,

    links,

    userName, password,

    displaySuccessAlert, setDisplaySuccessAlert,

    spaceName, setSpaceName, stringToSearch, setStringToSearch, searchType, setSearchType, searchResults, setSearchResults, advancedSearchResults, setAdvancedSearchResults,

    listTypes, listType, setListType, searching, setSearching, isSearchResults, setIsSearchResults
}){
    return(
        <div className="row banner">
            <div className="col not-display-on-small-screens">
                <a href="/"><img src={logo} alt="yowyob" className="logo"/></a>
            </div>

            <SearchBar  findInCategories={findInCategories} findInConditionings={findInConditionings} findInLanguages={findInLanguages} findInProducts={findInProducts} findInTaxes={findInTaxes} 

categoriesList={categoriesList} setCategoriesList={setCategoriesList}  updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList}  categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory}

conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList} conditioningsResult={conditioningsResult} setConditioningsResult={setConditioningsResult} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning}

languagesResult={languagesResult} setLanguagesResult={setLanguagesResult} languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList}

productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} productsResult={productsResult} setProductsResult={setProductsResult} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories}

            taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList}

displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert}

            links={links}

            userName={userName} password={password}

            listTypes={listTypes} listType={listType} setListType={setListType} searching={searching} setSearching = {setSearching} isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults} searchResults={searchResults} setSearchResults={setSearchResults} advancedSearchResults={advancedSearchResults} setAdvancedSearchResults={setAdvancedSearchResults}

setSpaceName={setSpaceName} stringToSearch={stringToSearch} setStringToSearch={setStringToSearch} searchType={searchType} setSearchType={setSearchType}
            />

            <Langue />

            <Identity />

        </div> 
    );
}

export default Banner