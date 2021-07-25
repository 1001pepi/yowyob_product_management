import '../styles/Form.css'
import "../styles/Common.css"

import React, {useState} from 'react'

import CategoryDescriptionForm from './CategoryDescriptionForm'

function CreateCategoryForm({setSpaceName, setDisplaySuccessAlert, categoriesList, setCategoriesList, languagesList, setLanguagesList, update, setUpdate, itemToUpdate, setItemToUpdate}){
        
    //liste des clés des descriptions
    const [descriptionsKeys, setDescriptionsKeys] = useState([])

    //nombre de descriptions supplémentaire en dehors de la description par défaut*/
    const [nbDescriptions, setNbDescriptions] = useState(0)

    //etat pour contrôler l'affichage du message d'alerte pour le bon remplissage du formulaire
    const [displayAlert, setDisplayAlert] = useState(false)

    //etat contenant la liste des langues disponibles pour une nouvelle description
    const [availableLanguages, setAvailableLanguages] = useState(languagesList)

    //etat contenant le message d'alerte à afficher pour le remplissage des formulaires
    const [alertMsg, setAlertMsg] = useState('')

    //paramètres de connexion à l'API
    var userName = "zang";
    var passWord = "harazangsuperuser";

    //fonction d'encodage des paramètres de connexion à l'API//
    function authenticateUser(user, password){
        var token = user + ":" + password;

        // Should i be encoding this value????? does it matter???
        // Base64 Encoding -> btoa
        var hash = btoa(token); 

        return "Basic " + hash;
    }

    //fonction pour ajouter une description//
    function addDescription(event){
        const tmpList = languagesList.filter(function(item, index, arr){

            if(item['id'] === document.querySelector('#language_defaultDescription').value){
                return false

            }else{
                for(var i = 0; i < nbDescriptions; i++){
                    if(item['id'] === document.querySelector('#language_' + i).value){
                        return false
                    }
                }
            }

            return true
        })

        setAvailableLanguages(tmpList)

        setDescriptionsKeys([...descriptionsKeys, {
            value: nbDescriptions,
            languages: tmpList
        }]);
        
        setNbDescriptions(nbDescriptions + 1);

        event.preventDefault();
    }

    //fonction pour enregistrer la catégorie//
    function saveCategory(event){
        //récupération des valeurs du formulaire
        const name = document.querySelector('#name').value
        const image = document.querySelector('#image').files[0]
        const imageName = document.querySelector('#image').value
        const category_parent = document.querySelector("#parent").value

        //variable qui signale la présence d'une erreur dans le formulaire
        var error = false

        //variable qui signale la présence d'une erreur au niveau du serveur
         var server_error = false

        //variable indiquant si l'utilisateur est connecté à internet
        var connected = window.navigator.onLine

        if(!connected){
            error = true
            setAlertMsg("Vous n'êtes pas connecté à internet!")
        }

        if(name === ""){
            error = true
            setAlertMsg("Veuillez renseigner le nom de la catégorie!")
        }

        if(imageName === "" && !update){
            error = true
            setAlertMsg("Veuillez choisir une image pour illustrer la catégorie!")
        }

        if(!update){
            //récupération des informations concernant la description par défaut
            var defaultDescription = document.querySelector('#description_defaultDescription').value
            var defaultSpecification = document.querySelector('#specification_defaultDescription').value
            var defaultLanguage = document.querySelector('#language_defaultDescription').value

            //récupération des informations sur les autres descriptions
            var descriptionsData = []

            descriptionsKeys.forEach((descriptionKey) => {
                const id = descriptionKey.value
                const description = document.querySelector('#description_' + id).value
                const specification = document.querySelector('#specification_' + id).value
                const language = document.querySelector('#language_' + id).value
    
                if(description === "" || specification === ""){
                    error = true
                    setAlertMsg("Veuillez bien remplir les descriptions.")
    
                }else{
                    descriptionsData.push({
                        description: description,
                        specification: specification,
                        language: language
                    })
                }
            })

            if(defaultDescription === ""){
                error = true
                setAlertMsg("Veuillez remplir la description par défaut.")
            }
    
            if(defaultSpecification === ""){
                error = true
                setAlertMsg("Veuillez remplir la spécification de la description par défaut.")
            }
        }

        if(error){
            setDisplayAlert(true)

        }else{
            setDisplayAlert(false)
            if(update){
                //dans le cas d'une mise à jour
                //construction de l'objet à envoger
                var formData = new FormData()

                formData.append("name", name)
                
                if(imageName !== ""){
                    formData.append("image", image)
                }
                
                formData.append("update_code", "YES")
                formData.append("update_code_product", "YES")

                if(category_parent != "null"){
                    formData.append("category_parent", category_parent)
                }

                //création de la requête
                var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/categories/' + itemToUpdate['id'] + "/";
                var request = new XMLHttpRequest();
                request.open('PATCH', requestURL);
                request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                request.responseType = 'json';

                request.send(formData);

                request.onload = function(){
                    var response = request.response
                    const requestStatus = request.status
                    
                    if(requestStatus === 200){
                        //la requête a réussi
                        //on remplace l'élément dans la liste des données
                        const index = categoriesList.findIndex(category => category['id'] === itemToUpdate['id'])

                        if(index > -1 && index < categoriesList.length){
                            categoriesList[index] = request.response
                        }

                        setUpdate(false)

                        //on retourne à la liste des catégories
                        setSpaceName('listCategories')
                    }
                }


            }else{
                //construction de l'objet à envoyer
                var formData = new FormData()

                formData.append("name", name)
                formData.append("image", image)
                formData.append("update_code", "YES")
                formData.append("update_code_product", "YES")

                if(category_parent != "null"){
                    formData.append("category_parent", category_parent)
                }
                
                //création de la requête
                var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/categories/';
                var request = new XMLHttpRequest();
                request.open('POST', requestURL);
                request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                request.responseType = 'json';

                request.send(formData);

                request.onload = function(){
                    var response = request.response;
                    const requestStatus = request.status
                    
                    if(requestStatus === 500){
                        server_error = true
                        setAlertMsg("Erreur au niveau du serveur. Il est possible que ce nom soit déjà utilisé pour une autre catégorie.")

                    }else if(requestStatus === 201){
                        //requête réussie
                        const category = response['id']

                        //on envoie la requête pour enregistrer la description par défaut
                        formData = new FormData()

                        formData.append("specification", defaultSpecification)
                        formData.append("description", defaultDescription)
                        formData.append("language", defaultLanguage)
                        formData.append("category", category)

                        //création de la requête
                        requestURL = "https://yowyob-apps-api.herokuapp.com/product-api/category_descriptions/"

                        var request2 = new XMLHttpRequest()
                        request2.open('POST', requestURL)
                        request2.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                        request2.responseType = 'json';

                        request2.send(formData)

                        request2.onload = function(){
                            console.log(request.response)
                            if(request2.status === 201){
                                console.log("good")
                            }
                            
                        }

                        //on envoie les requêtes pour enregistrer les autres descriptions
                        descriptionsData.forEach((item) =>{
                            formData = new FormData()

                            formData.append("specification", item['specification'])
                            formData.append("description", item['description'])
                            formData.append("language", item['language'])
                            formData.append("category", category)

                            var request3 = new XMLHttpRequest()
                            request3.open('POST', requestURL)
                            request3.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                            request3.responseType = 'json';

                            request3.send(formData)

                            request3.onload = function(){
                                console.log(request.response)
                                if(request2.status === 201){
                                    console.log("good")
                                }
                            }


                        })

                        //on retourne sur la page affichant la liste des 
                        setDisplaySuccessAlert(true)

                        //si la liste des catégories a déjà été chargée, on ajoute juste la nouvelle catégorie à la liste pour ne plus avoir à recherger toute la liste
                        //l'objet réponse de la requête contient l'objet catégorie insérée dans la base de données
                        setCategoriesList([response, ...categoriesList])

                        setSpaceName('listCategories')
                    }

                    if(server_error){
                        setDisplayAlert(true)

                    }else{
                        setDisplayAlert(false)
                    }
                }

            }

            
        }
        
        event.preventDefault()
    }

    return(
        <div className="container">
            <div className="row headSection">
                {
                    update ? <h4>Editer la catégorie {itemToUpdate['name']}</h4> : <h4>Créer une nouvelle catégorie</h4>
                }       
            </div>

            <div className="overflow-auto form-div" style={{height:"80vh"}}>
                <form>
                    <div className="form-section">
                        <div className="form-group row">
                            <label for="name" className="col-3 col-form-label label">Nom</label>
                            <div className="col-4">
                                <input type="text" className="form-control text-input" id="name" defaultValue={update ? itemToUpdate['name'] : "" } placeholder="nom de la catégorie"></input>
                            </div>
                        </div>
                        <div className="form-group row">
                                <label for="parent" className="col-3 col-form-label label">Catégorie parent</label>
                                <div className="col-3">
                                    <select id="parent" className="form-control select-input">
                                        {
                                            update ? <option selected value={categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category_parent'])]['id']} key={categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category_parent'])]['id']}>{categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category_parent'])]['name']}</option> : <option selected value="null">--aucune--</option>
                                        }
                                        {
                                            update ? <option selected value="null">--aucune--</option> : null
                                        }
                                        {
                                            categoriesList.map((category) => <option value={category['id']} key={category['id']}>{category['name']}</option>)
                                        }
                                    </select>                            
                                </div>
                        </div>
                        <div className="form-group row">
                                <label for="image" className="col-3 col-form-label label">Image</label>
                                <div className="col-8">
                                    <input type="file" className="form-control-file" id="image"/>                         
                                </div>
                        </div>
                    </div>

                    { !update ?
                        <div className="form-section" id="descriptions">
                            <h6>Descriptions</h6>
                            <hr></hr>
                            <label className="col-3 col-form-label label">Description par défaut</label>
                            <CategoryDescriptionForm descriptionId={"defaultDescription"} languagesList={languagesList} setLanguagesList={setLanguagesList}/>

                            {
                            descriptionsKeys.map((descriptionKey) => (<CategoryDescriptionForm key={"CategoryDescriptionForm_" + descriptionKey.value} descriptionId={descriptionKey.value} descriptionsKeys={descriptionsKeys} setDescriptionsKeys={setDescriptionsKeys} nbDescriptions={nbDescriptions} setNbDescriptions={setNbDescriptions} languagesList={descriptionKey.languages} setLanguagesList={setLanguagesList}/>))
                            }
                            
                            <div className="d-flex flex-row-reverse">
                                <button className="add-button" onClick={(event) => addDescription(event)}>
                                    <span className="fa fa-plus form-control-feedback font-weight-bold"></span>
                                    <span> Ajouter une description</span>
                                </button>
                            </div>
                            
                        </div>
                        :
                        null
                    }

                    <hr></hr>
                    {
                        displayAlert ? <div className="form-alert col-12" style={{marginBottom:"25px"}}>
                            {alertMsg}
                        </div> : null
                    }

                    <div className="d-flex justify-content-center" style={{marginBottom:"20px"}}>
                        <button className="save-button" type="submit" 
                                onClick={(event) => saveCategory(event)}>
                            <span className="fa fa-save form-control-feedback font-weight-bold"></span>
                            <span> Enregistrer</span>
                        </button>
                    </div>
    
                </form>     
                
            </div>
            
        </div> 
    );
}

export default CreateCategoryForm