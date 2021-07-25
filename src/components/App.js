import logo from '../assets/logo.png';

import '../styles/App.css';
import '../styles/Common.css';

import Banner from './Banner'
import Contenu from './Contenu'
import Footer from './Footer'

import {useState} from 'react'

function App() {

  //liste des ids des checkoxes des options de paramétre de la recherche
  const searchParamsCheckboxesIds=["categories_checkbox", "conditionnings_checkbox", "languages_checkbox", "products_checkbox", "taxes_checkbox"]

  //états indiquant si les options de recherche sont sélectionnés ou pas
  const [findInCategories, setFindInCategories] = useState(true)
  const [findInConditionnements, setFindInConditionnements] = useState(true)
  const [findInLangues, setFindInLangues] = useState(true)
  const [findInProducts, setFindInProducts] = useState(true)
  const [findInTaxes, setFindInTaxes] = useState(true)

  //etat indiquant l'espace de travail à afficher
  const [spaceName, setSpaceName] = useState('productList')

  //état contenant la chaîne à chercher
  const [stringToSearch, setStringToSearch] = useState('')


  //etat contenant la liste des catégories
  const [categoriesList, setCategoriesList] = useState([])

  //etat contenant la liste des produits
  const [productsList, setProductsList] = useState([])

  //etat contenant la liste des langues
  const [languagesList, setLanguagesList] = useState([])

  //etat contenant la liste des taxes
  const [taxesList, setTaxesList] = useState([]) 


  //etat indiquant une mise à jour de la liste des catégories
  const [updateCategoriesList, setUpdateCategoriesList] = useState(true)

  //etat indiquant une mise à jour de la liste des langues
  const [updateLanguagesList, setUpdateLanguagesList] = useState(true)

  //etat indiquant une mise à jour de la liste des produits
  const [updateProductsList, setUpdateProductsList] = useState(true)

  //etat indiquant une mise à jour de la liste des taxes
  const [updateTaxesList, setUpdateTaxesList] = useState(true)


  //état contenant les résultats de la recherche dans les catégories
  const [categoriesResult, setCategoriesResult] = useState([])

  

  


  //fonction permettant de cocher une option de recherche
  function checkOption(optionId){
    document.getElementById(optionId).checked = true
  }

  //fonction permettant de décocher une option de recherche
  function unCheckOption(optionId){
    document.getElementById(optionId).checked = false
  }
  
  return (
    <div className="container-fluid">
      <div className="d-flex flex-column" style={{height:"100vh"}}>
        <Banner findInCategories={findInCategories} findInConditionnements={findInConditionnements} findInLangues={findInLangues} findInProducts={findInProducts} findInTaxes={findInTaxes} setSpaceName={setSpaceName} stringToSearch={stringToSearch} setStringToSearch={setStringToSearch} categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} categoriesList={categoriesList} setCategoriesList={setCategoriesList}/>

        <Contenu findInCategories={findInCategories} findInConditionnements={findInConditionnements} findInLangues={findInLangues} findInProducts={findInProducts} findInTaxes={findInTaxes} categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} categoriesList={categoriesList} setCategoriesList={setCategoriesList} productsList={productsList} setProductsList={setProductsList} languagesList={languagesList} setLanguagesList={setLanguagesList} updateCategoriesList={updateCategoriesList} taxesList={taxesList} setTaxesList={setTaxesList} updateTaxesList={updateTaxesList}  setUpdateTaxesList={setUpdateTaxesList} setUpdateCategoriesList={setUpdateCategoriesList} updateLanguagesList={updateLanguagesList} setUpdateLanguagesList={setUpdateLanguagesList} updateProductsList={updateProductsList} setUpdateProductsList={setUpdateProductsList} spaceName={spaceName} setSpaceName={setSpaceName} stringToSearch={stringToSearch}
        />
      </div>

      { 
        <div id="search-settings" className="search-settings-overlay">
            <div className="container search-settings" style={{fontSize:"large"}}>
                <div className="bold-center">
                    <span>Paramètres de recherche</span>
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
                        setFindInConditionnements(true)
                        setFindInLangues(true)
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
                    <input type="checkbox" className="form-check-input" id="conditionnings_checkbox"  defaultChecked="true" onClick={(event) =>{
                      if(event.target.checked === true){
                        setFindInConditionnements(true)
                      }else{
                        setFindInConditionnements(false)
                      }
                    }
                    }/>
                    <label className="form-check-label" for="conditionnings_checkbox">Conditionnements</label>
                  </div>
                </div>
                <div className="row d-flex justify-content-left" style={{marginLeft:"30px"}}>
                  <div class="form-check">
                    <input type="checkbox" className="form-check-input" id="languages_checkbox" defaultChecked="true" onClick={(event) =>{
                      if(event.target.checked === true){
                        setFindInLangues(true)
                      }else{
                        setFindInLangues(false)
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
