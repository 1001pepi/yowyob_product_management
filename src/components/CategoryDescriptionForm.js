function CategoryDescriptionForm({descriptionId, descriptionsKeys, setDescriptionsKeys, nbDescriptions, setNbDescriptions, languagesList, setLanguagesList, descriptionItem}){

    function deleteDescription(event){
        setDescriptionsKeys(descriptionsKeys.filter(item => item.value != event.target.id))

        var addDescriptionButton = document.getElementById("add-description-buton")

        if(addDescriptionButton){
            addDescriptionButton.disabled = false;
        }
    }

    return(
        <div className="description-form">
            
            <div className="text-right description-close-button">
                <span className="fa fa-close form-control-feedback"
                    id={descriptionId} 
                    onClick={(event) => deleteDescription(event)}>
                </span>
            
            </div>

            <div className="form-group row">
                <label for="description" className="col-4 col-md-3 col-form-label label">Description</label>
                <div className="col-8 col-md-6">
                    <textarea className="form-control text-input" id={"description_" + descriptionId} placeholder="description de la catégorie" defaultValue = {descriptionItem ? descriptionItem['description'] : ''}></textarea>
                </div>
            </div>
            <div className="form-group row">
                <label for="specification" className="col-4 col-md-3 col-form-label label">Spécification</label>
                <div className="col-8 col-md-6">
                    {
                        descriptionItem ?
                        <textarea className="form-control text-input" id={"specification_" + descriptionId} placeholder="spécification de la catégorie" defaultValue = {descriptionItem ? descriptionItem['specification'] : ''} disabled></textarea> : 
                        <textarea className="form-control text-input" id={"specification_" + descriptionId} placeholder="spécification de la catégorie" defaultValue = {descriptionItem ? descriptionItem['specification'] : ''}></textarea>
                    }
                    
                </div>
            </div>
            <div className="form-group row">
                <label for={descriptionId} className="col-3 col-form-label label">Langue</label>
                <div className="col-7 col-md-3">
                    {
                        descriptionItem ?
                        <select id={"language_" + descriptionId} className="form-control select-input" disabled>
                            {
                                <option selected value={descriptionItem['language']} key={descriptionItem['language']}>{languagesList[languagesList.findIndex(item => item['id'] === descriptionItem['language'])]['name']}</option>
                            }
                        </select>:
                        <select id={"language_" + descriptionId} className="form-control select-input">
                            {
                                languagesList.map((language) => <option value={language['id']} key={language['id']}>{language['name']}</option>)
                            }
                        </select>
                    }                               
                </div>
            </div>
            <hr></hr>
        </div>
    );
}

export default CategoryDescriptionForm