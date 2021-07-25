import '../styles/SearchBar.css'
import '../styles/Common.css'

function SearchBar({findInCategories, findInConditionnements, findInLangues, findInProducts, findInTaxes,setSpaceName, stringToSearch, setStringToSearch, categoriesResult, setCategoriesResult, updateCategoriesList, setUpdateCategoriesList, categoriesList, setCategoriesList}){

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

    //fonction pour effectuer la recherche
    function handleResearch(toSearch){

        if(findInCategories){
            if(updateCategoriesList){
                getCategories(categoriesRequestURL, [], toSearch)
                setUpdateCategoriesList(false)

            }else{
                findInCategories(categoriesList, toSearch)
            }

        }

        setSpaceName('searchResults')
    }

    return(
        <div className="col-6 vertical-center"> 
            <div className="row no-gutters form-group has-search vertical-center">
                <div className="col-11 vertical-center">
                    <span className="fa fa-search form-control-feedback"></span>
                    <input type="text" className="form-control searchbar" onKeyPress={(event) =>{
                        if(event.key === 'Enter'){
                            //remove the focus to the search bar
                            event.target.blur();
    
                            //appel de la fonction de gestion de la recherche
                            setStringToSearch(event.target.value)
                            handleResearch(event.target.value)
                        }

                        }} placeholder="Search..." />
                </div>

                <div className="col-auto vertical-center">
                    <a id='search-settings-button' onClick={(event) =>{
                        document.getElementById('search-settings-button').href="#search-settings"

                        }}>
                        <button className="param-button" title="paramètres de recherche">
                            <i className="fa fa-sliders fa-2x"></i>
                        </button>
                    </a>
                </div>
            </div>      
        </div>
    );
}

export default SearchBar