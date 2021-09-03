import '../styles/Form.css'
import '../styles/Common.css'
import '../styles/Form.css'
import '../styles/smallDisplay.css'
import '../styles/bigDisplay.css'

import React, {useState} from 'react'

function CreateConditioningForm({setSpaceName, setDisplaySuccessAlert, 
    conditioningsList, setConditioningsList, update, setUpdate, itemToUpdate, setItemToUpdate, canDeleteConditioning, updateFromDetails, setUpdateFromDetails, item, setItem,

    conditioningsRequestURL,

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
    
    //fonction pour enregistrer le conditionnement//
    function saveConditioning(event){
        
        //récupération des valeurs du formulaire
        const name = document.querySelector('#name').value
        const description = document.querySelector('#description').value
        const quantity = document.querySelector('#quantity').value
    

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
            setAlertMsg("Veuillez renseigner le nom du conditionnement!")
        }

        if(description === ""){
            error = true
            setAlertMsg("Veuillez renseigner la description du conditionnement!")
        }

        if(quantity === ""){
            error = true
            setAlertMsg("Veuillez renseigner la quantité du conditionnement!")
        }


        if(error){
            setDisplayAlert(true)

        }else{
            setDisplayAlert(false)

            var formData = new FormData()

            //construction de l'objet à envoyer
            formData.append("name", name)
            formData.append("description", description)
            formData.append("quantity", quantity)

            var requestURL = ""
            var request = new XMLHttpRequest();

            if(update){
                //dans le cas d'une mise à jour
                //création de la requête
                var requestURL = conditioningsRequestURL + itemToUpdate['id'] + "/";
            
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
                        const index = conditioningsList.findIndex(conditionnement => conditionnement['id'] === itemToUpdate['id'])

                        if(index > -1 && index < conditioningsList.length){
                            conditioningsList[index] = request.response
                        }
    
                        setUpdate(false)

                        //on retourne à la liste des catégories
                        setSpaceName('listConditionings')
                    }
                }

            }else{
                //dans le cas de la création d'un nouveau conditionnement
                //construction de l'objet à envoyer            
                //création de la requête
                requestURL = conditioningsRequestURL
                request.open('POST', requestURL);
                request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                request.responseType = 'json';

                request.send(formData);

                request.onload = function(){
                    var response = request.response;
                    const requestStatus = request.status

                    if(requestStatus === 500){
                        server_error = true

                        setAlertMsg("Erreur au niveau du serveur. Il est possible que ce nom soit déjà utilisé pour un autre conditionnement.")

                    }else if(requestStatus === 201){
                        //requête réussie
                        //on retourne sur la page affichant la liste des taxes
                        setDisplaySuccessAlert(true)

                        //si la liste des conditionnements a déjà été chargée, on ajoute juste le nouveau conditionnement à la liste pour ne plus avoir à recharger toute la liste
                        //l'objet réponse de la requête contient l'objet conditionnement insérée dans la base de données
                        setConditioningsList([response, ...conditioningsList])
                        canDeleteConditioning.set(response['id'], true)
                        
                        setSpaceName('listConditionings')
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
                        setUpdate(false)
                        setDisplaySuccessAlert(false)
                        if(updateFromDetails){
                            //on retourne sur la liste des détails
                            setItem(itemToUpdate)
                            setSpaceName('details')

                        }else{
                            setSpaceName('listConditionings')
                        }
                    }}>
                        <span style={{color:"black", fontSize:"larger"}} className="fa fa-arrow-left" title="Retour à la liste"></span>
                    </a>
                </div> 

                {
                    update ? <h4>Editer le conditionnement {itemToUpdate['name']}</h4> : <h4 className="title-small-screens">Nouveau conditionnement</h4> 
                }
            </div>

            <div className="overflow-auto form-div contenu-form-small-screen" style={{height:"76vh"}}>
               
                <form>
                    <div className="form-section">
                        <div className="form-group row">
                            <label for="label" className="col-2 col-form-label label">Nom </label>
                            <div className="col-10 col-md-6">
                                {
                                    (update && !canDeleteConditioning.get(itemToUpdate['id'])) ?
                                    <input type="text" className="form-control text-input" id="name" defaultValue={update ? itemToUpdate['name'] : "" } placeholder="nom du conditionnement" disabled></input> :
                                    <input type="text" className="form-control text-input" id="name" defaultValue={update ? itemToUpdate['name'] : "" } placeholder="nom du conditionnement"></input> 
                                }
                            </div>
                        </div>

                        <div className="form-group row">
                            <label for="description" className="col-4 col-md-2 col-form-label label">Description</label>
                            <div className="col-8 col-md-6">
                                <textarea className="form-control text-input" id="description" defaultValue={update ? itemToUpdate['description'] : "" } placeholder="description du conditionnement"></textarea>
                            </div>
                        </div>

                        <div className="form-group row">
                                <label for="value" className="col-3 col-md-2 col-form-label label">Quantité</label>
                                <div className="col-6 col-md-2">
                                    {
                                        (update && !canDeleteConditioning.get(itemToUpdate['id'])) ?
                                        <input type="number" className="form-control text-input" id="quantity" defaultValue={update ? itemToUpdate['quantity'] : "" } placeholder="Quantité" disabled></input> :
                                        <input type="number" className="form-control text-input" id="quantity" defaultValue={update ? itemToUpdate['quantity'] : "" } placeholder="Quantité"></input>
                                    }                
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
                                onClick={(event) => saveConditioning(event)}>
                            <span className="fa fa-save form-control-feedback font-weight-bold"></span>
                            <span> Enregistrer</span>
                        </button>
                    </div>
                </form>    
            </div>
        </div> 
    );
}

export default CreateConditioningForm