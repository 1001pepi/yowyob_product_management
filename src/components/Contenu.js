import '../styles/Contenu.css'

import Workspace from './Workspace'
import Menu from './Menu'

import {useState} from 'react'

function Contenu({findInCategories, findInConditionings, findInLangues, findInProducts, findInTaxes,

    categoriesList, setCategoriesList, canDeleteCategory, setCanDeleteCategory, categoriesResult, setCategoriesResult, updateCategoriesList, setUpdateCategoriesList,

    conditioningsList, setConditioningsList, canDeleteConditioning, setCanDeleteConditioning, conditioningsResult, setConditioningsResult, updateConditioningsList, setUpdateConditioningsList,

    languagesList, setLanguagesList, canDeleteLanguage, setCanDeleteLanguage, languagesResult, setLanguagesResult, updateLanguagesList, setUpdateLanguagesList, 

    productsList, setProductsList, packagingsList, setPackagingsList, updatePackagings, setUpdatePackagings, canDeleteProduct, setCanDeleteProduct, productsResult, setProductsResult, productsCategories, setProductsCategories, updateProductsList, setUpdateProductsList,

    spaceName, setSpaceName, stringToSearch,   taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList
}){
    
    //etat pour l'affichage de l'alerte de confirmation de l'ajout d'une catégorie
    const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false)

    return(
        <div className="row flex-grow-1">
            <Menu categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList}

            conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeletCconditioning={setCanDeleteConditioning} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList}

            languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList}

            productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} productsCategories={productsCategories} setProductsCategories={setProductsCategories}

            displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert}

             taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList}   spaceName={spaceName} setSpaceName={setSpaceName}
            />

            <div className="col container workspace-div">
                <Workspace findInCategories={findInCategories} findInConditionings={findInConditionings} findInLangues={findInLangues} findInProducts={findInProducts} findInTaxes={findInTaxes}

                categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult}

                conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList} conditioningsResult={conditioningsResult} setConditioningsResult={setConditioningsResult}

                languagesList={languagesList} setLanguagesList={setLanguagesList} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} languagesResult={languagesResult} setLanguagesResult={setLanguagesResult}

                productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} productsResult={productsResult} setProductsResult={setProductsResult}

                spaceName={spaceName} setSpaceName={setSpaceName} displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert}
                
                
                 taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList} 
                    
                stringToSearch={stringToSearch}
                />
            </div>
        </div>
    );
}

export default Contenu