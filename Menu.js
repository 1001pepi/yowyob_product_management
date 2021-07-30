import '../styles/Menu.css'

function Menu({displaySuccessAlert, setDisplaySuccessAlert, 
    categoriesList, setCategoriesList, languagesList, setLanguagesList, taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList, updateCategoriesList, setUpdateCategoriesList, updateLanguagesList, setUpdateLanguagesList, spaceName, setSpaceName, productsList, setProductsList,updateProductsList, setUpdateProductsList}){    
    //categories request url
    var categoriesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/categories/'

    //produit request url
    var productsRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/products/'

    //languages request url
    var languagesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/languages/'

    //languages request url
    var taxesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/taxes/'

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
                console.log("tmplist: " + tmpList.length)
                setCategoriesList(tmpList)
                console.log("catlist: " + categoriesList.length)

                if(next != null){
                    tmpList = getCategories(next, tmpList)
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
                var next = response['next']
    
                tmpList = tmpList.concat(response['results'])
                
                setProductsList(tmpList)
               

                if(next != null){
                    tmpList = getProducts(next, tmpList)
                }
            }
        }   
     }

    //fonction permettantt de récupérer la liste des taxes//
    function getTaxes(requestURL, tmpList){
        //création de la requête
        var request = new XMLHttpRequest();
        
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            var response = request.response;
            var requestStatus = request.status
            console.log(response)
            
            if(requestStatus === 200){
                var next = response['next']
    
                tmpList = tmpList.concat(response['results'])
                console.log("tmplist: " + tmpList.length)
                setTaxesList(tmpList)
                console.log("catlist: " + taxesList.length)

                if(next != null){
                    tmpList = getTaxes(next, tmpList)
                }
            }
        }
    }

    return(
        <div className="col-2">
            <div className="row d-flex justify-content-center" 
                    style={{marginBottom:"15px", marginTop:"15px"}}>
                <button className="col-12 menu-button" onClick={() => {
                        if(updateLanguagesList){
                            console.log("hi")
                            getLanguages(languagesRequestURL, [])
                            setUpdateLanguagesList(false)
                        }
                        if(updateCategoriesList){
                            getCategories(categoriesRequestURL, [])
                            setUpdateCategoriesList(false)
                        }
                        setSpaceName("listCategories")
                        }}><i className="fa fa-list-ul link-item" ></i>Catégories</button>
            </div>

            <div className="row d-flex justify-content-center" 
                    style={{marginBottom:"15px", marginTop:"15px"}}>
                <button className="col-12 menu-button" onClick={() => {
                        if(updateLanguagesList){
                            getLanguages(languagesRequestURL, [])
                            setUpdateLanguagesList(false)
                        }
                        if(updateCategoriesList){
                            getCategories(categoriesRequestURL, [])
                            setUpdateCategoriesList(false)
                        }
                        setSpaceName("listCategories")
                        }}><i className="fa fa-product-hunt link-item" ></i>Conditionnements</button>
            </div>

            <div className="row d-flex justify-content-center" 
                    style={{marginBottom:"15px", marginTop:"15px"}}>
                <button className="col-12 menu-button" onClick={() => {
                        if(updateLanguagesList){
                            getLanguages(languagesRequestURL, [])
                            setUpdateLanguagesList(false)
                        }
                        
                        setSpaceName("listLanguages")
                        }}><i className="fa fa-language link-item" ></i>Langues</button>
            </div>

            <div className="row d-flex justify-content-center" 
                    style={{marginBottom:"15px", marginTop:"15px"}}>
                <button className="col-12 menu-button" onClick={() => {
                        if(updateLanguagesList){
                            getLanguages(languagesRequestURL, [])
                            setUpdateLanguagesList(false)
                        }
                        if(updateCategoriesList){
                            getCategories(categoriesRequestURL, [])
                            setUpdateCategoriesList(false)
                        }
                        if(updateProductsList){
                            getProducts(productsRequestURL, [])
                            setUpdateProductsList(false)
                        }

                        setSpaceName("listProducts")
                        }}><i className="fa fa-product-hunt link-item" ></i>Produits</button>
            </div>

            <div className="row d-flex justify-content-left" 
                    style={{marginBottom:"15px", marginTop:"15px"}}>
                <button className="col-12 menu-button" onClick={() => {
                        if(updateTaxesList){
                            getTaxes(taxesRequestURL, [])
                            setUpdateTaxesList(false)
                        }
                       
                        setSpaceName("listTaxes")
                        }}><i className="fa fa-money link-item" ></i>Taxes</button>
            </div>
        </div> 
  );

}

export default Menu

