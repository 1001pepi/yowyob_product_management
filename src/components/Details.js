import '../styles/Common.css'
import '../styles/Details.css'

import {useState} from 'react'

function Details({spaceName, setSpaceName, itemType, item, setItem, data, setData, isASearchResult, setIsASearchResult}){
    //categories request url
    var categoriesRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/categories/'

    
    //informations relatives à l'affichage en détails d'une catégorie
    const [category_parent, setCategory_parent] = useState({})
    const [category_descriptions, setCategory_descriptons] = useState([])

    //etat contenant le message à afficher dans l'alerte de confirmation
    const [confirmAlertMsg, setConfirmAlertMsg] = useState('')

    //définition du titre de l'espace de travail
    let titleType

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

    switch(itemType){
        case 'categories':
            titleType = "Liste des catégories"
            break;
    }

    //fonction permettant de supprimer un élément//
    function deleteItem(){
        let requestURL

        //création de la requête
        switch(itemType){
            case 'categories':
                requestURL = categoriesRequestURL + item['id'] + "/"
                break;
        }

        var request = new XMLHttpRequest();
        
        request.open('DELETE', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            const requestStatus = request.status

            if(requestStatus === 204){
                //succès de la suppression
                //on supprime l'élément de la liste des data*/
                const deletedItemIndex = data.findIndex(tmpItem => tmpItem['id'] === item['id']);

                if(deletedItemIndex > -1){
                    
                    //on retire l'élément supprimé de la liste
                    const itemsList = data.filter(function(value, index, arr){
                        return index != deletedItemIndex
                    })
                    
                    setData(itemsList)

                     //on affiche l'élément suivant de la liste des datas
                    setItem(itemsList[(deletedItemIndex + 1) % itemsList.length])
                }
            }
        }

    }

    //fonction pour afficher l'élément reçu
    function displayItem(item){
        switch(itemType){
            case 'categories':
                //on crécupère la catégorie parent de l'élément
                //création de la requête
                var requestURL = categoriesRequestURL + item['category_parent'] + "/"
                var request = new XMLHttpRequest();
                
                request.open('GET', requestURL);
                request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                request.responseType = 'json';
                request.send();

                request.onload = function(){
                    if(request.status === 200){
                        setCategory_parent(request.response)
                    }
                }

                //on récupère la lste des descriptions de l'élément
                var requestURL2 = categoriesRequestURL + item['id'] + "/category_descriptions/"
                var request2 = new XMLHttpRequest();
                request2.open('GET', requestURL);
                request2.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
                request2.responseType = 'json';
                request2.send();

                request2.onload = function(){
                    if(request2.status === 200){
                        //la requête a réussi
                        setCategory_descriptons(request2.response['results'])
                    }
                }

                return(
                    <div className="container" style={{marginTop: "10px"}}>
                        <div className="row d-flex justify-content-center">
                            <div className="col-4">
                                <img className="illustration-image" src={item['image']} alt="image"></img>
                            </div>
                            <div className="col-6">
                                <div className="row">
                                    <span className="bold">Nom:&nbsp; </span> {item['name']}
                                </div>
                                <div className="row">
                                    <span className="bold">Code:&nbsp; </span> {item['code']}
                                </div>
                                <div className="row">
                                    <span className="bold">Catégorie parent:&nbsp; </span>{category_parent['name']}
                                </div>
                                <div className="row">
                                    <span className="bold">Date de création:&nbsp; </span>  {item['created_at']}
                                </div>
                                <div className="row">
                                    <span className="bold">Dernière modification:&nbsp; </span>  {item['update_at']}
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <div>
                                <h6>Descriptions</h6>
                                <hr></hr>
                            </div>
                            {
                                /*category_descriptions.map((description) => (
                                    <div style={{marginLeft:"40px"}}>
                                        <div className="row">
                                            <span className="bold">Specification:&nbsp; </span> {description['specification']}
                                        </div>
                                    </div>
                                ))*/
                            }
                        </div>
                    </div>
                );
                break;
        }
    }

    return(
        <div className="container">
             <div className="row headSection" style={{fontSize:"large"}}>
                 {
                    isASearchResult ? <h4 className="col-4">Résultats de la recherche</h4> :
                    <h4 className="col-4">{titleType}</h4>
                 }
                
                <div className="col-8 d-flex justify-content-end vertical-center hover-pointer">
                    <a id="delete" className="black-link" style={{color:"black", marginRight:"20px"}} 
                        onClick={() =>{
                        document.getElementById('delete').href="#confirm-delete-alert"
                        
                        switch(itemType){
                            case 'categories':
                                setConfirmAlertMsg("Voulez-vous supprimer la catégorie sélectionnée " + item['name'] + " ?")
                                break;
                        }
                    }
                    }>
                        <span className="material-icons md-48" title="supprimer">delete</span>
                    </a>

                    <span className="fa fa-caret-up" title="précédent" style={{fontSize:"x-large", marginRight:"10px"}} onClick={() =>{
                        //on remplace l'élément affiché par l'élément précédent dans la liste des datas
                        const itemIndex = data.findIndex(tmpItem => tmpItem['id'] === item['id']);

                        setItem(data[(itemIndex - 1 + data.length) % data.length])                        
                    }
                        
                    }></span>

                    <span className="fa fa-caret-down" title="suivant" style={{fontSize:"x-large"}} onClick={() =>{
                        //on remplace l'élément affiché par l'élément suivant dans la liste des datas
                        const itemIndex = data.findIndex(tmpItem => tmpItem['id'] === item['id']);

                        setItem(data[(itemIndex + 1) % data.length])                        
                    }
                        
                    }></span>
                </div>
            </div>

            {
                displayItem(item)
            }

            { 
                <div id="confirm-delete-alert" className="overlay">
                    <div className="container confirm-delete-alert bold-center" style={{fontSize:"large"}}>
                        <div className="row">
                            {confirmAlertMsg}
                        </div>
                        <div className="row d-flex justify-content-around" style={{marginBottom:"5px"}}>
                            <div className="col-6" onClick={() => {
                                //on supprime l'élément
                                deleteItem()
                            }
                            }>
                            <a  href="#" >Oui</a>
                            </div>
                                
                            <a className="col-6" href="#">Annuler</a>
                        </div>
                    </div>
                </div> 
            }
        </div>
    );
}

export default Details