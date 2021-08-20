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

    displaySuccessAlert, setDisplaySuccessAlert,

    spaceName, setSpaceName, stringToSearch,   taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList, setStringToSearch, searchType, setSearchType
}){

    //lien vers les catégories
    const categoriesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/categories/'

    //paramètres de connexion à l'API
    var userName = "zang";
    var passWord = "harazangsuperuser";

    //fonction d'encodage des paramètres de connexion à l'API//
    function authenticateUser(user, password){
        var token = user + ":" + password;

        var hash = btoa(token); 

        return "Basic " + hash;
    }

    //fonction permettantt de récupérer la liste des catégories//
    function getCategories(requestURL, tmpList, toSearch){
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

                findInCategories(tmpList, toSearch)
                setCategoriesList(tmpList)

                if(next != null){
                    getCategories(next, tmpList, toSearch)
                }
            }
        }
    }

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

       
    }

    return(
        <div className="col-12 col-md-6 vertical-center"> 
            <div className="row no-gutters form-group has-search vertical-center">

                <div id="mySidebar" className="sidebar display-on-small-screens" style={{order:"3"}}>
                    <div onClick={closeNav}>
                        <a href="#" class="closebtn" style={{color:"black"}}>&times;</a>
                    </div>
                    <img src={logo} alt="yowyob" className="logo" style={{width:"180px"}}/>

                    <Menu categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList}

conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeletCconditioning={setCanDeleteConditioning} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList}

languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList}

productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} productsCategories={productsCategories} setProductsCategories={setProductsCategories}

                    displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} smallScreen={true}

 taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList}   spaceName={spaceName} setSpaceName={setSpaceName}
                    />
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
                            if(searchType === "defaultSearch"){
                                handleDefaultSearch(stringToSearch)
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