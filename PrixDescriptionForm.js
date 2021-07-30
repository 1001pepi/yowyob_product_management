import React, {useState} from 'react'
function PrixDescriptionForm({prixId, prixKeys, setprixKeys, nbprix, setNbprix}){
    function deletepricing(event){
        setprixKeys(prixKeys.filter(item => item.value != event.target.id))
    }
    
    return(
        <div style={{marginLeft:"40px"}}>
        {prixId !== "defaultpricing" ? <div className="text-right" style={{paddingRight:"100px"}}>
            <span className="fa fa-close form-control-feedback"
                id={prixId} 
                onClick={(event) => deletepricing(event)}>
            </span>
            
        </div> : null}

            <div className="form-group row">
                <label for="average_purchase_price" className="col-3 col-form-label label">Prix d'achat moyen</label>
                <div className="col-6">
                    <input type="number" className="form-control text-input" id="average_purchase_price" placeholder="prix d'achat moyen"></input>
                </div>
            </div>

             <div className="form-group row">
                <label for="average_sale_price" className="col-3 col-form-label label">Prix de vente moyen</label>
                <div className="col-6">
                    <input type="number" className="form-control text-input" id="average_sale_price" placeholder="prix de vente moyen"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="cost_price" className="col-3 col-form-label label">Prix de revient</label>
                <div className="col-6">
                    <input type="number" className="form-control text-input" id="cost_price" placeholder="prix de revient"></input>
                </div>
            </div>

            <div className="form-group row">
                <label for="unit_pricing" className="col-3 col-form-label label">Prix</label>
                <div className="col-6">
                    <input type="number" className="form-control text-input" id="unit_pricing" placeholder="prix unitaire du produit"></input>
                </div>
            </div>

            <div className="form-group row">
                <label for="percentage_expence" className="col-3 col-form-label label">Depense en pourcentage</label>
                <div className="col-6">
                    <input type="number" max="100" min="0" className="form-control text-input" id="percentage_expense" placeholder="depense en pourcentage"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="percentage_margin" className="col-3 col-form-label label">Taux de marge</label>
                <div className="col-6">
                    <input type="number" max="100" min="0" className="form-control text-input" id="percentage_margin" placeholder="taux de marge"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="percentage_brand_taxe" className="col-3 col-form-label label">pourcentage des taxes de marque</label>
                <div className="col-6">
                    <input type="number" max="100" min="0" className="form-control text-input" id="percentage_brand_taxe" placeholder="pourcentage des taxes de marque"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="half_wholesale_price" className="col-3 col-form-label label">Prix du produit en semi gros</label>
                <div className="col-6">
                    <input type="number" className="form-control text-input" id="half_wholesale_price" placeholder="prix du produit en sémi-gros"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="wholesale_price" className="col-3 col-form-label label">Prix du produit en gros</label>
                <div className="col-6">
                    <input type="number" className="form-control text-input" id="wholesale_price" placeholder="prix du produit en gros"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="percentage_half_big_price" className="col-3 col-form-label label">Pourcentage du prix du produit en gros</label>
                <div className="col-6">
                    <input type="number" max = "100" min="0" className="form-control text-input" id="percentage_half_big_price" placeholder="pourcentage du prix du produit en gros"></input>
                </div>
            </div>
           
            <div className="form-group row">
                <label for="percentage_wholesale_price" className="col-3 col-form-label label">Pourcentage prix du produit en gros</label>
                <div className="col-6">
                    <input type="number" max="100" min="0" className="form-control text-input" id="percentage_wholesale_price" placeholder="pourcentage prix du produit en gros"></input>
                </div>
            </div>
           
            <div className="form-group row">
                <label for="total_accumulated_selling_price" className="col-3 col-form-label label">Prix de vente total cumulé</label>
                <div className="col-6">
                    <input type="number" className="form-control text-input" id="total_accumulated_selling_price" placeholder="prix de vente total cumulé"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="total_unit_sales_price" className="col-3 col-form-label label">Vente unitaire totale</label>
                <div className="col-6">
                    <input type="number" className="form-control text-input" id="total_unit_sales_price" placeholder="vente unitaire totale"></input>
                </div>
            </div>
            
            <div className="form-group row">
                <label for={prixId} className="col-3 col-form-label label">type de prix</label>
                <div className="col-2">
                    <select id={prixId} className="form-control select-input">
                        <option selected>--aucune--</option>
                        <option>vente</option>
                        <option className="select-input-item">achat</option>
                    </select>                            
                </div>
            </div>
            <hr></hr>
        </div>
    );
}

export default PrixDescriptionForm