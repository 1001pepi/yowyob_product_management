import '../styles/Identity.css'
import '../styles/Common.css'

function Identity(){
    return(
        <div className="col not-display-on-small-screens vertical-center" style={{marginRight: "20px"}}>
            <div className="container">
                <div className="row d-flex justify-content-end">
                    <div className="col-4 vertical-center">
                        <span className="fa fa-question-circle-o fa-2x help-button" title="Aide"></span>
                    </div>
                    <div className="col-4">
                        <button className="profil-button">
                            A
                        </button>
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default Identity