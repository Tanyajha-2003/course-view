import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
      const navigate = useNavigate();
    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-white px-4 py-3">
                <a className="navbar-brand fw-bold text-green" href="#">
                    <img
                        src="https://cdn.pegasus.imarticus.org/imarticus12/newIL12.svg"
                        alt="logo"
                        style={{ height: '40px' }}
                        className="mb-4"
                    />
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
            </nav>

            {/* Hero Section */}
            <section className="text-center py-5 bg-light">
                <img
                    src="https://webcdn.imarticus.org/mycaptain/mycaptain-logo_1111.webp"
                    alt="logo"
                    style={{ height: '80px' }}
                    className="mb-4"
                />
                <h1 className="fw-bold display-5">Become a Digital Marketer in 18 Weeks</h1>
                <p className="mt-3 fs-5">
                    MyCaptain Digital Marketing Program with Job Assurance
                </p>

                {/* Info Cards */}
                <div className="container mt-5">
                    <div className="row justify-content-center g-4">
                        <div className="col-md-3">
                            <div className="p-4 bg-white shadow rounded text-center">
                                <p className="text-muted mb-1">Next Batch</p>
                                <h5 className="fw-bold">October</h5>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="p-4 bg-white shadow rounded text-center">
                                <p className="text-muted mb-1">Available Seats</p>
                                <h5 className="fw-bold">29/60</h5>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="p-4 bg-white shadow rounded text-center">
                                <p className="text-muted mb-1">Taught by experts</p>
                                <h6 className="fw-bold">Rapido, Deloitte, MFine, Zomato</h6>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="p-4 bg-white shadow rounded text-center">
                                <p className="text-muted mb-1">Designed for</p>
                                <h6 className="fw-bold">Freshers & Early Working Professionals</h6>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-5">
                    <button
                        className="btn text-white px-4 py-2 me-3 fw-bold w-25"
                        style={{ backgroundColor: "#ff7a4f", borderColor: "#ff7a4f" }} 
                        onClick={() => navigate("/Home")}
                    >
                    
                        Apply Now
                    </button>
                    <button className="btn btn-dark px-4 py-2 fw-bold w-25">
                        Download Brochure
                    </button>
                </div>
            </section>
        </div>
    );
}