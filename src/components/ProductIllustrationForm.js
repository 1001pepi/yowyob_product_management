import '../styles/Form.css'

import React, {useState} from 'react'

function ProductIllustrationForm({illustrationId, illustrationsKeys, setIllustrationsKeys, nbIllustrations, setNbIllustrations, illustrationItem}){
    
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
                <div className="col-3">
                    <div className="form-group row">
                        <label for={"type_" + illustrationId} className="col-3 col-form-label label">Type</label>
                        <div className="col-7">
                            {
                                illustrationItem ?
                                <select className="form-control select-input" id={"type_" + illustrationId}>
                                    <option value={illustrationItem['type_illustration']} key={illustrationItem['id']} selected>{illustrationItem['type_illustration'] == "IMAGE" ? "image" : "video"}</option>
                                    <option value="IMAGE" key="image">Image</option>
                                    <option value="VIDEO" key="video">Vidéo</option>
                                </select> :
                                    <select className="form-control select-input" id={"type_" + illustrationId}>
                                    <option value="IMAGE" key="image">Image</option>
                                    <option value="VIDEO" key="video">Vidéo</option>
                                </select>
                            }
                        </div>
                    </div>
                </div>
                {
                    illustrationItem ? <img src={illustrationItem['illustration']} alt="image" style={{height:"90px"}} id={"img_" + illustrationId}/> : null
                } 
                <div className="col-5">
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