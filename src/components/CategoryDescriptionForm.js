function CategoryDescriptionForm({descriptionId, descriptionsKeys, setDescriptionsKeys, nbDescriptions, setNbDescriptions, languagesList, setLanguagesList}){

    function deleteDescription(event){
        setDescriptionsKeys(descriptionsKeys.filter(item => item.value != event.target.id))
    }

    return(
        <div style={{marginLeft:"40px"}}>
            {descriptionId !== "defaultDescription" ? <div className="text-right" style={{paddingRight:"100px"}}>
                <span className="fa fa-close form-control-feedback"
                    id={descriptionId} 
                    onClick={(event) => deleteDescription(event)}>
                </span>
                
            </div> : null}

            <div className="form-group row">
                <label for="description" className="col-3 col-form-label label">Description</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id={"description_" + descriptionId} placeholder="description de la catégorie"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for="specification" className="col-3 col-form-label label">Spécification</label>
                <div className="col-6">
                    <input type="text" className="form-control text-input" id={"specification_" + descriptionId} placeholder="spécification de la catégorie"></input>
                </div>
            </div>
            <div className="form-group row">
                <label for={descriptionId} className="col-3 col-form-label label">Langue</label>
                <div className="col-3">
                    <select id={"language_" + descriptionId} className="form-control select-input">
                        {
                            languagesList.map((language) => <option value={language['id']} key={language['id']}>{language['name']}</option>)
                        }
                    </select>                            
                </div>
            </div>
            <hr></hr>
        </div>
    );
}

export default CategoryDescriptionForm