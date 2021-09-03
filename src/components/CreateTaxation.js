import '../styles/Form.css'
import "../styles/Common.css"

import React, {useState} from 'react'


function CreateTaxation({setSpaceName, setDisplaySuccessAlert, 
    setTaxesList, taxesList, update, setUpdate, itemToUpdate, item, setItem, setItemToUpdate, updateFromDetails,  setUpdateFromDetails}){

    //etat pour contrôler l'affichage du message d'alerte pour le bon remplissage du formulaire
    const [displayAlert, setDisplayAlert] = useState(false)

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

    //fonction pour enregistrer la taxe//
    function saveTaxe(event){
        
        //récupération des valeurs du formulaire
        const label = document.querySelector('#label').value
        const value = document.querySelector('#value').value
        const description = document.querySelector('#description').value

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

        if(label === ""){
            error = true
            setAlertMsg("Veuillez renseigner le libellé de la taxe!")
        }

        if(value === ""){
            error = true
            setAlertMsg("Veuillez renseigner la valeur de la taxe!")
        }

        if(description === ""){
            error = true
            setAlertMsg("Veuillez renseigner la valeur de la taxe!")
        }

        if(error){
            setDisplayAlert(true)

        }else{
            setDisplayAlert(false)
            if(update){
                //dans le cas d'une mise à jour
                //construction de l'objet à envoyer
                var formData = new FormData()

                formData.append("label", label)
                
                if(value !== ""){
                    formData.append("value", value)
                }

                if(description !== ""){
                    formData.append("description", description)
                }
          
                 //création de la requête
                 var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/taxes/' + itemToUpdate['id'] + "/";
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
                         const index = taxesList.findIndex(taxe => taxe['id'] === itemToUpdate['id'])
 
                         if(index > -1 && index < taxesList.length){
                             taxesList[index] = request.response
                         }
 
                         setUpdate(false)
 
                         //on retourne à la liste des catégories
                         setSpaceName('listTaxes')
                     }
                 }

            }else{

            //construction de l'objet à envoyer
            var formData = new FormData()

            formData.append("label", label)
            formData.append("value", value)
            formData.append("description", description)
          
            
            //création de la requête
            var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/taxes/';
            var request = new XMLHttpRequest();
            request.open('POST', requestURL);
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
            request.responseType = 'json';

            request.send(formData);

            request.onload = function(){
                var response = request.response;
                const requestStatus = request.status

                console.log(response)

                if(requestStatus === 500){
                    server_error = true
                    setAlertMsg("Erreur au niveau du serveur. Il est possible que ce nom soit déjà utilisé pour une autre taxe.")

                }else if(requestStatus === 201){
                    //requête réussie
                    //on retourne sur la page affichant la liste des taxes
                    setDisplaySuccessAlert(true)

                    //si la liste des taxes a déjà été chargée, on ajoute juste la nouvelle taxe à la liste pour ne plus avoir à recharger toute la liste
                    //l'objet réponse de la requête contient l'objet taxe insérée dans la base de données
                   //setTaxesList([response, ...taxesList])
                    
                  

                    setSpaceName('listTaxes')
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
                            setSpaceName('listTaxations')
                        }
                    }}>
                        <span style={{color:"black", fontSize:"larger"}} className="fa fa-arrow-left" title="Retour à la liste"></span>
                    </a>
                </div>

                {
                    update ? <h4 className=" title-small-screens">Editer la taxe {itemToUpdate['label']}</h4> : <h4 className=" title-small-screens">Créer une nouvelle taxe</h4> 
                } 
                
            </div>

            <div className="overflow-auto form-div" style={{height:"76vh"}}>
               
                <form>
                    <div className="form-section">
                        <div className="form-group row">
                            <label for="label" className="col-3 col-form-label label">Libellé de la taxe</label>
                            <div className="col-6">
                                <input type="text" className="form-control text-input" id="label" defaultValue={update ? itemToUpdate['label'] : "" } placeholder="Libellé de la taxe"></input>
                            </div>
                        </div>
      
                        <div className="form-group row">
                                <label for="value" className="col-3 col-form-label label">Valeur</label>
                                <div className="col-6">
                                    <input type="number" className="form-control text-input" id="value" defaultValue={update ? itemToUpdate['value'] : "" } placeholder="Valeur de la taxe"></input>                         
                                </div>
                        </div>

                        <div className="form-group row">
                            <label for="description" className="col-3 col-form-label label">Description de la taxe</label>
                            <div className="col-6">
                                <input type="text" className="form-control text-input" id="description" defaultValue={update ? itemToUpdate['description'] : "" } placeholder="Description de la taxe"></input>
                            </div>
                        </div>
                    </div>

                    <hr></hr>

                    {
                    displayAlert ? <div className="alert">
                        {alertMsg}
                    </div> : null
                }
                    <div className="d-flex justify-content-center">
                        <button className="save-button" type="submit" 
                                onClick={(event) => saveTaxe(event)}>
                            <span className="fa fa-save form-control-feedback font-weight-bold"></span>
                            <span> Enregistrer</span>
                        </button>
                    </div>

                    {
                        false && <div className="animated fadeOutDown delay-1s slow test success-alert "> 
                            <div className="text-center" style={{paddingBottom:"5px"}}>
                                <h2></h2>Taxe enregistrée!<h2></h2>
                            </div>
                        </div>
                    }
                    
                </form>     
                
            </div>
            
        </div> 
    );
}

export default CreateTaxation