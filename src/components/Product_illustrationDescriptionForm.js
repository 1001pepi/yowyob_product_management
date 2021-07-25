import React, {useState} from 'react'
function Product_illustrationDescriptionForm({illustrationId, illustrationKeys, setillustrationKeys, nbillustration, setNbillustration}){
    
    function deleteillustration(event){
        setillustrationKeys(illustrationKeys.filter(item => item.value != event.target.id))
    }
    //fonction pour enregistrer les illustrations  du produit//
   


    return(
        <div style={{marginLeft:"40px"}}>
        {illustrationId !== "defaultillustration" ? <div className="text-right" style={{paddingRight:"100px"}}>
            <span className="fa fa-close form-control-feedback"
                id={illustrationId} 
                onClick={(event) => deleteillustration(event)}>
            </span>
            
        </div> : null}


            <div className="form-group row">
                <label for="illustration" className="col-3 col-form-label label">nom</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id="illustration" placeholder="illustration du produit"></input>
                </div>
            </div>    
            <div className="form-group row">
                      <label for="type" className="col-3 col-form-label label">type_illustration</label>
                        <div className="col-8">
                                <input type="file" accept="image video" className="form-control-file" id="type_illustration"/>                         
                        </div>
            </div>   
            
            <hr></hr>
        </div> 
    );
}

export default Product_illustrationDescriptionForm