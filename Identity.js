import '../styles/Identity.css'

function Identity(){
    return(
        <div className="col">
            <div className="container">
                <div className="row name-div">
                    <div className="col-1">
                    <i className="fa fa-user"></i>
                    </div>

                    <div className="col">
                        Admin_Name
                    </div>

                </div>

                <div className="row disconnect-button-div">
                    <button className="disconnect-button">Se déconnecter</button>
                </div>
            </div>
        </div>
    );
}

export default Identity