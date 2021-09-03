import "../styles/Langue.css"
import "../styles/Common.css"
import "../styles/smallDisplay.css"

function Langue(){
    return(
        <div className="col vertical-center not-display-on-small-screens">
            <div className="row  no-gutters">
                <div className="col-1 vertical-center">
                    <span className="fa fa-language" title="Langue"></span>
                </div>
                
                <div className="col-5">
                    <select className="form-control select-input">
                        <option selected>Fr</option>
                        <option>En</option>
                        <option>Esp</option>
                    </select>                            
                </div>
 
            </div>
        </div>
    );
}

export default Langue