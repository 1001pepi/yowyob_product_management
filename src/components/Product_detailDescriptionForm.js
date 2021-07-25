import React, {useState} from 'react'
function Product_detailDescriptionForm({detailId,detailKeys, setDetailKeys}){

    function deletedetail(event){
        setDetailKeys(detailKeys.filter(item => item.value != event.target.id))
    }
    
    return(
        <div style={{marginLeft:"40px"}}>
        {detailId !== "defaultdetail" ? <div className="text-right" style={{paddingRight:"100px"}}>
            <span className="fa fa-close form-control-feedback"
                id={detailId} 
                onClick={(event) => deletedetail(event)}>
            </span>
            
        </div> : null}
            <div className="form-group row">
                <label for="model" className="col-3 col-form-label label">Model</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id="model" placeholder="model du produit"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="mark" className="col-3 col-form-label label">Marque</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id="mark" placeholder="marque du produit"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="weight" className="col-3 col-form-label label">Poids</label>
                <div className="col-6">
                    <input type="number" className="form-control text-input" id="weight" placeholder="poids du produit"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="conservation" className="col-3 col-form-label label">Conservation</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id="conservation" placeholder="conservation du produit"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="origin" className="col-3 col-form-label label">Origine</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id="origin" placeholder="origine du produit"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="composition" className="col-3 col-form-label label">Composition</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id="composition" placeholder="composition du produit"></input>
                </div>
            </div>
            
            <hr></hr>
        </div>
    );
}

export default Product_detailDescriptionForm