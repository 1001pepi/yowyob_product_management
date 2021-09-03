import '../styles/Form.css'
import "../styles/Common.css"
import "../styles/smallDisplay.css"

import React, {useState} from 'react'

function CreateLanguageForm({setSpaceName, setDisplaySuccessAlert, 
   setLanguagesList, languagesList, canDeleteLanguage, setCanDeleteLanguage, update, setUpdate, itemToUpdate, setItemToUpdate,

   languagesRequestURL,

   userName, passWord
}){
    //etat pour contrôler l'affichage du message d'alerte pour le bon remplissage du formulaire
    const [displayAlert, setDisplayAlert] = useState(false)

    //etat contenant le message d'alerte à afficher pour le remplissage des formulaires
    const [alertMsg, setAlertMsg] = useState('')

    //fonction d'encodage des paramètres de connexion à l'API//
    function authenticateUser(user, password){
        var token = user + ":" + password;

        // Should i be encoding this value????? does it matter???
        // Base64 Encoding -> btoa
        var hash = btoa(token); 

        return "Basic " + hash;
    }

    //fonction pour enregistrer la catégorie//
    function saveLanguage(event){
        
        //récupération des valeurs du formulaire
        const code = document.querySelector('#code').value
        const name = document.querySelector('#name').value
    
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

        if(code === ""){
            error = true
            setAlertMsg("Veuillez renseigner le code la langue!")
        }

        if(name === ""){
            error = true
            setAlertMsg("Veuillez renseigner le nom de la langue!")
        }

        if(error){
            setDisplayAlert(true)

        }else{
            setDisplayAlert(false)

            //construction de l'objet à envoyer
            var formData = new FormData()

            formData.append("code", code)
            formData.append("name", name)
            formData.append("is_default", "NO")

            var requestURL = ""
            var request = new XMLHttpRequest();

            if(update){
                //dans le cas d'une mise à jour
                requestURL = languagesRequestURL + itemToUpdate['id'] + "/"
                request.open('PATCH', requestURL);
                request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                request.responseType = 'json';

                request.send(formData);

                request.onload = function(){
                    var response = request.response;
                    const requestStatus = request.status
                
                    console.log(requestStatus)
                    if(requestStatus === 400){
                        server_error = true
                        setAlertMsg("Erreur au niveau du serveur. Il est possible que ce nom soit déjà utilisé pour une autre langue.")

                    }else if(requestStatus === 200){
                        //requête réussie
                         //on remplace l'élément dans la liste des données
                         const index = languagesList.findIndex(language => language['id'] === itemToUpdate['id'])

                         if(index > -1 && index < languagesList.length){
                            languagesList[index] = response
                         }
     
                         setUpdate(false)
 
                         //on retourne à la liste des catégories
                         setSpaceName('listLanguages')
                    }

                    if(server_error){
                        setDisplayAlert(true)

                    }else{
                        setDisplayAlert(false)
                    }
                }

            }else{
                //dans le cas de la création d'une nouvelle langue
                requestURL = languagesRequestURL

                request.open('POST', requestURL);
                request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                request.responseType = 'json';

                request.send(formData);

                request.onload = function(){
                    var response = request.response;
                    const requestStatus = request.status
                

                    if(requestStatus === 500){
                        server_error = true
                        setAlertMsg("Erreur au niveau du serveur. Il est possible que ce nom soit déjà utilisé pour une autre langue.")

                    }else if(requestStatus === 201){
                        //requête réussie
                        //on retourne sur la page affichant la liste des langues
                        setDisplaySuccessAlert(true)

                        //si la liste des langues a déjà été chargée, on ajoute juste la nouvelle langue à la liste pour ne plus avoir à recharger toute la liste
                        //l'objet réponse de la requête contient l'objet langue insérée dans la base de données
                        // setLanguagesList([response, ...languagesList])
                        setLanguagesList([response, ...languagesList])
                        canDeleteLanguage.set(response['id'], true)
                        
                        setSpaceName('listLanguages')
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
                <div className="col-1 vertical-center hover-pointer">
                    <a id="delete" style={{color:"black", fontSize:"larger"}} onClick={() => {
                        setDisplaySuccessAlert(false)
                        setSpaceName('listLanguages')
                    }}>
                        <span style={{color:"black", fontSize:"larger"}} className="fa fa-arrow-left" title="Retour à la liste"></span>
                    </a>
                </div>

                {
                    update ? <h4 className="title-small-screens">Editer la langue {itemToUpdate['name']}</h4> : <h4 className="title-small-screens">Nouvelle langue</h4> 
                }

            </div>

            <div className="overflow-auto form-div contenu-form-small-screen" style={{height:"76vh"}}>
                
                <form>
                    <div className="form-section">
                        <div className="form-group row">
                                <label for="name" className="col-3 col-form-label label">Nom</label>
                                <div className="col-9 col-md-6">
                                    <input type="text" className="form-control text-input" id="name" placeholder="nom de la langue" defaultValue={update ? itemToUpdate['name'] : ''}></input>                         
                                </div>
                        </div>
                        <div className="form-group row">
                            <label for="code" className="col-3 col-form-label label">Code</label>
                            <div className="col-9 col-md-6">
                                <input type="text" className="form-control text-input" id="code" placeholder="code de la langue" defaultValue={update ? itemToUpdate['code'] : ''}></input>
                            </div>
                        </div>
                    </div>

                    <hr></hr>
                    {
                        displayAlert ? <div className="form-alert col-12" style={{marginBottom:"25px"}}>
                            {alertMsg}
                        </div> : null
                    }
                    <div className="d-flex justify-content-center">
                        <button className="save-button" type="submit" 
                                onClick={(event) => saveLanguage(event)}>
                            <span className="fa fa-save form-control-feedback font-weight-bold"></span>
                            <span> Enregistrer</span>
                        </button>
                    </div>                    
                </form>     
            </div>
        </div> 
    );
}

export default CreateLanguageForm