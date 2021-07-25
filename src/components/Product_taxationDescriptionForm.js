function Product_taxationDescriptionForm({taxationId, taxationKeys, settaxationKeys, nbtaxation, setNbtaxation}){
    function deletetaxation(event){
        settaxationKeys(taxationKeys.filter(item => item.value != event.target.id))
    }
    

    return(
        <div style={{marginLeft:"40px"}}>
            {taxationId !== "defaulttaxation" ? <div className="text-right" style={{paddingRight:"100px"}}>
                <span className="fa fa-close form-control-feedback"
                    id={taxationId} 
                    onClick={(event) => deletetaxation(event)}>
                </span>
                
            </div> : null}

            <div className="form-group row">
                <label for="taxation" className="col-3 col-form-label label">Taxe</label>
                <div className="col-6">
                    <input type="number" className="form-control text-input" id="taxation" placeholder="taxe du produit"></input>
                </div>
            </div>

            <hr></hr>
        </div>
    );
}

export default Product_taxationDescriptionForm