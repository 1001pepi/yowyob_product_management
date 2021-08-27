import CreateCategoryForm from './CreateCategoryForm'
import CreateConditioningForm from './CreateConditioningForm'
import CreateLanguageForm from './CreateLanguageForm'
import CreateProductForm from './CreateProductForm'
import List from './List'
import Details from './Details'
import SearchResults from './SearchResults'

import {useState} from 'react'

function Workspace({findInCategories, findInConditionings, findInLanguages, findInProducts, findInTaxes,
    
    categoriesList, setCategoriesList,  canDeleteCategory, setCanDeleteCategory, updateCategoriesList, setUpdateCategoriesList, categoriesResult, setCategoriesResult,

    conditioningsList, setConditioningsList, canDeleteConditioning, setCanDeleteConditioning, updateConditioningsList, setUpdateConditioningsList, conditioningResult, setConditioningResult,

    languagesList, setLanguagesList, canDeleteLanguage, setCanDeleteLanguage, updateLanguagesList, setUpdateLanguagesList, languagesResult, setLanguagesResult,

    productsList, setProductsList, packagingsList, setPackagingsList,  productsCategories, setProductsCategories, updateProductsList, setUpdateProductsList, canDeleteProduct, setCanDeleteProduct, productsResult, setProductsResult,

    categoriesRequestURL, categoriesDescriptionsRequestURL, conditioningsRequestURL, languagesRequestURL, productsRequestURL, packagingsRequestURL, productsDetailsRequestURL, productsDescriptionsRequestURL,  productsPackaginsRequestURL, productsIllustrationsRequestURL,

    userName, passWord,
    
    spaceName, setSpaceName, displaySuccessAlert, setDisplaySuccessAlert,
    
   
    taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList,
    stringToSearch
}){

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

    //état permettant d'indiquer si l'update vient de la liste ou du détail pour savoir où aller lorsqu'on clique sur la flèche de retour
    const [updateFromDetails, setUpdateFromDetails] = useState(false)

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
                //tri de la liste récupérée dans l'ordre croissant
                tmpList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
    
                tmpList = tmpList.concat(response['results'])
                
                setProductsList(tmpList)
               
                var next = response['next']

                if(next){
                    tmpList = getProducts(next, tmpList)
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

    switch(spaceName){
        case 'listCategories':
            if(updateLanguagesList){
                getLanguages(languagesRequestURL, [])
                setUpdateLanguagesList(false)
            }
            if(updateCategoriesList){
                getCategories(categoriesRequestURL, [])
                setUpdateCategoriesList(false)
            }else{

                //tri de la liste des catégories dans l'ordre croissant
                categoriesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
            }

            return(
                <List  data={categoriesList} setData={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory}
                listType={"categories"} 
                displaySuccessAlert={displaySuccessAlert}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType}
                item={item} setItem={setItem} 
                update={update} setUpdate={setUpdate} 
                itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                categoriesRequestURL={categoriesRequestURL} conditioningsRequestURL={conditioningsRequestURL} languagesRequestURL={languagesRequestURL} productsRequestURL={productsRequestURL}

                userName={userName} passWord={passWord}
                />
            );
            break;
            
        case 'createCategory':
            //tri de la liste des catégories dans l'ordre croissant
            categoriesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

            //tri des langues dans l'odre croissant
            languagesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

            return(
                    <CreateCategoryForm setSpaceName={setSpaceName} setDisplaySuccessAlert={setDisplaySuccessAlert} categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} languagesList={languagesList} setLanguagesList={setLanguagesList} update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails} item={item} setItem={setItem}
                    
                    categoriesDescriptionsRequestURL={categoriesDescriptionsRequestURL} categoriesRequestURL={categoriesRequestURL}

                    userName={userName} passWord={passWord}
                    />
            );
            break;

        case 'listConditionings':
            if(updateConditioningsList){
                getConditionings(conditioningsRequestURL, [])
                setUpdateConditioningsList(false)
            }else{
                //tri des conditionnements dans l'odre croissant
                conditioningsList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
            }

            return(
                <List data={conditioningsList} setData={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning}
                listType={"conditionings"} 
                displaySuccessAlert={displaySuccessAlert}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType}
                item={item} setItem={setItem} 
                update={update} setUpdate={setUpdate} 
                itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                categoriesRequestURL={categoriesRequestURL} conditioningsRequestURL={conditioningsRequestURL} languagesRequestURL={languagesRequestURL} productsRequestURL={productsRequestURL}

                userName={userName} passWord={passWord}
            />
            );
            break;

        case 'createConditioning':
            return(
                <CreateConditioningForm setSpaceName={setSpaceName} setDisplaySuccessAlert={setDisplaySuccessAlert} conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning} update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails} item={item} setItem={setItem}

                conditioningsRequestURL={conditioningsRequestURL}

                userName={userName} passWord={passWord}
                /> 
            );
            break;
        
        case 'listLanguages':
            if(updateLanguagesList){
                getLanguages(languagesRequestURL, [])
                setUpdateLanguagesList(false)

            }else{
                 //tri des langues dans l'odre croissant
                languagesList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
            }

            return(
                <List data={languagesList} setData={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage}
                listType={"languages"} 
                displaySuccessAlert={displaySuccessAlert}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType}
                item={item} setItem={setItem} 
                update={update} setUpdate={setUpdate} 
                itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                categoriesRequestURL={categoriesRequestURL} conditioningsRequestURL={conditioningsRequestURL} languagesRequestURL={languagesRequestURL} productsRequestURL={productsRequestURL}

                userName={userName} passWord={passWord}
            />
            );
            break;
        
        case 'createLanguage': 
            return(
                <CreateLanguageForm languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} setSpaceName={setSpaceName} setDisplaySuccessAlert={setDisplaySuccessAlert}  update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate}
                
                languagesRequestURL={languagesRequestURL}

                userName={userName} passWord={passWord}
                />
            );
            break;
        

        case 'listProducts':
            if(updateLanguagesList){
                getLanguages(languagesRequestURL, [])
                setUpdateLanguagesList(false)
            }
            if(updateCategoriesList){
                getCategories(categoriesRequestURL, [])
                setUpdateCategoriesList(false)
            }
            if(updateConditioningsList){
                getConditionings(conditioningsRequestURL, [])
                setUpdateConditioningsList(false)
            }
            if(updateProductsList){
                getProducts(productsRequestURL, [])
                setUpdateProductsList(false)
            }else{
                //tri de la liste des catégories dans l'ordre croissant
                productsList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))
            }

            return(
                <List listType={"products"} displaySuccessAlert={displaySuccessAlert}
                data={productsList} setData={setProductsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories}
                spaceName={spaceName} setSpaceName={setSpaceName}
                itemType={itemType} setItemType={setItemType}
                item={item} setItem={setItem} update={update} setUpdate={setUpdate} itemToUpdate={itemToUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}

                categoriesRequestURL={categoriesRequestURL} conditioningsRequestURL={conditioningsRequestURL} languagesRequestURL={languagesRequestURL} productsRequestURL={productsRequestURL} packagingsRequestURL={packagingsRequestURL}

                userName={userName} passWord={passWord}

                packagingsList={packagingsList} setPackagingsList={setPackagingsList}
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

                    productsRequestURL={productsRequestURL} productsDetailsRequestURL={productsDetailsRequestURL} productsDescriptionsRequestURL={productsDescriptionsRequestURL} productsPackaginsRequestURL={productsPackaginsRequestURL} productsIllustrationsRequestURL={productsIllustrationsRequestURL}

                    userName={userName} passWord={passWord}
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
                        <Details itemType={itemType} setItemType={setItemType} item={item} setItem={setItem} data={categoriesList} setData={setCategoriesList} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult} spaceName={spaceName} setSpaceName={setSpaceName} languagesList={languagesList} displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} canDeleteItem={canDeleteCategory} setUpdate={setUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails}
                        
                        categoriesRequestURL={categoriesRequestURL}

                        userName={userName} passWord={passWord}
                        />
                    );
                    break

                case 'conditionings':
                    return(
                        <Details itemType={itemType} setItemType={setItemType} item={item} setItem={setItem} data={conditioningsList} setData={setConditioningsList} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult} spaceName={spaceName} setSpaceName={setSpaceName} languagesList={languagesList} displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} canDeleteItem={canDeleteConditioning} setUpdate={setUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails} packagingsList={packagingsList} setPackagingsList={setPackagingsList}
                        
                        userName={userName} passWord={passWord}
                        />
                    );
                    break
                
                case 'products':
                    return(
                        <Details itemType={itemType} setItemType={setItemType} item={item} setItem={setItem} data={productsList} setData={setProductsList} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult} spaceName={spaceName} setSpaceName={setSpaceName} languagesList={languagesList} displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} canDeleteItem={new Map()} setUpdate={setUpdate} setItemToUpdate={setItemToUpdate} updateFromDetails={updateFromDetails} setUpdateFromDetails={setUpdateFromDetails} packagingsList={packagingsList} setPackagingsList={setPackagingsList} productsCategories={productsCategories}
                        
                        userName={userName} passWord={passWord}
                        />
                    );
                    break
                
            }
           
            break;

        case 'searchResults':
            return(
                <SearchResults findInCategories={findInCategories} findInConditionings={findInConditionings} findInLanguages={findInLanguages} findInProducts={findInProducts} findInTaxes={findInTaxes} stringToSearch={stringToSearch} item={item} setItem={setItem} spaceName={spaceName} setSpaceName={setSpaceName} itemType={itemType} setItemType={setItemType} categoriesList={categoriesList} setCategoriesList={setCategoriesList} upadateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} isASearchResult={isASearchResult} setIsASearchResult={setIsASearchResult}/>
            );
    }

   return null
}

export default Workspace