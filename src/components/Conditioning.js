import '../styles/Form.css'

function Conditioning({type, conditioningsList, conditioningId, purchaseConditioningsKeys, setPurchaseConditioningsKeys, saleConditioningsKeys, setSaleConditioningsKeys, conditioningItem, packagingItem
}){
    //fontion permettant de supprimer un condtionnement
    function deleteConditioning(event){
        switch(type){
            case 'purchase':
                setPurchaseConditioningsKeys(purchaseConditioningsKeys.filter(item => item.value != event.target.id))
                break;
            
            case 'sale':
                setSaleConditioningsKeys(saleConditioningsKeys.filter(item => item.value != event.target.id))
                break;
        }
    }

    return(
        <div style={{marginLeft:"40px"}} key={conditioningId}>
            <div className="text-right" style={{paddingRight:"100px"}}>
                {
                    !conditioningItem &&
                    <span className="fa fa-close form-control-feedback"
                        id={conditioningId} 
                        onClick={(event) => deleteConditioning(event)}>
                    </span>
                }
            </div>
            <div className="row">
                <div className="col-2">
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

                <div className="col-10">
                    <div className="row">
                        <div className="col-2">
                            <label className="col-3 col-form-label label">Illustration: </label>
                        </div>
                        {
                            packagingItem ? <img src={packagingItem['image']} alt="image" style={{height:"90px"}}/> : null
                        }
                        <div className="col-5">
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