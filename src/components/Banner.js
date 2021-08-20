import logo from '../assets/logo.png'

import SearchBar from './SearchBar'
import Langue from './Langue'
import Identity from './Identity'

import '../styles/Logo.css'
import '../styles/Banner.css'
import '../styles/smallDisplay.css'

function Banner({findInCategories, findInConditionings, findInLanguages, findInProducts, findInTaxes,

    categoriesList, setCategoriesList, canDeleteCategory, setCanDeleteCategory, categoriesResult, setCategoriesResult, updateCategoriesList, setUpdateCategoriesList,

    conditioningsList, setConditioningsList, canDeleteConditioning, setCanDeleteConditioning, conditioningsResult, setConditioningsResult, updateConditioningsList, setUpdateConditioningsList,

    languagesList, setLanguagesList, canDeleteLanguage, setCanDeleteLanguage, languagesResult, setLanguagesResult, updateLanguagesList, setUpdateLanguagesList, 

    productsList, setProductsList, packagingsList, setPackagingsList, updatePackagings, setUpdatePackagings, canDeleteProduct, setCanDeleteProduct, productsResult, setProductsResult, productsCategories, setProductsCategories, updateProductsList, setUpdateProductsList,

    displaySuccessAlert, setDisplaySuccessAlert,

    spaceName, setSpaceName, stringToSearch,   taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList,  setStringToSearch, searchType, setSearchType
}){
    return(
        <div className="row banner">
            <div className="col not-display-on-small-screens">
                <a className="navbar-brand" href="..."><img src={logo} alt="yowyob" className="logo"/></a>
            </div>

            <SearchBar  findInCategories={findInCategories} findInConditionings={findInConditionings} findInLanguages={findInLanguages} findInProducts={findInProducts} findInTaxes={findInTaxes} 

categoriesList={categoriesList} setCategoriesList={setCategoriesList}  updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList}  categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory}

conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList} conditioningsResult={conditioningsResult} setConditioningsResult={setConditioningsResult} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning}

languagesResult={languagesResult} setLanguagesResult={setLanguagesResult} languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList}

productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} productsResult={productsResult} setProductsResult={setProductsResult} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories}

displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert}

setSpaceName={setSpaceName} stringToSearch={stringToSearch} setStringToSearch={setStringToSearch} searchType={searchType} setSearchType={setSearchType}
            />

            <Langue />

            <Identity />

        </div> 
    );
}

export default Banner