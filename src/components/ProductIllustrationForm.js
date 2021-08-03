import '../styles/Form.css'

import React, {useState} from 'react'

function ProductIllustrationForm({illustrationId, illustrationsKeys, setIllustrationsKeys, nbIllustrations, setNbIllustrations}){
    
    function deleteIllustration(event){
        setIllustrationsKeys(illustrationsKeys.filter(item => item.value != event.target.id))
    }

    const [tmp, setTmp] = useState('')
   
    return(
        <div style={{marginLeft:"40px"}}>
            <div className="text-right" style={{paddingRight:"100px"}}>
                <span className="fa fa-close form-control-feedback"
                    id={illustrationId} 
                    onClick={(event) => deleteIllustration(event)}>
                </span>
            </div>

            <div className="row">
                <div className="col-4">
                    <div className="form-group row">
                        <label for={"type_" + illustrationId} className="col-3 col-form-label label">Type</label>
                        <div className="col-7">
                            <select className="form-control select-input" id={"type_" + illustrationId}>
                                <option value="IMAGE" key="image">Image</option>
                                <option value="VIDEO" key="video">Vidéo</option>
                            </select>
                        </div>
                    </div>
                </div> 
                <div className="col-8">
                    {
                        <input type="file" id={"ProductIllustration_" + illustrationId}/>
                    }
                </div>
            </div>
            <hr></hr>
        </div> 
    );
}

export default ProductIllustrationForm