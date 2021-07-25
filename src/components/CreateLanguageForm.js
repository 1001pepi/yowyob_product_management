import '../styles/Form.css'
import "../styles/Common.css"

import React, {useState} from 'react'


function CreateLanguageForm({setSpaceName, setDisplaySuccessAlert, 
   setLanguagesList, languagesList}){

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

    //fonction pour enregistrer la catégorie//
    function saveLanguage(event){
        
        console.log("hello")
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
          
            
            //création de la requête
            var requestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/languages/';
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
                    setAlertMsg("Erreur au niveau du serveur. Il est possible que ce nom soit déjà utilisé pour une autre langue.")

                }else if(requestStatus === 201){
                    //requête réussie
                    //on retourne sur la page affichant la liste des langues
                    setDisplaySuccessAlert(true)

                    //si la liste des langues a déjà été chargée, on ajoute juste la nouvelle langue à la liste pour ne plus avoir à recharger toute la liste
                    //l'objet réponse de la requête contient l'objet langue insérée dans la base de données
                   // setLanguagesList([response, ...languagesList])
                    


                    setSpaceName('listLanguages')
                }

                if(server_error){
                    setDisplayAlert(true)

                }else{
                    setDisplayAlert(false)
                }
            }

        }
        
        event.preventDefault()
    }

    

    return(
        <div className="container">
            <div className="row headSection">
                <h4>Ajouter une nouvelle langue</h4> 
            </div>

            <div className="overflow-auto form-div" style={{height:"76vh"}}>
                
                <form>
                    <div className="form-section">
                        <div className="form-group row">
                            <label for="code" className="col-3 col-form-label label">Code</label>
                            <div className="col-6">
                                <input type="text" className="form-control text-input" id="code" placeholder="code de la langue"></input>
                            </div>
                        </div>
      
                        <div className="form-group row">
                                <label for="name" className="col-3 col-form-label label">Nom</label>
                                <div className="col-6">
                                    <input type="text" className="form-control text-input" id="name" placeholder="nom de la langue"></input>                         
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
                                onClick={(event) => saveLanguage(event)}>
                            <span className="fa fa-save form-control-feedback font-weight-bold"></span>
                            <span> Enregistrer</span>
                        </button>
                    </div>

                    {
                        false && <div className="animated fadeOutDown delay-1s slow test success-alert "> 
                            <div className="text-center" style={{paddingBottom:"5px"}}>
                                <h2></h2>Langue enregistrée!<h2></h2>
                            </div>
                        </div>
                    }
                    
                </form>     
                
            </div>
            
        </div> 
    );
}

export default CreateLanguageForm