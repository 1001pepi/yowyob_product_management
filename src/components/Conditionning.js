import '../styles/Form.css'

function Conditionning({type, conditionningsList, conditionningId, purchaseConditionningsKeys, setPurchaseConditionningsKeys, saleConditionningsKeys, setSaleConditionningsKeys
}){
    //fontion permettant de supprimer un condtionnement
    function deleteConditionning(event){
        switch(type){
            case 'purchase':
                setPurchaseConditionningsKeys(purchaseConditionningsKeys.filter(item => item.value != event.target.id))
                break;
            
            case 'sale':
                setSaleConditionningsKeys(saleConditionningsKeys.filter(item => item.value != event.target.id))
                break;
        }
    }

    return(
        <div style={{marginLeft:"40px"}} key={conditionningId}>
            <div className="text-right" style={{paddingRight:"100px"}}>
                <span className="fa fa-close form-control-feedback"
                    id={conditionningId} 
                    onClick={(event) => deleteConditionning(event)}>
                </span>
            </div>
            <div className="row">
                <div className="col-3">
                    <select className="form-control select-input" id={"conditionning_" + conditionningId}>
                        {
                            conditionningsList.map((conditionning) => <option value={conditionning['id']} key={conditionning['id']}>{conditionning['name']}</option>)
                        }
                    </select>                            
                </div>

                <div className="col-9">
                    <div className="row">
                        <div className="col-3">
                            <label className="col-3 col-form-label label">Illustration: </label>
                        </div>
                        <div className="col-9">
                            <input type="file" accept="image video" className="form-control-file" id={"illustration_" + conditionningId}/> 
                        </div>
                    </div>                        
                </div>
            </div>
            <hr></hr>
        </div>
    );
}

export default Conditionning