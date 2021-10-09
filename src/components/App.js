import '../styles/App.css';
import '../styles/Common.css';
import '../styles/Form.css';

import Banner from './Banner'
import Contenu from './Contenu'

import {useState} from 'react'
import React, {useEffect} from 'react'
import { useHistory } from "react-router-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams
} from "react-router-dom";

function App(){

  //objet contenant les liens de l'API
  const links = {
    //lien vers les catégories
    categoriesRequestURL: 'https://anselme.pythonanywhere.com/product-api/categories/',

    //categories descriptions request url
    categoriesDescriptionsRequestURL:"https://anselme.pythonanywhere.com/product-api/category_descriptions/",

    //conditionings request url
    conditioningsRequestURL:'https://anselme.pythonanywhere.com/product-api/conditionings/',

    //languages request url
    languagesRequestURL:'https://anselme.pythonanywhere.com/product-api/languages/',

    //produit request url
    productsRequestURL:'https://anselme.pythonanywhere.com/product-api/products/',

    //products details request url
    productsDetailsRequestURL: "https://anselme.pythonanywhere.com/product-api/product_details/",

    //products description request url
    productsDescriptionsRequestURL: "https://anselme.pythonanywhere.com/product-api/product_descriptions/",

    //product packaging request url
    productsPackaginsRequestURL: "https://anselme.pythonanywhere.com/product-api/product_packagings/",

    //products illustrations request url
    productsIllustrationsRequestURL: 'https://anselme.pythonanywhere.com/product-api/product_illustrations/',

    //packagings request url
    packagingsRequestURL: "https://anselme.pythonanywhere.com/product-api/product_packagings/",

    //taxations request url
    taxesRequestURL: 'https://anselme.pythonanywhere.com/product-api/taxes/',

  }

  //objet contant les différentes valeurs de l'état findIn
  const findInValues = {
    categories: "categories",
    products: "products",
  }

  //paramètres de connexion à l'API
  const userName = "ksm_system";
  const password = "w1C#sgdet@app#*&6deploy";

  //objet contenant les noms des workspaces
  const spaceNameValues = {
    listCategories: "listCategories",
    createCategory: "createCategory",
    listConditionings: "listConditionings",
    createConditioning: "createConditioning",
    listLanguages: "listLanguages",
    createLanguage: "createLanguage",
    listProducts: "listProducts",
    createProduct: "createProduct",
    listTaxations: "listTaxations",
    createTaxation: "createTaxation",
    details: "details",
  }

  //instructions s'éxécutant après le premier rendu du composant
  useEffect(() =>{
    var selectFindIn = document.querySelector('#findIn')
    selectFindIn.addEventListener('change', (event) => {
        setFindIn(event.target.value)
        console.log(event.target.value)
    }) 
  }, [])

  //état indiquant où doit s'effectuer la recherche avancée
  const [findIn, setFindIn] = useState(findInValues.categories);

  //etat contenant la liste des catégories
  const [categoriesList, setCategoriesList] = useState([])

  //etat indiquant les éléments de la liste des categories qu'on peut supprimer
  const [canDeleteCategory, setCanDeleteCategory] = useState(new Map())

  //etat indiquant une mise à jour de la liste des catégories
  const [updateCategoriesList, setUpdateCategoriesList] = useState(true)

  //état contenant les résultats de la recherche dans les catégories
  const [categoriesResult, setCategoriesResult] = useState([])


  //etat contenant la liste des conditionnements
  const [conditioningsList, setConditioningsList] = useState([]) 

  //etat indiquant les éléments de la liste des conditionnements qu'on peut supprimer
  const [canDeleteConditioning, setCanDeleteConditioning] = useState(new Map())

  //etat indiquant une mise à jour de la liste des conditionnements
  const [updateConditioningsList, setUpdateConditioningsList] = useState(true)

  //état contenant les résultats de la recherche dans les conditionnements
  const [conditioningsResult, setConditioningsResult] = useState([])


  //etat contenant la liste des langues
  const [languagesList, setLanguagesList] = useState([])

  //état indiquant les éléments de la liste des langues qu'on peut supprimer
  const [canDeleteLanguage, setCanDeleteLanguage] = useState(new Map())

  //etat indiquant une mise à jour de la liste des langues
  const [updateLanguagesList, setUpdateLanguagesList] = useState(true)

  //etat contenant les résultats de la recherche dans les langues
  const [languagesResult, setLanguagesResult] = useState([])


  //etat contenant la liste des produits
  const [productsList, setProductsList] = useState([])

  //état contenant la liste des packagings
  const [packagingsList, setPackagingsList] = useState([])

  //état indiquant si on doit charger de nouveau la liste des packaginsg
  const [updatePackagings, setUpdatePackagings] = useState(true)

  //état indiquant les éléments de la liste des produits qu'on peut supprimer
  const [canDeleteProduct, setCanDeleteProduct] = useState(new Map())

  //etat indiquant une mise à jour de la liste des produits
  const [updateProductsList, setUpdateProductsList] = useState(true)

  //état contenant les résultats de la recherche dans les produits
  const [productsResult, setProductsResult] = useState([])

  //état contenant la liste des noms des catégories des produits
  const [productsCategories, setProductsCategories] = useState(new Map())


  //etat contenant la liste des taxes
  const [taxesList, setTaxesList] = useState([]) 

  //etat indiquant une mise à jour de la liste des taxes
  const [updateTaxesList, setUpdateTaxesList] = useState(true)


  //etat indiquant l'espace de travail à afficher
  const [spaceName, setSpaceName] = useState('listCategories')

  //état contenant la chaîne à chercher
  const [stringToSearch, setStringToSearch] = useState('')

  //etat pour l'affichage de l'alerte de confirmation de l'ajout d'une catégorie
  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false)

  //objet contenant les types de liste
  const listTypes = {
    categories: "categories",
    conditionings: "conditionings",
    languages: "languages",
    products: "products",
    taxes: "taxations",
  }

  //état contenant le type de la liste affichée dans le contenu de l'application
  const [listType, setListType] = useState(listTypes.categories)

  //état indiquant qu'on est entrain de faire une recherche dans la liste courante ou pas
  const [searching, setSearching] = useState(false);

  //état indiquant si la liste affichée est le résultat d'une recherche
  const [isSearchResults, setIsSearchResults] = useState(false);

  //état contenant les résultats de la recherche dans la liste courante
  const [searchResults, setSearchResults] = useState([]);

  //état contenant les résultats pour une recherche avancée
  const [advancedSearchResults, setAdvancedSearchResults] = useState([]);

  //informations utiles pour le routage
  const history = useHistory();

  //fonction d'encodage des paramètres de connexion à l'API//
  function authenticateUser(user, password){
    var token = user + ":" + password;

    var hash = btoa(token); 

    return "Basic " + hash;
  }
  
  //fonction permettant de cocher une option de recherche//
  function checkOption(optionId){
    document.getElementById(optionId).checked = true
  }

  //fonction permettant de décocher une option de recherche//
  function unCheckOption(optionId){
    document.getElementById(optionId).checked = false
  }

  //fonction permettant de récupérer les paramètres de recherche et de lancer la recherche
  function handleSearch(){
    //on récupère les paramètres de la recherche
    var model = "", mark = "", max_weight, min_weight, conservation = "", origin = "", composition = "", description = "";
    var requestURL

    if(document.getElementById("description")) description = document.getElementById("description").value;

    switch(findIn){
      case findInValues.categories:
          //construction de l'url pour récupérer les résultats de la recherche
          requestURL = links.categoriesRequestURL + "?search=" + description + "&&searchInDescriptionsOnly=True"

          fecthSearchResults(requestURL, [])
          
          history.push(`/categories/search`);
          history.push(`/categories/search`);                          
          history.goBack();

        break;

      case findInValues.products:
        if(document.getElementById("model")) model = document.getElementById("model").value
        if(document.getElementById("mark")) mark = document.getElementById("mark").value
        if(document.getElementById("min_weight")) min_weight = document.getElementById("min_weight").value
        if(document.getElementById("max_weight")) max_weight = document.getElementById("max_weight").value
        if(document.getElementById("conservation")) conservation = document.getElementById("conservation").value
        if(document.getElementById("origin")) origin = document.getElementById("origin").value
        if(document.getElementById("composition")) composition = document.getElementById("composition").value
        
        //construction de l'url pour récupérer les résultats de la recherche
        requestURL = links.productsRequestURL + "?"

        if(model) requestURL += ("model=" + model)
        if(mark) requestURL += ("&mark=" + mark)
        if(min_weight) requestURL += ("&min_weight=" + min_weight)
        if(max_weight) requestURL += ("&max_weight=" + max_weight)
        if(conservation) requestURL += ("&conservation=" + conservation)
        if(origin) requestURL += ("&origin=" + origin)
        if(composition) requestURL += ("&composition=" + composition)
        if(description) requestURL += ("&description=" + description)

        fecthSearchResults(requestURL, [])

        history.push(`/products/search`);
        history.push(`/products/search`);                          
        history.goBack();

        break;
    }
  }

  //fonction permettant de récupérer les résultats de la recherche
  function fecthSearchResults(requestURL, tmpList){
    //création de la requête
    var request = new XMLHttpRequest();
        
    request.open('GET', requestURL);
    request.setRequestHeader("Authorization", authenticateUser(userName, password)); 
    request.responseType = 'json';
    request.send();

    request.onload = function(){
      var response = request.response;
      var requestStatus = request.status

      if(requestStatus === 200){
          var next = response['next']

          tmpList = tmpList.concat(response['results'])
    
          setAdvancedSearchResults(tmpList)

          if(next != null){
              tmpList = fecthSearchResults(next, tmpList)
          }
      }
    } 
  }

  //fonction pour afficher le formulaire de recherche avancée
  function displayAdvancedSearchForm(){
    switch(findIn){
      case findInValues.categories:
        return(
          <div className="container">
            <div className="row">
              <label for="description" className="col-3 col-form-label label">Description</label>
              <div className="col-6">
                <input type="text" className="form-control text-input" id="description"></input> 
              </div>
            </div>
            <hr />
          </div> 
        )
        break;

      case findInValues.products:
        return(
          <div className="container">
            <div className="row">
              <label for="model" className="col-3 col-form-label label">Modèle</label>
              <div className="col-6">
                <input type="text" className="form-control text-input" id="model"></input> 
              </div>
            </div>
            <div className="row">
              <label for="mark" className="col-3 col-form-label label">Marque</label>
              <div className="col-6">
                <input type="text" className="form-control text-input" id="mark"></input> 
              </div>
            </div>
            <div className="row">
              <label for="min_weight" className="col-3 col-form-label label">Poids</label>
              <div className="col-3">
                <input type="number" className="form-control text-input" id="min_weight" placeholder="min weight"></input>  
              </div>
              :
              <div className="col-3">
                <input type="number" className="form-control text-input" id="max_weight" placeholder="max weight"></input> 
              </div>
            </div>
            <div className="row">
              <label for="conservation" className="col-3 col-form-label label">Conservation</label>
              <div className="col-6">
                <input type="text" className="form-control text-input" id="conservation"></input> 
              </div>
            </div>
            <div className="row">
              <label for="origin" className="col-3 col-form-label label">Origine</label>
              <div className="col-6">
                <input type="text" className="form-control text-input" id="origin"></input> 
              </div>
            </div>
            <div className="row">
              <label for="composition" className="col-3 col-form-label label">Composition</label>
              <div className="col-6">
                <input type="text" className="form-control text-input" id="composition"></input> 
              </div>
            </div>
            <div className="row">
              <label for="description" className="col-3 col-form-label label">Description</label>
              <div className="col-6">
                <input type="text" className="form-control text-input" id="description"></input> 
              </div>
            </div>
            <hr />
          </div> 
        )
          break;

        default:
          break;
    }
  }
  
  return (
    <div className="container-fluid">
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/categories"></Redirect>
          </Route>

          <Route path="/">  
            <div className="d-flex flex-column" style={{height:"100vh"}}>
              <Banner 

              categoriesList={categoriesList} setCategoriesList={setCategoriesList}  updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList}  categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory}

              conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList} conditioningsResult={conditioningsResult} setConditioningsResult={setConditioningsResult} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning}

              languagesResult={languagesResult} setLanguagesResult={setLanguagesResult} languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList}

              productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} productsResult={productsResult} setProductsResult={setProductsResult} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories}

              taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList}

              links={links}

              userName={userName} password={password}

              displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert}

              setSpaceName={setSpaceName} stringToSearch={stringToSearch} setStringToSearch={setStringToSearch}

              listTypes={listTypes} listType={listType} setListType={setListType}
              
              searching={searching} setSearching = {setSearching} isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults} searchResults={searchResults} setSearchResults={setSearchResults} advancedSearchResults={advancedSearchResults} setAdvancedSearchResults={setAdvancedSearchResults}
              />

              <Route path="/:spaceNameParam/:subSpaceNameParam?/:itemParam?/" children={
                <Contenu

                links={links}

                userName={userName} password={password}

                categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList}

                conditioningsResult={conditioningsResult} setConditioningsResult={setConditioningsResult} conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList}

                languagesResult={languagesResult} setLanguagesResult={setLanguagesResult} languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList}

                productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} productsResult={productsResult} setProductsResult={setProductsResult} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories}

                taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList}

                displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert}

                listTypes={listTypes} listType={listType} setListType={setListType} 
                
                searching={searching} setSearching = {setSearching} isSearchResults={isSearchResults} setIsSearchResults={setIsSearchResults} searchResults={searchResults} setSearchResults={setSearchResults} advancedSearchResults={advancedSearchResults} setAdvancedSearchResults={setAdvancedSearchResults} handleSearch={handleSearch}

                spaceName={spaceName} setSpaceName={setSpaceName} spaceNameValues={spaceNameValues} stringToSearch={stringToSearch}
                />
              }/>
            </div>
          </Route>
        </Switch>
      </Router>
      
      { 
        <div id="search-settings" className="container search-settings" style={{fontSize:"large"}}>
            <div className="bold-center" style={{marginTop:"10px"}}>
                <span>Paramètres de recherche</span>
            </div>
            <hr></hr>

            <div className="row">
              <div className="col-6">
                &nbsp;&nbsp;Rechercher dans:
              </div>
              <div className="col-4">
                <select id="findIn" className="form-control select-input" defaultValue="categories" style={{marginRight:"20px"}}>
                    <option value="categories">Catégories</option>
                    <option value="products">Produits</option>
                </select>
              </div>
            </div>
            <hr/>
            <div className="row d-flex justify-content-left" style={{marginLeft:"30px"}}>
              {
                displayAdvancedSearchForm()
              }
            </div>
            
            <div className="d-flex justify-content-end" style={{marginBottom:"5px", marginRight:"10px"}}>
              <div><a  href="#" >Annuler</a></div>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <div onClick={()=> {
                handleSearch()
                }}>
                <a  href="#" >Rechercher</a>
              </div>
            </div>
        </div>
        
    } 

    </div>
  );
}

export default App;
