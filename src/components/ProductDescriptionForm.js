import React, {useState} from 'react'
function ProductDescriptionForm({product_descriptionId, setDisplaySuccessAlert,product_descriptionsKeys, setProduct_descriptionsKeys, nbProduct_descriptions, setNbProduct_descriptions}){
     
    function deleteDescription(event){
    
        setProduct_descriptionsKeys(product_descriptionsKeys.filter(item => item.value != event.target.id))
    }
     
       
    return(
            <div style={{marginLeft:"40px"}}>
            {product_descriptionId !== "defaultDescription" ? <div className="text-right" style={{paddingRight:"100px"}}>
                <span className="fa fa-close form-control-feedback"
                    id={product_descriptionId} 
                    onClick={(event) => deleteDescription(event)}>
                </span>
                
            </div> : null}

            <div className="form-group row">
                <label for="product_description" className="col-3 col-form-label label">Description</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id="product_description" placeholder="description du produit"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="product_specification" className="col-3 col-form-label label">Spécification</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id="product_specification" placeholder="spécification du produit"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for={product_descriptionId} className="col-3 col-form-label label">Langue</label>
                <div className="col-2">
                    <select id={product_descriptionId} className="form-control select-input">
                        <option selected>Français</option>
                        <option className="select-input-item">Anglais</option>
                        <option>Espagnol</option>
                    </select>                            
                </div>
            </div>
            <hr></hr>
        </div>
    );
}

export default ProductDescriptionForm