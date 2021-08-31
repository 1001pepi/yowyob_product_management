import '../styles/App.css';
import '../styles/Common.css';

import Banner from './Banner'
import Contenu from './Contenu'

import {useState} from 'react'
import React, {useEffect} from 'react'

function App() {

  //lien vers les catégories
  const categoriesRequestURL = 'https://anselme.pythonanywhere.com/product-api/categories/'

  //categories descriptions request url
  const categoriesDescriptionsRequestURL = "https://anselme.pythonanywhere.com/product-api/category_descriptions/"

  //conditionings request url
  const conditioningsRequestURL = 'https://anselme.pythonanywhere.com/product-api/conditionings/'

  //languages request url
  const languagesRequestURL = 'https://anselme.pythonanywhere.com/product-api/languages/'

  //produit request url
  const productsRequestURL = 'https://anselme.pythonanywhere.com/product-api/products/'

  //products details request url
  const productsDetailsRequestURL = "https://anselme.pythonanywhere.com/product-api/product_details/"

  //products description request url
  const productsDescriptionsRequestURL = "https://anselme.pythonanywhere.com/product-api/product_descriptions/"

  //product packaging request url
  const productsPackaginsRequestURL = "https://anselme.pythonanywhere.com/product-api/product_packagings/"

  //products illustrations request url
  const productsIllustrationsRequestURL = 'https://anselme.pythonanywhere.com/product-api/product_illustrations/'

  //packagings request url
  const packagingsRequestURL = "https://anselme.pythonanywhere.com/product-api/product_packagings/"

  //languages request url
  var taxesRequestURL = 'https://anselme.pythonanywhere.com/product-api/taxes/'

  //paramètres de connexion à l'API
  const userName = "ksm_system";
  const passWord = "w1C#sgdet@app#*&6deploy";

  //liste des ids des checkoxes des options de paramétre de la recherche
  const searchParamsCheckboxesIds=["categories_checkbox", "conditionings_checkbox", "languages_checkbox", "products_checkbox", "taxes_checkbox"]

  //états indiquant si les options de recherche sont sélectionnés ou pas
  const [findInCategories, setFindInCategories] = useState(true)
  const [findInConditionings, setFindInConditionings] = useState(true)
  const [findInLanguages, setFindInLanguages] = useState(true)
  const [findInProducts, setFindInProducts] = useState(true)
  const [findInTaxes, setFindInTaxes] = useState(true)

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

  //état indiquant le type de recherche
  const [searchType, setSearchType] = useState("defaultSearch")

  //etat pour l'affichage de l'alerte de confirmation de l'ajout d'une catégorie
  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false)

  //objet contenant les types de liste
  const listTypes = {
    categories: "categories",
    conditionings: "conditionings",
    languages: "languages",
    products: "products",
    taxes: "taxes"
  }

  //état contenant le type de la liste affichée dans le contenu de l'application
  const [listType, setListType] = useState(listTypes.categories)

  //état indiquant qu'on est entrain de faire une recherche
  const [searching, setSearching] = useState(false);

  //état contenant les résultats de la recherche
  const [searchResults, setSearchResults] = useState([]);


  
  //fonction permettant de cocher une option de recherche//
  function checkOption(optionId){
    document.getElementById(optionId).checked = true
  }

  //fonction permettant de décocher une option de recherche//
  function unCheckOption(optionId){
    document.getElementById(optionId).checked = false
  }

  //ajout d'un eventListener pour le choix du type de recherche
  useEffect(() => {
    var defaultSearchRadio = document.getElementById("searchChoice1");

    defaultSearchRadio.addEventListener('click', (event)=>{
      setSearchType(event.target.value)
    })
  }, [])
  
  return (
    <div className="container-fluid">
      <div className="d-flex flex-column" style={{height:"100vh"}}>
        <Banner findInCategories={findInCategories} findInConditionings={findInConditionings} findInLanguages={findInLanguages} findInProducts={findInProducts} findInTaxes={findInTaxes} 

        categoriesList={categoriesList} setCategoriesList={setCategoriesList}  updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList}  categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory}

        conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList} conditioningsResult={conditioningsResult} setConditioningsResult={setConditioningsResult} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning}

        languagesResult={languagesResult} setLanguagesResult={setLanguagesResult} languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList}

        productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} productsResult={productsResult} setProductsResult={setProductsResult} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories}

        taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList}

        categoriesRequestURL={categoriesRequestURL} conditioningsRequestURL={conditioningsRequestURL} languagesRequestURL={languagesRequestURL} productsRequestURL={productsRequestURL} packagingsRequestURL={packagingsRequestURL}

        userName={userName} passWord={passWord}

        displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert}

        setSpaceName={setSpaceName} stringToSearch={stringToSearch} setStringToSearch={setStringToSearch} searchType={searchType} setSearchType={setSearchType}

        listTypes={listTypes} listType={listType} setListType={setListType} searching={searching} setSearching = {setSearching} searchResults={searchResults} setSearchResults={setSearchResults}
        />

        <Contenu findInCategories={findInCategories} findInConditionings={findInConditionings} findInLanguages={findInLanguages} findInProducts={findInProducts} findInTaxes={findInTaxes}

        categoriesRequestURL={categoriesRequestURL} categoriesDescriptionsRequestURL={categoriesDescriptionsRequestURL} conditioningsRequestURL={conditioningsRequestURL} languagesRequestURL={languagesRequestURL} productsRequestURL={productsRequestURL} packagingsRequestURL={packagingsRequestURL} productsDetailsRequestURL={productsDetailsRequestURL} productsDescriptionsRequestURL={productsDescriptionsRequestURL} productsPackaginsRequestURL={productsPackaginsRequestURL} productsIllustrationsRequestURL={productsIllustrationsRequestURL}

        userName={userName} passWord={passWord}

        categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} categoriesList={categoriesList} setCategoriesList={setCategoriesList} canDeleteCategory={canDeleteCategory} setCanDeleteCategory={setCanDeleteCategory} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList}

        conditioningsResult={conditioningsResult} setConditioningsResult={setConditioningsResult} conditioningsList={conditioningsList} setConditioningsList={setConditioningsList} canDeleteConditioning={canDeleteConditioning} setCanDeleteConditioning={setCanDeleteConditioning} updateConditioningsList={updateConditioningsList} setUpdateConditioningsList={setUpdateConditioningsList}

        languagesResult={languagesResult} setLanguagesResult={setLanguagesResult} languagesList={languagesList} setLanguagesList={setLanguagesList} canDeleteLanguage={canDeleteLanguage} setCanDeleteLanguage={setCanDeleteLanguage} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList}

        productsList={productsList} setProductsList={setProductsList} packagingsList={packagingsList} setPackagingsList={setPackagingsList} updatePackagings={updatePackagings} setUpdatePackagings={setUpdatePackagings} productsResult={productsResult} setProductsResult={setProductsResult} canDeleteProduct={canDeleteProduct} setCanDeleteProduct={setCanDeleteProduct} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} productsCategories={productsCategories} setProductsCategories={setProductsCategories}

        taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList}

        displaySuccessAlert={displaySuccessAlert} setDisplaySuccessAlert={setDisplaySuccessAlert}

        listTypes={listTypes} listType={listType} setListType={setListType} searching={searching} setSearching = {setSearching} searchResults={searchResults} setSearchResults={setSearchResults}

              spaceName={spaceName} setSpaceName={setSpaceName} stringToSearch={stringToSearch}
        />
      </div>

      { 
        <div id="search-settings" className="search-settings-overlay">
            <div className="container search-settings" style={{fontSize:"large"}}>
                <div className="bold-center">
                    <span>Paramètres de recherche</span>
                </div>
                <hr></hr>

                <div>
                  <input type="radio" id="searchChoice1" name="searchChoice" value="defaultSearch" checked></input>
                  <label for="searchChoice1">&nbsp;Paramètres par défaut</label>
                  <p>(Recherche dans la liste courante)</p>
                </div>
                <hr></hr>
                
                <div>
                  <input type="radio" id="searchChoice2" name="searchChoice" value="advancedSearch"></input>
                  <label for="searchChoice2">&nbsp;Recherche avancée:</label>
                </div>
                <div>
                  &nbsp;&nbsp;Rechercher dans:
                </div>
                <div className="row d-flex justify-content-left" style={{marginLeft:"30px"}}>
                  <div class="form-check">
                    <input type="checkbox" className="form-check-input" id="all_checkbox" onClick={(event) =>{
                      if(event.target.checked === true){
                        //on sélectionne toutes les options
                        searchParamsCheckboxesIds.forEach((checkbox) =>{
                          checkOption(checkbox)
                        })
                        setFindInCategories(true)
                        setFindInConditionings(true)
                        setFindInLanguages(true)
                        setFindInProducts(true)
                        setFindInTaxes(true)
                      }
                    }   
                    }/>
                    <label className="form-check-label" for="all_checkbox">Tous</label>
                  </div>
                </div>
                <div className="row d-flex justify-content-left" style={{marginLeft:"30px"}}>
                  <div class="form-check">
                    <input type="checkbox" className="form-check-input" id="categories_checkbox" defaultChecked="true" onClick={(event) =>{
                      if(event.target.checked === true){
                        setFindInCategories(true)
                      }else{
                        setFindInCategories(false)
                      }
                    }
                    }/>
                    <label className="form-check-label" for="categories_checkbox">Catégories</label>
                  </div>
                </div>
                <div className="row d-flex justify-content-left" style={{marginLeft:"30px"}}>
                  <div class="form-check">
                    <input type="checkbox" className="form-check-input" id="conditionings_checkbox"  defaultChecked="true" onClick={(event) =>{
                      if(event.target.checked === true){
                        setFindInConditionings(true)
                      }else{
                        setFindInConditionings(false)
                      }
                    }
                    }/>
                    <label className="form-check-label" for="conditionings_checkbox">Conditionnements</label>
                  </div>
                </div>
                <div className="row d-flex justify-content-left" style={{marginLeft:"30px"}}>
                  <div class="form-check">
                    <input type="checkbox" className="form-check-input" id="languages_checkbox" defaultChecked="true" onClick={(event) =>{
                      if(event.target.checked === true){
                        setFindInLanguages(true)
                      }else{
                        setFindInLanguages(false)
                      }
                    }
                    }/>
                    <label className="form-check-label" for="languages_checkbox">Langues</label>
                  </div>
                </div>
                <div className="row d-flex justify-content-left" style={{marginLeft:"30px"}}>
                  <div class="form-check">
                    <input type="checkbox" className="form-check-input" id="products_checkbox"  defaultChecked="true" onClick={(event) =>{
                      if(event.target.checked === true){
                        setFindInProducts(true)
                      }else{
                        setFindInProducts(false)
                      }
                    }
                    }/>
                    <label className="form-check-label" for="products_checkbox">Produits</label>
                  </div>
                </div>
                <div className="row d-flex justify-content-left" style={{marginLeft:"30px"}}>
                  <div class="form-check">
                    <input type="checkbox" className="form-check-input" id="taxes_checkbox"  defaultChecked="true" onClick={(event) =>{
                      if(event.target.checked === true){
                        setFindInTaxes(true)
                      }else{
                        setFindInTaxes(false)
                      }
                    }
                    }/>
                    <label className="form-check-label" for="taxes_checkbox">Taxes</label>
                  </div>
                </div>
                <div className="d-flex justify-content-end" style={{marginBottom:"5px", marginRight:"10px"}}>
                    <div><a  href="#" >OK</a></div>
                </div>
            </div>
        </div> 
    } 

    </div>
  );
}

export default App;
