import '../styles/Contenu.css'

import Workspace from './Workspace'
import Menu from './Menu'

import {useState} from 'react'

function Contenu({findInCategories, findInConditionnements, findInLangues, findInProducts, findInTaxes, spaceName, setSpaceName, stringToSearch, categoriesList, setCategoriesList, languagesList, taxesList, setTaxesList, updateTaxesList, setUpdateTaxesList, setLanguagesList, productsList, setProductsList, categoriesResult, setCategoriesResult, updateCategoriesList, setUpdateCategoriesList, updateProductsList, setUpdateProductsList, updateLanguagesList, setUpdateLanguagesList}){
    //categories request url
    var categoriesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/categories/'

    //etat pour l'affichage de l'alerte de confirmation de l'ajout d'une catégorie
    const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false)

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

                //tri de la liste récupérée dans l'ordre croissant
                tmpList.sort((a, b) => (a['name'] > b['name'] ? 1 : (b['name'] > a['name'] ? -1 : 0)))

                setCategoriesList(tmpList)

                if(next != null){
                    getCategories(next, tmpList)
                }
            }
        }
    }

    

    return(
        <div className="row flex-grow-1">
            <Menu categoriesList={categoriesList} setCategoriesList={setCategoriesList} languagesList={languagesList} setLanguagesList={setLanguagesList} taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList} spaceName={spaceName} setSpaceName={setSpaceName} productsList={productsList} setProductsList={setProductsList} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList}/>

            <div className="col container workspace-div">
                <Workspace findInCategories={findInCategories} findInConditionnements={findInConditionnements} findInLangues={findInLangues} findInProducts={findInProducts} findInTaxes={findInTaxes} spaceName={spaceName} setSpaceName={setSpaceName} displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert} categoriesList={categoriesList} setCategoriesList={setCategoriesList} productsList={productsList} setProductsList={setProductsList} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} languagesList={languagesList} setLanguagesList={setLanguagesList} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList} taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList}categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult}
                    
                    findInCategories={findInCategories} findInConditionnements={findInConditionnements}
                    findInLangues={findInLangues} findInProducts={findInProducts} findInTaxes={findInTaxes}
                    stringToSearch={stringToSearch}
                />
            </div>
        </div>
    );
}

export default Contenu