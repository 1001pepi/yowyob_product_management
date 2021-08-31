import '../styles/Contenu.css'
import '../styles/bigDisplay.css'
import '../styles/smallDisplay.css'

import Workspace from './Workspace'
import Menu from './Menu'

function Contenu({findInCategories, findInConditionings, findInLangues, findInProducts, findInTaxes,

    categoriesList, setCategoriesList, canDeleteCategory, setCanDeleteCategory, categoriesResult, setCategoriesResult, updateCategoriesList, setUpdateCategoriesList,

    conditioningsList, setConditioningsList, canDeleteConditioning, setCanDeleteConditioning, conditioningsResult, setConditioningsResult, updateConditioningsList, setUpdateConditioningsList,

    languagesList, setLanguagesList, canDeleteLanguage, setCanDeleteLanguage, languagesResult, setLanguagesResult, updateLanguagesList, setUpdateLanguagesList, 

    productsList, setProductsList, packagingsList, setPackagingsList, updatePackagings, setUpdatePackagings, canDeleteProduct, setCanDeleteProduct, productsResult, setProductsResult, productsCategories, setProductsCategories, updateProductsList, setUpdateProductsList,

    taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList,

    categoriesRequestURL, categoriesDescriptionsRequestURL, conditioningsRequestURL, languagesRequestURL, productsRequestURL, packagingsRequestURL, productsDetailsRequestURL, productsDescriptionsRequestURL,  productsPackaginsRequestURL, productsIllustrationsRequestURL,

    userName, passWord,

    displaySuccessAlert, setDisplaySuccessAlert,

    listTypes, listType, setListType, searching, setSearching, searchResults, setSearchResults,

    spaceName, setSpaceName, stringToSearch 
}){
    
    return(
        <div className="row flex-grow-1 contenu-small-screen">
            
            <div className="col-12 col-md-2 not-display-on-small-screens">
                <Menu categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList}

                conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeletCconditioning={setCanDeleteConditioning} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList}

                languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList}

                productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} productsCategories={productsCategories} setProductsCategories={setProductsCategories}

                categoriesRequestURL={categoriesRequestURL} conditioningsRequestURL={conditioningsRequestURL} languagesRequestURL={languagesRequestURL} productsRequestURL={productsRequestURL} packagingsRequestURL={packagingsRequestURL}

                userName={userName} passWord={passWord}

                displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} smallScreen={false}

                searching={searching} setSearching = {setSearching}

                taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList}   spaceName={spaceName} setSpaceName={setSpaceName}
                />
            </div>

            <div className="col-12 col-md container-fluid workspace-div">
                <Workspace findInCategories={findInCategories} findInConditionings={findInConditionings} findInLangues={findInLangues} findInProducts={findInProducts} findInTaxes={findInTaxes}

                categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult}

                conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList} conditioningsResult={conditioningsResult} setConditioningsResult={setConditioningsResult}

                languagesList={languagesList} setLanguagesList={setLanguagesList} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} languagesResult={languagesResult} setLanguagesResult={setLanguagesResult}

                productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} productsResult={productsResult} setProductsResult={setProductsResult}

                taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList}

                categoriesRequestURL={categoriesRequestURL} categoriesDescriptionsRequestURL={categoriesDescriptionsRequestURL} conditioningsRequestURL={conditioningsRequestURL} languagesRequestURL={languagesRequestURL} productsRequestURL={productsRequestURL} packagingsRequestURL={packagingsRequestURL} productsDetailsRequestURL={productsDetailsRequestURL} productsDescriptionsRequestURL={productsDescriptionsRequestURL} productsPackaginsRequestURL={productsPackaginsRequestURL} productsIllustrationsRequestURL={productsIllustrationsRequestURL}

                userName={userName} passWord={passWord}

                spaceName={spaceName} setSpaceName={setSpaceName} displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert}

                listTypes={listTypes} listType={listType} setListType={setListType} searching={searching} setSearching = {setSearching} searchResults={searchResults} setSearchResults={setSearchResults}
                
                  
                    
                stringToSearch={stringToSearch}
                />
            </div>
        </div>
    );
}

export default Contenu