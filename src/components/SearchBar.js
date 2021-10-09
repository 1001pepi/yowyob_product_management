import '../styles/SearchBar.css'
import '../styles/Common.css'
import '../styles/smallDisplay.css'

import logo from '../assets/logo.png'

import Menu from './Menu'

function SearchBar({findInCategories, findInConditionings, findInLanguages, findInProducts, findInTaxes,

    categoriesList, setCategoriesList, canDeleteCategory, setCanDeleteCategory, categoriesResult, setCategoriesResult, updateCategoriesList, setUpdateCategoriesList,

    conditioningsList, setConditioningsList, canDeleteConditioning, setCanDeleteConditioning, conditioningsResult, setConditioningsResult, updateConditioningsList, setUpdateConditioningsList,

    languagesList, setLanguagesList, canDeleteLanguage, setCanDeleteLanguage, languagesResult, setLanguagesResult, updateLanguagesList, setUpdateLanguagesList, 

    productsList, setProductsList, packagingsList, setPackagingsList, updatePackagings, setUpdatePackagings, canDeleteProduct, setCanDeleteProduct, productsResult, setProductsResult, productsCategories, setProductsCategories, updateProductsList, setUpdateProductsList,

    taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList,

    categoriesRequestURL, conditioningsRequestURL, languagesRequestURL, productsRequestURL, packagingsRequestURL,

    userName, password,

    displaySuccessAlert, setDisplaySuccessAlert,

    spaceName, setSpaceName, stringToSearch, setStringToSearch, searchType, setSearchType, searchResults, setSearchResults, advancedSearchResults, setAdvancedSearchResults,

    listTypes, listType, setListType, searching, setSearching, isSearchResults, setIsSearchResults
}){
    
    //fonction pour filtrer les éléments dans une liste de catégories
    function findInCategories(list, toSearch){
        const tmpList = list.filter(function(item, index, arr){
            if(item['name'].toUpperCase().includes(toSearch.toUpperCase())){
                return true
            }

            return false
        })

        setCategoriesResult(tmpList)
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

    //fonction pour effectuer la recherche
    function handleDefaultSearch(toSearch){

        switch (listType){
            
            case listTypes.categories:
                var tmpList = isSearchResults ? advancedSearchResults : categoriesList
                
                setSearchResults(tmpList.filter(category => (category['name'].includes(toSearch.toUpperCase()) || category['code'].includes(toSearch.toUpperCase()) || category['created_at'].includes(toSearch)) || category['update_at'].includes(toSearch) ))
                break;
            
            case listTypes.conditionings:
                setSearchResults(conditioningsList.filter(conditioning => (conditioning['name'].includes(toSearch.toUpperCase()) || conditioning['description'].includes(toSearch.toUpperCase()) || conditioning['created_at'].includes(toSearch)) || conditioning['update_at'].includes(toSearch)))
                break;

            case listTypes.languages:
                setSearchResults(languagesList.filter(language => (language['name'].toUpperCase().includes(toSearch.toUpperCase()) || language['code'].toUpperCase().includes(toSearch.toUpperCase()) || language['created_at'].includes(toSearch)) || language['update_at'].includes(toSearch)))
                break;

            case listTypes.products:
                var tmpList = isSearchResults ? advancedSearchResults : productsList

                setSearchResults(tmpList.filter(product => (product['name'].includes(toSearch.toUpperCase()) || product['code'].includes(toSearch.toUpperCase()) || (categoriesList.filter(
                    (category) => {
                        return category['id'] === product['category']
                    })[0] ? categoriesList.filter(
                        (category) => {
                            return category['id'] === product['category']
                        })[0]['name'].includes(toSearch.toUpperCase()) : "") || product['created_at'].includes(toSearch)) || product['update_at'].includes(toSearch)))
                break;

            case listTypes.taxes:
                setSearchResults(taxesList.filter(taxe => (taxe['label'].includes(toSearch.toUpperCase()) || taxe['value'].includes(toSearch.toUpperCase()) || taxe['description'].includes(toSearch.toUpperCase()) || taxe['created_at'].includes(toSearch)) || taxe['update_at'].includes(toSearch)))
                break;
        }
       
    }

    return(
        <div className="col-12 col-md-6 vertical-center"> 
            <div className="row no-gutters form-group has-search vertical-center">

                <div id="mySidebar" className="sidebar display-on-small-screens" style={{order:"3"}}>
                    <div onClick={closeNav}>
                        <a href="#" class="closebtn" style={{color:"black"}}>&times;</a>
                    </div>
                    <img src={logo} alt="yowyob" className="logo" style={{width:"180px"}}/>

                    <div className="col-12 col-md-2 right-border">
                        <Menu categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList}

conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeletCconditioning={setCanDeleteConditioning} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList}

languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList}

productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} productsCategories={productsCategories} setProductsCategories={setProductsCategories}

                        categoriesRequestURL={categoriesRequestURL} conditioningsRequestURL={conditioningsRequestURL} languagesRequestURL={languagesRequestURL} productsRequestURL={productsRequestURL} packagingsRequestURL={packagingsRequestURL}

                        userName={userName} password={password}

                        displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} smallScreen={true}

                        searching={searching} setSearching = {setSearching}

    taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList}   spaceName={spaceName} setSpaceName={setSpaceName}
                        />
                    </div>
                </div>

                <div className="col-2 display-on-small-screens" id="menu-bar-button"  onClick={openNav}>
                    <span className="fa fa-bars fa-2x form-control-feedback param-button-smallDisplay" style={{color:"black", zIndex:"1"}} ></span>
                </div>

                <div className="col-9 col-md-11 vertical-center">
                    <span className="fa fa-search form-control-feedback param-button-smallDisplay" style={{zIndex:"1"}}></span>
                    
                    <input type="text" className="form-control searchbar searchbar-smallDisplay" onKeyPress={(event) =>{
                        if(event.key === 'Enter'){
                            //remove the focus to the search bar
                            event.target.blur();
    
                            //appel de la fonction de gestion de la recherche
                            setStringToSearch(event.target.value)
                            if(searchType === "defaultSearch"){
                                handleDefaultSearch(stringToSearch)
                            }
                            
                        }

                        }} onChange={(event) =>{
                            //appel de la fonction de gestion de la recherche
                            setStringToSearch(event.target.value)
                            
                            if(event.target.value){
                                setSearching(true);
                                handleDefaultSearch(event.target.value)

                            }else{
                                setSearching(false);
                            }
                        
                        }} placeholder=" Search..." />
                </div>

                <div className="col-1">
                    <a id='search-settings-button' onClick={(event) =>{
                        document.getElementById('search-settings-button').href="#search-settings"

                        }}>
                        <button className="param-button param-button-smallDisplay" title="paramètres de recherche">
                            <i className="fa fa-sliders fa-2x"></i>
                        </button>
                    </a>
                </div>
            </div>      
        </div>
    );
}

export default SearchBar