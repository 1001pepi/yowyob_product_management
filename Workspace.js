import CreateCategoryForm from './CreateCategoryForm'
import CreateProductForm from './CreateProductForm'
import List from './List'
import Details from './Details'
import SearchResults from './SearchResults'

import {useState} from 'react'

function Workspace({findInCategories, findInConditionnements, findInLangues, findInProducts, findInTaxes, spaceName, setSpaceName, displaySuccessAlert, setDisplaySuccessAlert, categoriesList, setCategoriesList, productsList, setProductsList, taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList, updateCategoriesList, setUpdateCategoriesList, updateLanguagesList, setUpdateLanguagesList, languagesList, setLanguagesList, stringToSearch, categoriesResult, setCategoriesResult}){
 
    //etat définissant le type d'élément à afficher dans la fenêtre des détails
     const [itemType, setItemType] = useState('')

    //etat contenant l'élément à afficher dans détails
    const [item, setItem] = useState({})

    //etat indiquant si on doit charger les formulaires pour un update ou pas
    const [update, setUpdate] = useState(false)

    //etat contenant l'élément à update dans le cas d'une mise à jour
    const [itemToUpdate, setItemToUpdate] = useState({})

    //etat indiquant si l'élément à afficher en détails est le résutat d'une recherche
    const [isASearchResult, setIsASearchResult] = useState(false)

    switch(spaceName){
        case 'createCategory':
            //tri de la liste des catégories dans l'ordre croissant
            categoriesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

            //tri des langues dans l'odre croissant
            languagesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

            return(
                    <CreateCategoryForm setSpaceName={setSpaceName} setDisplaySuccessAlert={setDisplaySuccessAlert} categoriesList={categoriesList} setCategoriesList={setCategoriesList} languagesList={languagesList} setLanguagesList={setLanguagesList} update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate}/>
            );
            break;

        case 'listCategories':
            return(
                <List listType={"categories"} displaySuccessAlert={displaySuccessAlert}
                    data={categoriesList} setData={setCategoriesList}
                    spaceName={spaceName} setSpaceName={setSpaceName}
                    itemType={itemType} setItemType={setItemType}
                    item={item} setItem={setItem} update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate}
                />
            );
            break;

        case 'listLanguages':
            return(
                <List listType={"languages"} displaySuccessAlert={displaySuccessAlert}
                data={languagesList} setData={setLanguagesList}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType}
                item={item} setItem={setItem}
            />
            );
            break;

        case 'listProducts':
            return(
                <List listType={"products"} displaySuccessAlert={displaySuccessAlert}
                    data={productsList} setData={setProductsList}
                    spaceName={spaceName} setSpaceName={setSpaceName}
                    itemType={itemType} setItemType={setItemType}
                    item={item} setItem={setItem} update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate}
                />
            );
            break;

        case 'createProduct':
             //tri de la liste des produits dans l'ordre croissant
             productsList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

             //tri des langues dans l'odre croissant
             languagesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
            return(
                    <CreateProductForm setSpaceName={setSpaceName} setDisplaySuccessAlert={setDisplaySuccessAlert}
                        productsList={productsList} setProductsList={setProductsList}
                    />
            );
            break;

        case 'listTaxes':
            return(
                <List listType={"taxes"} displaySuccessAlert={displaySuccessAlert}
                data={taxesList} setData={setTaxesList}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType}
                item={item} setItem={setItem}
            />
            );
            break;

        case 'details':
            switch(itemType){
                case 'categories':
                    return(
                        <Details itemType={itemType} item={item} setItem={setItem} data={categoriesList} setData={setCategoriesList} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult}/>
                    );
                    case 'products':
                        return(
                            <Details itemType={itemType} item={item} setItem={setItem} data={productsList} setData={setProductsList} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult}/>
                        );
            }
           
            break;

        case 'searchResults':
            return(
                <SearchResults findInCategories={findInCategories} findInConditionnements={findInConditionnements} findInLangues={findInLangues} findInProducts={findInProducts} findInTaxes={findInTaxes} stringToSearch={stringToSearch} item={item} setItem={setItem} spaceName={spaceName} setSpaceName={setSpaceName} itemType={itemType} setItemType={setItemType} categoriesList={categoriesList} setCategoriesList={setCategoriesList} upadateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult}/>
            );
    }

   return null
}

export default Workspace