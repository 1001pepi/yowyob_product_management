import '../styles/Form.css'
import '../styles/smallDisplay.css'
import '../styles/bigDisplay.css'

import React, {useEffect} from 'react'

function ProductIllustrationForm({illustrationId, illustrationsKeys, setIllustrationsKeys, nbIllustrations, setNbIllustrations, illustrationItem}){

    //instructions s'éxécutant après le rendu du composant
    useEffect(() =>{
        var selectIllustrationType = document.querySelector("#type_" + illustrationId)
        selectIllustrationType.addEventListener('change', (event) => {
            var selectIllustration = document.querySelector("#ProductIllustration_" + illustrationId);
            selectIllustration.accept = (event.target.value == "IMAGE" ? "image/*" : "video/*");
        })
 
    }, [])
    
    function deleteIllustration(event){
        setIllustrationsKeys(illustrationsKeys.filter(item => item.value != event.target.id))
    }

    return(
        <div lassName="description-close-button">
            <div className="text-right description-close-button">
                <span className="fa fa-close form-control-feedback"
                    id={illustrationId} 
                    onClick={(event) => deleteIllustration(event)}>
                </span>
            </div>

            <div className="row">
                <div className={(illustrationItem ? "col-6" : "col-12") + " col-md-3"}>
                    <div className="form-group row">
                        <label for={"type_" + illustrationId} className={(illustrationItem ? "col-12" : "col-4") + " col-md-3 col-form-label label"}>Type</label>
                        <div className={(illustrationItem ? "col-12" : "col-5") + " col-md-7"}>
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
                <div className="col-12 col-md-5">
                    {
                        <input type="file" accept="image/*" id={"ProductIllustration_" + illustrationId}/>
                    }
                </div>
            </div>
            <hr></hr>
        </div> 
    );
}

export default ProductIllustrationForm