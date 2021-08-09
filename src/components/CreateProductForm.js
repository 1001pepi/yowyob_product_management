import '../styles/Form.css'

import React, {useState} from 'react'

import ProductDescriptionForm from './ProductDescriptionForm'
import Conditioning from './Conditioning'
import ProductIllustrationForm from './ProductIllustrationForm'

function CreateProductForm({setSpaceName, setDisplaySuccessAlertProduct, categoriesList, canDeleteCategory, setCanDeleteCategory,
    conditioningsList, canDeleteConditioning, setCanDeleteConditioning,
    languagesList, canDeleteLanguage, setCanDeleteLanguage,
    productsList, setProducsList, packagingsList, setPackagingsList,  productsCategories, setProductsCategories,
    setDisplaySuccessAlert, update, setUpdate, itemToUpdate, setItemToUpdate
}){
    //products request url
    var productsRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/products/'

    //products details request url
    var productsDetailsRequestURL = "https://yowyob-apps-api.herokuapp.com/product-api/product_details/"

    //products description request url
    var productsDescriptionsRequestURL = "https://yowyob-apps-api.herokuapp.com/product-api/product_descriptions/"

    //product packaging request url
    var productsPackaginsRequestURL = "https://yowyob-apps-api.herokuapp.com/product-api/product_packagings/"

    //products illustrations request url
    var productsIllustrationsRequestURL = 'https://yowyob-apps-api.herokuapp.com/product-api/product_illustrations/'

    //liste des clés des descriptions de produits
    const [descriptionsKeys, setDescriptionsKeys] = useState([])

    //nombre de descriptions supplémentaire en dehors de la description par défaut*/
    const [nbDescriptions, setNbDescriptions] = useState(0)


    //liste des clés des conditionnements d'achat
    const [purchaseConditioningsKeys, setPurchaseConditioningsKeys] = useState([])

    //liste des clés des conditionnements de vente
    const [saleConditioningsKeys, setSaleConditioningsKeys] = useState([])

    //nombre de conditionnements
    const [nbConditionings, setNbConditionings] = useState(0)


    //liste des clés des illustrations
    const [illustrationsKeys, setIllustrationsKeys] = useState([])

    //nombre de illustrations supplémentaire en dehors de la description par défaut*/
    const [nbIllustrations, setNbIllustrations] = useState(0)  


    //etat pour contrôler l'affichage du message d'alerte pour le bon remplissage du formulaire
    const [displayAlert, setDisplayAlert] = useState(false)

    //etat contenant le message d'alerte à afficher pour le remplissage des formulaires
    const [alertMsg, setAlertMsg] = useState('')

    //état indiquant si le chargement des données dans le cas d'un update a déjà été fait
    const [dataUploaded, setDataUploaded] = useState(false)

    //états contenant les données du produit en cas de mise à jour
    const [details, setDetails] = useState({})
    const [descriptionsList, setDescriptionsList] = useState([])

    //états contenant les éléments déjà enregistrés du formulaire
    var [detailsId, setDetailsId] = useState("")
    var [descriptionsIds, setDescriptionsIds] = useState([])
    var [productId, setProductId] = useState("")

    //données du formulaire
    var descriptionsData = []
    var purchaseConditioningsData = []
    var saleConditioningsData = []
    var illustrationsData = []

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

    //si c'est une mise à jour on récupère les données du produit
    if(update && !dataUploaded){
        //on indique que les données ont été chargées
        setDataUploaded(true)

        //on récupère les détails du produit
        var requestURL = itemToUpdate['product_detail']
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
                //on enregistre les détails
                setDetails(response)

                //chargement de la liste des descriptions
                requestURL = itemToUpdate['product_description_list']
                var request2 = new XMLHttpRequest();
                request2.open('GET', requestURL);
                request2.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                request2.responseType = 'json';

                request2.send()

                request2.onload = function (){
                    var response2 = request2.response

                    if(request2.status === 200){
                        //la requête a réusssi
                        setDescriptionsList(response2)

                        //ajout des descriptions
                        var tmpList = []
                        var tmp = nbDescriptions

                        for(let i = 0; i < response2.length; i++){
                            tmpList.push({
                                value: tmp,
                                languages: languagesList,
                                descriptionItem: response2[i]
                            });
                            
                            tmp++
                        }

                        setDescriptionsKeys(tmpList)
                        setNbDescriptions(tmp);
                        
                        //chargement des conditionnemnts du produit
                        requestURL = itemToUpdate['conditionnings_list']
                        
                        var request3 = new XMLHttpRequest();
                        request3.open('GET', requestURL);
                        request3.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                        request3.responseType = 'json';

                        request3.send()

                        request3.onload = function (){
                            var response3 = request3.response //contient la liste des conditionnements du produit
                            
                            if(request3.status === 200){
 
                                var tmpPurchaseConditionningsKeys = []
                                var tmpSaleConditionningsKeys = []
                                var tmpNbConditionings = nbConditionings
                                
                                for(let i = 0; i < response3.length; i++){
            
                                    //traitement du conditionnement
                                    //on cherche dans la liste des packagings pour savoir s'il s'agit d'un conditionnement d'achat
                                    var packagingIndex = packagingsList.findIndex(item => (item['product'] === itemToUpdate['id'] && item['conditioning'] === response3[i]['id'] && item['type_packaging'] == "PURCHASE"))

                                    if(packagingIndex >= 0 && packagingIndex < packagingsList.length){
                                        //le packaging a été trouvé comme packaging d'achat
                                        var packaging = packagingsList[packagingIndex]
                                       
                                        tmpPurchaseConditionningsKeys.push({
                                            value: tmpNbConditionings,
                                            conditionings: conditioningsList,
                                            conditioningItem: response3[i],
                                            packagingItem: packaging
                                        });

                                        tmpNbConditionings++
                                    }

                                    //on cherche dans la liste des packagings pour savoir s'il s'agit d'un conditionnement de vente
                                    packagingIndex = packagingsList.findIndex(item => (item['product'] === itemToUpdate['id'] && item['conditioning'] === response3[i]['id'] && item['type_packaging'] == "SALE"))

                                    if(packagingIndex >= 0 && packagingIndex < packagingsList.length){
                                        //le packaging a été trouvé comme packaging de vente
                                        var packaging = packagingsList[packagingIndex]

                                        tmpSaleConditionningsKeys.push({
                                            value: tmpNbConditionings,
                                            conditionings: conditioningsList,
                                            conditioningItem: response3[i],
                                            packagingItem: packaging
                                        });

                                        tmpNbConditionings++
                                    }
                                }

                                setPurchaseConditioningsKeys(tmpPurchaseConditionningsKeys)
                                setSaleConditioningsKeys(tmpSaleConditionningsKeys)
                                setNbConditionings(tmpNbConditionings)

                                //récupération des illustrations du produit
                                requestURL = itemToUpdate['product_illustration_list']
                                
                                var request4 = new XMLHttpRequest();
                                request4.open('GET', requestURL);
                                request4.setRequestHeader("Authorization", authenticateUser(userName, passWord));
                                request4.responseType = 'json';

                                request4.send()

                                request4.onload = function (){
                                    var response4 = request4.response

                                    if(request4.status === 200){

                                        var tmpIllustrationsKeys = []
                                        var tmpNbIllustrations = nbIllustrations

                                        for(let i = 0; i < response4.length; i++){
                                            tmpIllustrationsKeys.push({
                                                value: tmpNbIllustrations,
                                                illustrationItem: response4[i]
                                            })

                                            tmpNbIllustrations++
                                        }

                                        setIllustrationsKeys(tmpIllustrationsKeys)
                                        setNbIllustrations(tmpNbIllustrations)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }        
    }

    //fontion pur ajouter une nouvelle description
    function addDescription(event){
        const tmpList = languagesList.filter(function(item, index, arr){

            for(var i = 0; i < nbDescriptions; i++){
                if(document.querySelector('#language_' + i) && (item['id'] === document.querySelector('#language_' + i).value)){
                    return false
                }
            }
            
            return true
        })

        setDescriptionsKeys([...descriptionsKeys, {
            value: nbDescriptions,
            languages: tmpList
        }]);
        
        setNbDescriptions(nbDescriptions + 1);

        event.preventDefault();
    }

    //fonction pour ajouter un nouveau conditionnement d'achat
    function addPurchaseConditioning(event){
        const tmpList = conditioningsList.filter(function(item, index, arr){
            for(let i = 0; i < purchaseConditioningsKeys.length; i++){
                var k = purchaseConditioningsKeys[i].value

                if(document.querySelector('#conditioning_' + k) && (item['id'] === document.querySelector('#conditioning_' + k).value)){
                    return false
                }
            }

            return true
        })

        setPurchaseConditioningsKeys([...purchaseConditioningsKeys, {
            value: nbConditionings,
            conditionings: tmpList
        }]);
        
        setNbConditionings(nbConditionings + 1);

        event.preventDefault();
    }

    //fonction pour ajouter un nouveau conditionnement de vente
    function addSaleConditioning(event){
        const tmpList = conditioningsList.filter(function(item, index, arr){

            for(let i = 0; i < saleConditioningsKeys.length; i++){
                var k = saleConditioningsKeys[i].value

                if(document.querySelector('#conditioning_' + k) && (item['id'] === document.querySelector('#conditioning_' + k).value)){
                    return false
                }
            }

            return true
        })

        setSaleConditioningsKeys([...saleConditioningsKeys, {
            value: nbConditionings,
            conditionings: tmpList
        }]);
        
        setNbConditionings(nbConditionings + 1);

        event.preventDefault();
    }

    //fonction pour ajouter une nouvelle illustration du produit
    function addIllustration(event){
        setIllustrationsKeys([...illustrationsKeys, {
            value: nbIllustrations
        }]);
        
        setNbIllustrations(nbIllustrations + 1);

        event.preventDefault();
    }

    //fonction pour enregistrer les details du produit//
    function saveDetails(model, mark, weight, conservation, origin, composition, productId){
       
        //construction de l'objet à envoyer
        var formData = new FormData()

        formData.append("model", model)
        formData.append("mark", mark)
        formData.append("weight", weight)
        formData.append("conservation", conservation)
        formData.append("origin", origin)
        formData.append("composition", composition)
        formData.append("product", productId)
            
        //création de la requête
        if(update){
            var requestURL = details['url']
            productId = itemToUpdate['id']
        }else{
            var requestURL = productsDetailsRequestURL
        }

        var request = new XMLHttpRequest();
        if(update){
            request.open('PATCH', requestURL);
        }else{
            request.open('POST', requestURL);
        }
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
        request.responseType = 'json';

        request.send(formData);
 
        request.onload = function(){
            var response = request.response;
            const requestStatus = request.status
           
            if(requestStatus === 201){
                //requête réussie 
                console.log("détails enregistrés")

                detailsId = response['id']
                saveProductDescriptions(productId, 0)
            }else if(requestStatus === 200){
                //la mise à jour des détails a réussi
                console.log("mise à jour des détails réussie")

                saveProductDescriptions(itemToUpdate['id'], 0)
            }   
        }
    }

    //fonction pour supprimer les détails d'un produit
    function deleteProductDetails(){
        var requestURL = productsDetailsRequestURL + detailsId + "/"
        var request = new XMLHttpRequest();
            
        request.open('DELETE', requestURL);
        request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
        request.responseType = 'json';
        request.send();

        request.onload = function(){
            const requestStatus = request.status

            if(requestStatus === 204){
                //succès de la suppression
                console.log("product details deleted")

                //affichage du message d'erreur
                const specification = descriptionsData[descriptionsIds.length]['specification']
                setAlertMsg("La specification '" + specification + "' est déjà utilisée pour une autre description!")
                setDisplayAlert(true) 
            }
        }
    }

    //fonction pour supprimer une description à partir de son index dans la liste des ids des descriptions de produits enregistrées
    function deleteDescription(index){
        if(index < descriptionsIds.length){
            var requestURL = productsDescriptionsRequestURL + descriptionsIds[index] + "/"

            var request = new XMLHttpRequest();
                
            request.open('DELETE', requestURL);
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord)); 
            request.responseType = 'json';
            request.send();

            request.onload = function(){
                const requestStatus = request.status

                if(requestStatus === 204){
                    //succès de la suppression
                    console.log("product description deleted")

                    //on supprime la description suivante
                    deleteDescription(index + 1)
                }
            }

        }else{
            //toutes les descriptions ont été supprimées
            //suppression des détails du produit
            deleteProductDetails()
        }
    }

    //fonction pour enregistrer les descriptions du produit//
    function saveProductDescriptions(productId, index){
        if(index < descriptionsData.length){
            var requestURL = ""

            const item = descriptionsData[index]

            if(item['descriptionItem']){
                //il s'agit de la mise à jour d'une description
                productId = itemToUpdate['id']
                requestURL = item['descriptionItem']['url']
            }else{
                requestURL = productsDescriptionsRequestURL
            }

            var formData = new FormData()

            formData.append("specification", item['specification'])
            formData.append("description", item['description'])
            formData.append("language", item['language'])

            if(!item['descriptionItem']){
                console.log("nouvelle description")
                //il s'agit de la création d'une nouvelle description
                formData.append("product", productId)
            }
           
            var request = new XMLHttpRequest()
            if(item['descriptionItem']){
                //il s'agit de la mise à jour d'une description
                request.open('PATCH', requestURL)
            }else{
                request.open('POST', requestURL)
            }
            
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
            request.responseType = 'json';

            request.send(formData)

            request.onload = function(){
                
                if(request.status === 400){
                    //erreur au niveau du serveur; une description avec la spécification existe déjà
                    //il faut supprimer les données relatives au produit déjà enregistrées et inviter l'utilisateur à corriger l'erreur
                    //suppression des détails du produit

                    //suppression des autres descriptions du produit
                    deleteDescription(0)
        
                }else if(request.status === 201){
                    //requête réussie
                    console.log("description enregistrée")
                    //on enregistre l'id de la description
                    descriptionsIds.push(request.response['id'])

                    //la langue utilisée pour la description ne peut plus être supprimée
                    canDeleteLanguage.set(item['language'], false)

                    //on enregistre la description suivante
                    saveProductDescriptions(productId, index + 1)
                }else if(request.status === 200){
                    //mise à jour de la description réussie
                    console.log("mise à jour de la description réussie")

                    //on enregistre la description suivante
                    saveProductDescriptions(productId, index + 1)
                }
            }  
        }else{
            savePurchaseConditioning(productId, 0)
        }     
    }

    //fonction pour enregistrer les conditionnents; celà se fait en crééant des packagings liant le produit et ses conditionnements
    function savePurchaseConditioning(productId, index){
        if(index < purchaseConditioningsData.length){
            var requestURL = ""

            const item = purchaseConditioningsData[index]

            if(item['packagingItem']){
                productId = itemToUpdate['id']
                requestURL = item['packagingItem']['url']
            }else{
                requestURL = productsPackaginsRequestURL
            }

            var formData = new FormData()

            if(item['image']){
                formData.append("picture", item['image'])
            }

            if(!item['packagingItem']){
                //s'il s'agit de la création d'un nouveau conditionnement
                formData.append("product", productId)
                formData.append("conditioning", item['conditioning'])
                formData.append("type_packaging", "PURCHASE")
            }
            
            var request = new XMLHttpRequest()
            if(item['packagingItem']){
                request.open('PATCH', requestURL)
            }else{
                request.open('POST', requestURL)
            }
            
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
            request.responseType = 'json';

            request.send(formData)

            request.onload = function(){      
                
                if(request.status === 201){
                    //requête de création réussie
                    console.log("conditionnement d'achat enregistré")

                    //le conditionnement utilisé ne peut plus être supprimé
                    canDeleteConditioning.set(item['conditioning'], false)

                    //ajout du nouveau packaging à la liste des packagings
                    setPackagingsList([request.response, ...packagingsList])

                    //on enregistre le conditionnement suivant
                    savePurchaseConditioning(productId, index + 1)
                }else if(request.status === 200){
                    //la mise à jour du conditionnement a réussi
                    console.log("mise à jour du conditionnement réussi")

                    //on enregistre le conditionnement suivant
                    savePurchaseConditioning(productId, index + 1)
                }
            }

        }else{
            //tous les conditionnements d'achat on été enregistrés. On enregistre maintenant les conditionnements de vente
           saveSaleConditioning(productId, 0)
        }

    }

    function saveSaleConditioning(productId, index){
        if(index < saleConditioningsData.length){
            var requestURL = productsPackaginsRequestURL

            const item = saleConditioningsData[index]

            if(item['packagingItem']){
                requestURL = item['packagingItem']['url']
            }else{
                requestURL = productsPackaginsRequestURL
            }

            var formData = new FormData()

            if(item['image']){
                formData.append("picture", item['image'])
            }

            if(!item['packagingItem']){
                //il s'agit de la création d'un nouveau conditionnement
                formData.append("product", productId)
                formData.append("conditioning", item['conditioning'])
                formData.append("type_packaging", "SALE")
            }

            var request = new XMLHttpRequest()
            if(item['packagingItem']){
                request.open('PATCH', requestURL)
            }else{
                request.open('POST', requestURL)
            }

            request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
            request.responseType = 'json';

            request.send(formData)

            request.onload = function(){
                if(request.status === 201){
                    //requête réussie
                    console.log("conditionnement de vente enregistré")

                    //le conditionnement utilisé ne peut plus être supprimé
                    canDeleteConditioning.set(item['conditioning'], false)

                    //ajout du nouveau packaging à la liste des packagings
                    setPackagingsList([request.response, ...packagingsList])

                    //on enregistre le conditionnement suivant
                    saveSaleConditioning(productId, index + 1)
                }else if(request.status === 200){
                    //la mise à jour du conditionnement a réussi
                    console.log("mise à jour du conditionnement réussi")

                    //on enregistre le conditionnement suivant
                    saveSaleConditioning(productId, index + 1)
                }
            }

        }else{
            //tous les conditionnements de vente on été enregistrés. On enregistre maintenant les illustrations du produit
            saveIllustration(productId, 0)
        }

    }
    
    //fonction pour enregistrer les illustrations du produit
    function saveIllustration(productId, index){
        if(index < illustrationsData.length){
            const item = illustrationsData[index]

            //construction de l'objet à envoyer
            var formData = new FormData()
    
            formData.append("type_illustration", item['type_illustration'])

            if(!item['illustrationItem']){
                formData.append("product", productId)
                formData.append("illustration", item['illustration'])
            }
            
            //création de la requête
            var requestURL = ""

            if(item['illustrationItem']){
                console.log("his")
                requestURL = item['illustrationItem']['url']

            }else{
                requestURL = productsIllustrationsRequestURL
            }

            var request = new XMLHttpRequest();

            if(item['illustrationItem']){
                request.open('PATCH', requestURL);

            }else{
                request.open('POST', requestURL);
            }
           
            request.setRequestHeader("Authorization", authenticateUser(userName, passWord));
            request.responseType = 'json';
    
            request.send(formData);
    
            request.onload = function(){
                var response = request.response;
                const requestStatus = request.status

                if(requestStatus === 201){
                    //requête réussie
                    console.log("illustration enregistrée")

                    //enregistrement de l'illustration suivane
                    saveIllustration(productId, index + 1)
                }else if(requestStatus === 200){
                    //la mise à jour de l'illustration a réussi
                    console.log("illustration mise à jour")

                    //enregistrement de l'illustration suivane
                    saveIllustration(productId, index + 1)
                } 
            }
        }else{
            setDisplaySuccessAlert(true)

            //toutes les illustrations ont été enregistrées
            //L'enregistrement des données du formulaire est terminée.
            //on retourne à la liste des produits
            setSpaceName('listProducts')
        }
    }

    /*fonction pour enregistrer le produit*/
    function saveProduct(event){
         //variable qui signale la présence d'une erreur dans le formulaire
         var error = false

         //variable qui signale la présence d'une erreur au niveau du serveur
         var server_error = false

        //on récupère les valeurs du formulaire relatives au produit
        const name = document.querySelector('#name').value
        const category = document.querySelector('#category').value

        //on récupére les valeurs du formulaire relatives aux détails du produit
        const model = document.querySelector('#model').value
        const mark = document.querySelector('#mark').value
        const weight = document.querySelector('#weight').value
        const conservation = document.querySelector('#conservation').value
        const origin = document.querySelector('#origin').value
        const composition = document.querySelector('#composition').value

        //récupération des informations sur les descriptions
        descriptionsKeys.forEach((descriptionKey) => {
            const id = descriptionKey.value
            const description = document.querySelector('#description_' + id).value
            const specification = document.querySelector('#specification_' + id).value
            const language = document.querySelector('#language_' + id).value

            if(description === "" || specification === ""){
                error = true
                setAlertMsg("Veuillez bien remplir les descriptions!")

            }else{
                descriptionsData.push({
                    description: description,
                    specification: specification,
                    language: language,
                    descriptionItem: descriptionKey.descriptionItem
                })
            }
        })

        //récupération des informations sur les conditionnements d'achat
        purchaseConditioningsKeys.forEach((conditioningKey) => {
            const id = conditioningKey.value
            const conditioning = document.querySelector('#conditioning_' + id).value
            const imageName = document.querySelector('#illustration_' + id).value
            const image = document.querySelector('#illustration_' + id).files[0]

            if(imageName === ""){
                purchaseConditioningsData.push({
                    conditioning: conditioning,
                    packagingItem: conditioningKey.packagingItem
                })
            }else{
                purchaseConditioningsData.push({
                    conditioning: conditioning,
                    image: image,
                    packagingItem: conditioningKey.packagingItem
                })
            }
        })

        //récupération des informations sur les conditionnements de vente
        saleConditioningsKeys.forEach((conditioningKey) => {
            const id = conditioningKey.value
            const conditioning = document.querySelector('#conditioning_' + id).value
            const imageName = document.querySelector('#illustration_' + id).value
            const image = document.querySelector('#illustration_' + id).files[0]

            if(imageName === ""){
                saleConditioningsData.push({
                    conditioning: conditioning,
                    packagingItem: conditioningKey.packagingItem
                })
            }else{
                saleConditioningsData.push({
                    conditioning: conditioning,
                    image: image,
                    packagingItem: conditioningKey.packagingItem
                })
            }
        })

        //récupération des informations sur les illustrations du produit
        illustrationsKeys.forEach((illustrationKey) => {
            const id = illustrationKey.value
            const type = document.querySelector('#type_' + id).value
            const illustrationName = document.querySelector('#ProductIllustration_' + id).value
            const illustration = document.querySelector('#ProductIllustration_' + id).files[0]

            if(illustrationName === "" && !document.getElementById("img_" + illustrationKey.value)){
                error = true
                setAlertMsg("Veuillez sélectionner un fichier pour chaque illustration du produit!")
            }else{
                if(illustrationName === ""){
                    illustrationsData.push({
                        type_illustration: type,
                        illustrationItem: illustrationKey.illustrationItem
                    })
                }else{
                    illustrationsData.push({
                        type_illustration: type,
                        illustration : illustration,
                        illustrationItem: illustrationKey.illustrationItem
                    })
                }
            }
        })

        //vérification des valeurs du formulaire
        if(name === ""){
            error = true
            setAlertMsg("Veuillez renseigner le nom du produit!")
        }

        if(mark === ""){
            error = true
            setAlertMsg("Veuilez renseigner la marque du produit dans les détails!")
        }

        if(origin === ""){
            error = true
            setAlertMsg("Veuillez renseigner l'origine du produit dans les détails!")
        }

        if(error){
            setDisplayAlert(true)

        }else{
            setDisplayAlert(false)

            if(update){
                saveDetails(model, mark, weight, conservation, origin, composition, itemToUpdate['id'])
    
            }else{
                //dans le cas de la création d'un nouveau produit
                if(productId == ""){
                    //construction de l'objet pour envoyer la requête de création du produit
                    var formData = new FormData()

                    formData.append("name", name)
                    formData.append("category", category)
                    formData.append("update_code", "YES")
                
                    
                    //création de la requête
                    var requestURL = productsRequestURL
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
                            setAlertMsg("Erreur au niveau du serveur. Il est possible que ce nom soit déjà utilisé pour un autre produit.")

                        }else if(requestStatus === 201){
                            //requête réussie
                            console.log("produit enregistré")
                            //on ajoute le produit enregistré à la liste des produits
                            setProducsList([response, ...productsList])

                            //la catégorie utilisée ne peut plus être supprimée
                            canDeleteCategory.set(category, false)

                            //enregistrement de l'id du produit
                            setProductId(response['id'])

                            //mise à jour de la liste des catégories des produits
                            const categoryIndex = categoriesList.findIndex(item => item['id'] === category)
                            productsCategories.set(response['id'], categoriesList[categoryIndex]['name'])

                            //appel de la fonction pour enregistrer les détais du produit
                            saveDetails(model, mark, weight, conservation, origin, composition, response["id"])
                            
                            if(server_error){
                                setDisplayAlert(true)

                            }else{
                                setDisplayAlert(false)
                            }
                        }
                    }

                }else{
                    //le produit a déjà été enregistré, on fait un nouvel enregistrement après une correction du formulaire suite à l'occurrence d'une erreur
                    //appel de la fonction pour enregistrer les détais du produit
                    saveDetails(model, mark, weight, conservation, origin, composition, productId)
                }
            }
            
        }
       
        event.preventDefault()
    }
   
    return(
        <div className="container">
            <div className="row headSection">
                {
                    update ? <h4>Editer le produit {itemToUpdate['name']}</h4> : <h4>Créer un nouveau produit</h4>
                }
     
                <div className="col-7 d-flex justify-content-end vertical-center hover-pointer">
                    <a id="delete" style={{color:"black", fontSize:"larger"}} onClick={() => {
                        setDisplaySuccessAlert(false)
                        setUpdate(false)
                        setSpaceName('listProducts')
                    }}
                    style={{marginRight:"60px"}}>
                        <span style={{color:"black", fontSize:"larger"}} className="fa fa-arrow-left" title="Retour à la liste"></span>
                    </a>
                </div>
            </div>

            <div className="overflow-auto form-div" style={{height:"76vh"}}>
                <form>
                    <div className="form-section">
                        <div className="form-group row">
                            <label for="name" className="col-3 col-form-label label">Nom</label>
                            <div className="col-4">
                                {
                                    update ? <input type="text" className="form-control text-input" id="name" placeholder="nom du produit" defaultValue={itemToUpdate['name']} disabled></input> :
                                    <input type="text" className="form-control text-input" id="name" placeholder="nom du produit"></input>
                                }
                            </div>
                        </div>
                        
                        <div className="form-group row">
                                <label for="category" className="col-3 col-form-label label">Catégorie</label>
                                <div className="col-2">
                                    {
                                        update ? <select id="category" className="form-control select-input" disabled>
                                            <option selected value={categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category'])]['id']} key={categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category'])]['id']}>{categoriesList[categoriesList.findIndex(item => item['id'] === itemToUpdate['category'])]['name']}</option>
                                        </select>  :
                                        <select id="category" className="form-control select-input"> 
                                            {
                                                categoriesList.map((category) => <option value={category['id']} key={category['id']}>{category['name']}</option>)
                                            }
                                        </select> 
                                    }                         
                                </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h6>Détails du produit</h6>
                        <hr></hr>

                        <div style={{marginLeft:"40px"}}>
                            <div className="form-group row">
                                <label for="model" className="col-3 col-form-label label">Modèle</label>
                                <div className="col-6">
                                    <input type="text" className="form-control text-input" id="model" placeholder="model du produit" defaultValue={update ? details['model'] : ''}></input>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="mark" className="col-3 col-form-label label">Marque *</label>
                                <div className="col-6">
                                    <input type="text" className="form-control text-input" id="mark" placeholder="marque du produit" defaultValue={update ? details['mark'] : ''}></input>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="weight" className="col-3 col-form-label label">Poids</label>
                                <div className="col-3">
                                    <input type="number" className="form-control text-input" id="weight" placeholder="poids du produit" defaultValue={update ? details['weight'] : ''}></input>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="conservation" className="col-3 col-form-label label">Conservation</label>
                                <div className="col-6">
                                    <input type="text" className="form-control text-input" id="conservation" placeholder="conservation du produit" defaultValue={update ? details['conservation'] : ''}></input>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="origin" className="col-3 col-form-label label">Origine *</label>
                                <div className="col-6">
                                    <input type="text" className="form-control text-input" id="origin" placeholder="origine du produit" defaultValue={update ? details['origin'] : ''}></input>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="composition" className="col-3 col-form-label label">Composition</label>
                                <div className="col-6">
                                    <input type="text" className="form-control text-input" id="composition" placeholder="composition du produit" defaultValue={update ? details['composition'] : ''}></input>
                                </div>
                            </div>
                            <hr></hr>
                        </div>   
                    </div>

                    <div className="form-section" id="descriptions">
                        <h6>Descriptions</h6>
                        <hr></hr>
                        {
                            descriptionsKeys.map((descriptionKey) => (<ProductDescriptionForm 
                            key={"ProductDescriptionForm_" + descriptionKey.value}
                            descriptionId={descriptionKey.value}
                            descriptionsKeys={descriptionsKeys}
                            setDescriptionsKeys={setDescriptionsKeys}
                            nbDescriptions={nbDescriptions}
                            setNbDescriptions={setNbDescriptions}
                            languagesList={descriptionKey.languages} descriptionItem={descriptionKey.descriptionItem}
                            />))
                        }

                        <div className="d-flex flex-row-reverse">
                            <button className="add-button" onClick={(event) => addDescription(event)}>
                                <span className="fa fa-plus form-control-feedback font-weight-bold"></span>
                                <span> Ajouter une description</span>
                            </button>
                        </div>
                        
                    </div>

                    <div className="form-section">
                        <h6>Conditionnement(s) d'achat</h6>
                        <hr></hr>
                        {
                            purchaseConditioningsKeys.map((conditioningKey) =>(
                                <Conditioning type="purchase" key={conditioningKey.value} conditioningsList={conditioningKey.conditionings} conditioningId={conditioningKey.value} purchaseConditioningsKeys={purchaseConditioningsKeys} setPurchaseConditioningsKeys={setPurchaseConditioningsKeys} conditioningItem={conditioningKey.conditioningItem} packagingItem={conditioningKey.packagingItem}
                                />
                            ))
                        }
 
                        <div className="d-flex flex-row-reverse">
                                <button className="add-button" onClick={(event) => addPurchaseConditioning(event)}>
                                    <span className="fa fa-plus form-control-feedback font-weight-bold" ></span>
                                    <span> Ajouter un conditionnement</span>
                                </button>                               
                        </div>
                        
                    </div>

                    <div className="form-section">
                        <h6>Conditionnement(s) de vente</h6>
                        <hr></hr>
                        {
                            saleConditioningsKeys.map((conditioningKey) =>(
                                <Conditioning type="sale"  key={conditioningKey.value} conditioningsList={conditioningKey.conditionings} conditioningId={conditioningKey.value} saleConditioningsKeys={saleConditioningsKeys} setSaleConditioningsKeys={setSaleConditioningsKeys} conditioningItem={conditioningKey.conditioningItem} packagingItem={conditioningKey.packagingItem}
                                />
                            ))
                        }

                        <div className="d-flex flex-row-reverse">
                            <button className="add-button" onClick={(event) => addSaleConditioning(event)}>
                                <span className="fa fa-plus form-control-feedback font-weight-bold" ></span>
                                <span> Ajouter un conditionnement</span>
                            </button>                               
                        </div>
                        
                    </div>
                    
                    
                    <div className="form-section">
                        <h6>Illustration(s) du produit</h6>
                        <hr></hr>
                        {
                            illustrationsKeys.map((illustrationKey) => (<ProductIllustrationForm 
                            key={"ProductIllustrationForm_" + illustrationKey.value}
                            illustrationId={illustrationKey.value}
                            illustrationsKeys={illustrationsKeys}
                            setIllustrationsKeys={setIllustrationsKeys}
                            nbIllustrations={nbIllustrations}
                            setNbIllustrations={setNbIllustrations} illustrationItem={illustrationKey.illustrationItem}/>))
                        }
                        <div className="d-flex flex-row-reverse">
                                <button className="add-button" onClick={(event) => addIllustration(event)}>
                                    <span className="fa fa-plus form-control-feedback font-weight-bold" ></span> <span>Ajouter un nouvelle illustration</span>
                                </button>
                        </div>
                        
                    </div>

                    {
                        displayAlert ? <div className="form-alert col-12" style={{marginBottom:"25px"}}>
                            {alertMsg}
                        </div> : null
                    }

                    <div className="d-flex justify-content-center">
                        <button className="save-button" type="submit" 
                                onClick={(event) => saveProduct(event)}>
                            <span className="fa fa-save form-control-feedback font-weight-bold"></span>
                            <span> Enregistrer</span>
                        </button>
                    </div>
                </form> 
            </div>
        </div> 
    );     
}

export default CreateProductForm