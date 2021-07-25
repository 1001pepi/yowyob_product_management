import logo from '../assets/logo.png'

import SearchBar from './SearchBar'
import Langue from './Langue'
import Identity from './Identity'

import '../styles/Logo.css'
import '../styles/Banner.css'

function Banner({findInCategories, findInConditionnements, findInLangues, findInProducts, findInTaxes,setSpaceName, stringToSearch, setStringToSearch, categoriesResult, setCategoriesResult, categoriesList, setCategoriesList, updateCategoriesList, setUpdateCategoriesList}){
    return(
        <div className="row banner">
            <div className="col">
                <a className="navbar-brand" href="..."><img src={logo} alt="yowyob" className="logo"/></a>
            </div>

            <SearchBar  findInCategories={findInCategories} findInConditionnements={findInConditionnements} findInLangues={findInLangues} findInProducts={findInProducts} findInTaxes={findInTaxes} setSpaceName={setSpaceName} stringToSearch={stringToSearch} setStringToSearch={setStringToSearch} categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} categoriesList={categoriesList} setCategoriesList={setCategoriesList}/>

            <Langue />

            <Identity />

        </div> 
    );
}

export default Banner