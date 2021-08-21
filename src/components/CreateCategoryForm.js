import '../styles/Form.css'
import "../styles/Common.css"
import "../styles/smallDisplay.css"

import React, {useState} from 'react'

import CategoryDescriptionForm from './CategoryDescriptionForm'

function CreateCategoryForm({setSpaceName, setDisplaySuccessAlert, categoriesList, setCategoriesList, canDeleteCategory, setCanDeleteCategory, canDeleteLanguage, setCanDeleteLanguage, languagesList, setLanguagesList, update, setUpdate, itemToUpdate, setItemToUpdate, updateFromDetails, setUpdateFromDetails, item, setItem,

    categoriesDescriptionsRequestURL, categoriesRequestURL,

    userName, passWord
}){     
    //liste des clés des descriptions
    const [descriptionsKeys, setDescriptionsKeys] = useState([])

    //nombre de descriptions*/
    const [nbDescriptions, setNbDescriptions] = useState(0)

    //etat pour contrôler l'affichage du message d'alerte pour le bon remplissage du formulaire
    const [displayAlert, setDisplayAlert] = useState(false)

    //etat contenant le message d'alerte à afficher pour le remplissage des formulaires
    const [alertMsg, setAlertMsg] = useState('')

    //état contenant la liste des descriptions dans le cas d'une mise à jour
    const [descriptionsList, setDescriptionsList] = useState([])

    //état indiquant si le chargement des données dans le cas d'un update a déjà été fait
    const [dataUploaded, setDataUploaded] = useState(false)

    //liste des descriptions enregistrées
    var descriptionsIds = []

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

            for(var i = 0; i < nbDescriptions; i++){
                if(document.querySelector('#language_' + i) && (item['id'] === document.querySelector('#language_' + i).value)){
                    return false
                }
            }

            return true
        })

        if(tmpList.length){
            setDescriptionsKeys([...descriptionsKeys, {
                value: nbDescriptions,
                languages: tmpList
            }]);
            
            setNbDescriptions(nbDescriptions + 1);

        }else{
            var addDescriptionButton = document.getElementById("add-description-buton")

            if(addDescriptionButton){
                addDescriptionButton.disabled = true;
            }
        }

        event.preventDefault();
    }

    //si c'est une mise à jour on récupère la liste des descriptions de la catégorie
    if(update && !dataUploaded){
        var requestURL = itemToUpdate['list_of_category_descriptions']
        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
        request.responseType = 'json';

        request.send();

        request.onload = function(){
            var response = request.response
            const requestStatus = request.status
            
            if(requestStatus === 200){
                //la requête a réussi
                //on enregistre la liste des descriptions
                setDescriptionsList(response)

                //ajout des descriptions
                var tmpList = []
                var tmp = nbDescriptions

                for(let i = 0; i < response.length; i++){
                    tmpList.push({
                        value: tmp,
                        languages: languagesList,
                        descriptionItem: response[i]
                    });
                    
                    tmp++
                }

                setDescriptionsKeys(tmpList)
                setNbDescriptions(tmp);
            }
        }
        //on indique que les données ont été chargées
        setDataUploaded(true)
    }

    //fonction pour supprimer une description à partir de son index dans la liste des ids des descriptions de catégories enregistrée
    //la variable 'spécification' indique la spécification déjà utilisée ayant provoqué l'erreur dans le formulaire
    function deleteDescription(index, specification){
        if(index < descriptionsIds.length){
            var requestURL = categoriesDescriptionsRequestURL + descriptionsIds[index] + "/"

            var request = new XMLHttpRequest();
                
            request.open('DELETE', requestURL);
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
            request.responseType = 'json';
            request.send();

            request.onload = function(){
                const requestStatus = request.status
    
                if(requestStatus === 204){
                    //succès de la suppression
                    console.log("category description deleted")

                    //on supprime la description suivante
                    deleteDescription(index + 1, specification)
                }
            }

        }else{
            //toutes les descriptions ont été supprimées
            //on affiche l'erreur à l'utilisateur
            setAlertMsg("La spécification '" + specification + "' est déjà utilisée pour une autre description!")
            setDisplayAlert(true)
        }
    }

    //fonction pour enregistrer les descriptions
    function saveDescription(descriptionsData, category, index){
        if(index < descriptionsData.length){

            var item = descriptionsData[index]
            var requestURL = ""
            var formData = new FormData()

            formData.append("specification", item['specification'])
            formData.append("description", item['description'])
            formData.append("language", item['language'])

            var request3 = new XMLHttpRequest()

            if(item['descriptionItem']){
                //il s'agit de la mise à jour d'une description
                requestURL = item['descriptionItem']['url']
                request3.open('PATCH', requestURL)

                request3.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                request3.responseType = 'json';

                request3.send(formData)

                request3.onload = function(){
                    
                    if(request3.status === 200){
                        //la requête a réussi
                        //on enregistre la description suivante
                        saveDescription(descriptionsData, category, index + 1)
                    }
                }

            }else{
                //il s'agit de la création d'une nouvelle catégorie
                requestURL = categoriesDescriptionsRequestURL

                formData.append("category", category['id'])

                request3.open('POST', requestURL)
                request3.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                request3.responseType = 'json';

                request3.send(formData)

                request3.onload = function(){
                    
                    if(request3.status === 201){
                        //la requête a réussi
                        //on indique que la langue utilisée pour la description ne peut plus être supprimée
                        canDeleteLanguage.set(item['language'], false)

                        //on ajoute son id à la liste des descriptons enregistrées
                        descriptionsIds.push(request3.response['id'])

                        //on enregistre la description suivante
                        saveDescription(descriptionsData, category, index + 1)

                    }else if(request3.status === 400){
                         //erreur au niveau du serveur; une description avec la spécification existe déjà
                         //il faut supprimer les nouvelles descriptions créées et signaler l'erreur
                        deleteDescription(0, item['specification'])
                    }
                }
            }

        }else{

            if(!update){
                //il s'agit pas d'une mise à jour
                //si la liste des catégories a déjà été chargée, on ajoute juste la nouvelle catégorie à la liste pour ne plus avoir à recherger toute la liste
                setCategoriesList([category, ...categoriesList])
                canDeleteCategory.set(category['id'], true)
            }

            setUpdate(false)

            //on retourne à la liste des catégories
            setDisplaySuccessAlert(true)
            setSpaceName('listCategories')

        }
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
                if(descriptionKey['descriptionItem']){
                    descriptionsData.push({
                        description: description,
                        specification: specification,
                        language: language,
                        descriptionItem: descriptionKey['descriptionItem']
                    })
                }else{
                    descriptionsData.push({
                        description: description,
                        specification: specification,
                        language: language
                    })
                } 
            }
        })
        
        if(error){
            setDisplayAlert(true)

        }else{
            setDisplayAlert(false)

            if(update){
                //dans le cas d'une mise à jour
                //construction de l'objet à envoger pour la mise à jour de la catégorie
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
                var requestURL = itemToUpdate['url'];
                var request = new XMLHttpRequest();
                request.open('PATCH', requestURL);
                request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                request.responseType = 'json';

                request.send(formData);

                request.onload = function(){
                    var response = request.response
                    const requestStatus = request.status

                    console.log(response)
                    
                    if(requestStatus === 200){
                        //la requête a réussi
                        setDisplayAlert(false)

                        //on remplace l'élément dans la liste des données
                        const index = categoriesList.findIndex(category => category['id'] === itemToUpdate['id'])

                        if(index > -1 && index < categoriesList.length){
                            categoriesList[index] = request.response
                        }

                        //on enregistre les descriptions
                        saveDescription(descriptionsData, itemToUpdate, 0)
                    }else if(requestStatus === 400 || requestStatus === 424){

                        setAlertMsg("Erreur au niveau du serveur. Il est possible que ce nom soit déjà utilisé pour une autre catégorie.")
                        setDisplayAlert(true)
                    }
                }

            }else{
                //dans le cas de la création d'un nouvel objet
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
                var requestURL = categoriesRequestURL;
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

                        //on indique que la catégorie parent ne peut plus être supprimée
                        if(category_parent != "null"){
                            canDeleteCategory.set(category_parent, false)
                        }

                        //on envoie les requêtes pour enregistrer les descriptions
                        saveDescription(descriptionsData, response, 0)         
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
                    update ? <h4>Editer la catégorie {itemToUpdate['name']}</h4> : <h4>Nouvelle catégorie</h4>
                }
                <div className="col-5 d-flex justify-content-end vertical-center hover-pointer">
                    <a id="delete" style={{color:"black", fontSize:"larger"}} onClick={() => {
                        setUpdate(false)
                        setDisplaySuccessAlert(false)
                        if(updateFromDetails){
                            //on retourne sur la liste des détails
                            setItem(itemToUpdate)
                            setSpaceName('details')

                        }else{
                            setSpaceName('listCategories')
                        }
                    }}     
                    style={{marginRight:"90px"}}>
                        <span style={{color:"black", fontSize:"larger"}} className="fa fa-arrow-left" title="Retour à la liste"></span>
                    </a>
                </div>      
            </div>

            <div className="overflow-auto form-div contenu-form-small-screen" style={{height:"80vh"}}>
                <form>
                    <div className="form-section">
                        <div className="form-group row">
                            <label for="name" className="col-3 col-form-label label">Nom</label>
                            <div className="col-9 col-md-4">
                            {
                                (canDeleteCategory.get(itemToUpdate['id']) || !update) ?
                                    <input type="text" className="form-control text-input" id="name" defaultValue={update ? itemToUpdate['name'] : "" } placeholder="nom de la catégorie"></input> :
                                    <input type="text" className="form-control text-input" id="name" defaultValue={update ? itemToUpdate['name'] : "" } placeholder="nom de la catégorie" disabled></input>
                            }
                            </div>
                        </div>
                        <div className="form-group row">
                                <label for="parent" className="col-3 col-form-label label">Catégorie parent</label>
                                <div className="col-9 col-md-3">
                                    {
                                        (canDeleteCategory.get(itemToUpdate['id']) || !update) ?
                                            <select id="parent" className="form-control select-input">
                                                {
                                                    update ? <option selected value={categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category_parent'])]['id']} key={categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category_parent'])]['id']}>{categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category_parent'])]['name']}</option> : <option selected value="null">--aucune--</option>
                                                }
                                                {
                                                    update ? <option value="null">--aucune--</option> : null
                                                }
                                                {
                                                    categoriesList.map((category) => <option value={category['id']} key={category['id']}>{category['name']}</option>)
                                                }
                                            </select> :
                                            <select id="parent" className="form-control select-input" disabled>
                                            {
                                                update ? <option selected value={categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category_parent'])]['id']} key={categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category_parent'])]['id']}>{categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category_parent'])]['name']}</option> : <option selected value="null">--aucune--</option>
                                            }
                                            {
                                                update ? <option value="null">--aucune--</option> : null
                                            }
                                            {
                                                categoriesList.map((category) => <option value={category['id']} key={category['id']}>{category['name']}</option>)
                                            }
                                        </select>
                                    }                            
                                </div>
                        </div>
                        <div className="form-group row">
                                <label for="image" className="col-3 col-form-label label" style={{marginTop:"auto", marginBottom:"auto"}}>Image</label>
                                {
                                    update ? <img src={itemToUpdate['image']} alt="image" style={{height:"90px"}}/> : null
                                }
                                <div className={"col-9 col-md-5" + (update ? " not-display-on-small-screens" : "")} style={{marginTop:"auto", marginBottom:"auto"}}>
                                    <input type="file" className="form-control-file" id="image" accept="image/*"/>                         
                                </div>
                        </div>
                        <div className="form-group row">
                            {
                                update && <div className="display-on-small-screens" style={{marginTop:"auto", marginBottom:"auto", marginLeft:"40px"}}>
                                    <input type="file" className="form-control-file" id="image" accept="image/*"/>                         
                                </div>
                            } 
                        </div>
                    </div>

                    {
                        <div className="form-section" id="descriptions">
                            <h6>Descriptions</h6>
                            <hr></hr>
                    
                            {
                                descriptionsKeys.map((descriptionKey) => (<CategoryDescriptionForm key={"CategoryDescriptionForm_" + descriptionKey.value} descriptionId={descriptionKey.value} descriptionsKeys={descriptionsKeys} setDescriptionsKeys={setDescriptionsKeys} nbDescriptions={nbDescriptions} setNbDescriptions={setNbDescriptions} languagesList={descriptionKey.languages} setLanguagesList={setLanguagesList} descriptionItem={descriptionKey.descriptionItem}/>))
                            }
                            
                            <div className="d-flex flex-row-reverse">
                                <button className="add-button" id="add-description-buton" onClick={(event) => addDescription(event)}>
                                    <span className="fa fa-plus form-control-feedback font-weight-bold"></span>
                                    <span> Ajouter une description</span>
                                </button>
                            </div>
                            
                        </div>
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