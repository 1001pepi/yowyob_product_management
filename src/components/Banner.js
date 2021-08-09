import logo from '../assets/logo.png'

import SearchBar from './SearchBar'
import Langue from './Langue'
import Identity from './Identity'

import '../styles/Logo.css'
import '../styles/Banner.css'

function Banner({findInCategories, findInConditionnements, findInLangues, findInProducts, findInTaxes,
    categoriesResult, setCategoriesResult, categoriesList, setCategoriesList, updateCategoriesList, setUpdateCategoriesList,
    conditioningsResult, setConditioningsResult, conditioningsList, setConditioningsList, updateConditioningsList, setUpdateConditioningsList,
    setSpaceName, stringToSearch, setStringToSearch
}){
    return(
        <div className="row banner">
            <div className="col">
                <a className="navbar-brand" href="..."><img src={logo} alt="yowyob" className="logo"/></a>
            </div>

            <SearchBar  findInCategories={findInCategories} findInConditionnements={findInConditionnements} findInLangues={findInLangues} findInProducts={findInProducts} findInTaxes={findInTaxes}
            categoriesResult={categoriesResult} setCategoriesResult={setCategoriesResult} updateCategoriesList={updateCategoriesList} setUpdateCategoriesList={setUpdateCategoriesList} categoriesList={categoriesList} setCategoriesList={setCategoriesList}
            setSpaceName={setSpaceName} stringToSearch={stringToSearch} setStringToSearch={setStringToSearch}
            />

            <Langue />

            <Identity />

        </div> 
    );
}

export default Banner