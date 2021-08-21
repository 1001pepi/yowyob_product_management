import '../styles/Form.css'
import '../styles/smallDisplay.css'
import '../styles/bigDisplay.css'

function Conditioning({type, conditioningsList, conditioningId, purchaseConditioningsKeys, setPurchaseConditioningsKeys, saleConditioningsKeys, setSaleConditioningsKeys, conditioningItem, packagingItem
}){
    //fontion permettant de supprimer un condtionnement
    function deleteConditioning(event){
        switch(type){
            case 'purchase':
                setPurchaseConditioningsKeys(purchaseConditioningsKeys.filter(item => item.value != event.target.id))

                var addPurchaseConditioningButton = document.getElementById("add-purchase-conditioning-button");

                if(addPurchaseConditioningButton){
                    addPurchaseConditioningButton.disabled = false;
                }
                break;
            
            case 'sale':
                setSaleConditioningsKeys(saleConditioningsKeys.filter(item => item.value != event.target.id))

                var addSaleConditioningButton = document.getElementById("add-sale-conditioning-button");

                if(addSaleConditioningButton){
                    addSaleConditioningButton.disabled = false;
                }
                break;
        }
    }

    return(
        <div className="description-form" key={conditioningId}>
            <div className="text-right description-close-button">
                {
                    !conditioningItem &&
                    <span className="fa fa-close form-control-feedback"
                        id={conditioningId} 
                        onClick={(event) => deleteConditioning(event)}>
                    </span>
                }
            </div>
            <div className="row">
                <div className="col-7 col-md-2">
                    {
                        conditioningItem ?
                        <select className="form-control select-input" id={"conditioning_" + conditioningId} disabled>
                            {
                                <option selected value={conditioningItem['id']} key={conditioningItem['id']}>{conditioningItem['name']}</option>
                            }
                        </select> :
                        <select className="form-control select-input" id={"conditioning_" + conditioningId}>
                        {
                            conditioningsList.map((conditioning) => <option value={conditioning['id']} key={conditioning['id']}>{conditioning['name']}</option>)
                        }
                    </select>
                }                      
                </div>

                <div className="col-12 col-md-10">
                    <div className="row">
                        <div className={(packagingItem ? "col-6" : "col-4") + " col-md-2"}>
                            <label className="col-3 col-form-label label">Illustration: </label>
                        </div>
                        {
                            packagingItem ? <img src={packagingItem['picture']} alt="image" style={{height:"90px"}}/> : null
                        }
                        <div className={(packagingItem ? "col-12" : "col-8") + " col-md-5"}>
                            <input type="file" accept="image video" className="form-control-file" id={"illustration_" + conditioningId}/> 
                        </div>
                    </div>                        
                </div>
            </div>
            <hr></hr>
        </div>
    );
}

export default Conditioning