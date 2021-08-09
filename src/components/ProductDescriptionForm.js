import React, {useState} from 'react'

function ProductDescriptionForm({descriptionId, setDisplaySuccessAlert, descriptionsKeys, setDescriptionsKeys, nbDescriptions, setNbDescriptions, languagesList, descriptionItem
}){
     
    function deleteDescription(event){
    
        setDescriptionsKeys(descriptionsKeys.filter(item => item.value != event.target.id))
    }
     
       
    return(
        <div style={{marginLeft:"40px"}}>
            {
               <div className="text-right" style={{paddingRight:"100px"}}>
                    <span className="fa fa-close form-control-feedback"
                        id={descriptionId} 
                        onClick={(event) => deleteDescription(event)}>
                    </span>
                 </div>
            }

            <div className="form-group row">
                <label for="product_description" className="col-3 col-form-label label">Description *</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id={"description_" + descriptionId} placeholder="description du produit" defaultValue={descriptionItem ? descriptionItem['description'] : ''}></input>
                </div>
            </div>

            <div className="form-group row">
                <label for="product_specification" className="col-3 col-form-label label">Spécification *</label>
                <div className="col-6">
                    {
                        descriptionItem ? <input type="text" className="form-control text-input" id={"specification_" + descriptionId} placeholder="spécification du produit" defaultValue={descriptionItem ? descriptionItem['specification'] : ''} disabled></input> :
                        <input type="text" className="form-control text-input" id={"specification_" + descriptionId} placeholder="spécification du produit"></input>
                    }
                </div>
            </div>
            <div className="form-group row">
                <label for={descriptionId} className="col-3 col-form-label label">Langue</label>
                <div className="col-2">
                    {
                        descriptionItem ? 
                        <select id={"language_" + descriptionId} className="form-control select-input" disabled>
                            {
                                <option selected value={descriptionItem['language']} key={descriptionItem['language']}>{languagesList[languagesList.findIndex(item => item['id'] === descriptionItem['language'])]['name']}</option>
                            }
                        </select> : 
                        <select id={"language_" + descriptionId} className="form-control select-input">
                            {
                                languagesList.map((language) => <option value={language['id']} key={language['id']}>{language['name']}</option>)
                            }
                        </select>
                    }                          
                </div>
            </div>
            <hr></hr>
        </div>
    );
}

export default ProductDescriptionForm