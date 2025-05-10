"use client";

import { useContext, useState, useEffect } from 'react';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [itineraries, setItineraries] = useState([]);
  const [trips, setTrips] = useState([]);
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryDescription, setItineraryDescription] = useState('');
  const [tripName, setTripName] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [selectedItineraries, setSelectedItineraries] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchItinerariesAndTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const [itinerariesResponse, tripsResponse] = await Promise.all([
          axios.get('http://localhost:8000/itineraries/itineraries', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8000/trips', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setItineraries(itinerariesResponse.data);
        setTrips(tripsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchItinerariesAndTrips();
  }, []);

  const handleCreateItinerary = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/itineraries', {
        name: itineraryName,
        description: itineraryDescription,
      });
      setItineraries([...itineraries, response.data]);
      setItineraryName('');
      setItineraryDescription('');
    } catch (error) {
      console.error('Failed to create itinerary:', error);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/trips', {
        name: tripName,
        description: tripDescription,
        itineraries: selectedItineraries,
      });
      setTripName('');
      setTripDescription('');
      setSelectedItineraries([]);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <h1>Welcome!</h1>
        <button onClick={logout} className="btn btn-danger">Logout</button>

        <div className="accordion mt-5 mb-5" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Create Itinerary
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateItinerary}>
                  <div className="mb-3">
                    <label htmlFor="itineraryName" className="form-label">Itinerary Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="itineraryName"
                      value={itineraryName}
                      onChange={(e) => setItineraryName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="itineraryDescription" className="form-label">Itinerary Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="itineraryDescription"
                      value={itineraryDescription}
                      onChange={(e) => setItineraryDescription(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Create Itinerary</button>
                </form>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Create Trip
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateTrip}>
                  <div className="mb-3">
                    <label htmlFor="tripName" className="form-label">Trip Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tripName"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tripDescription" className="form-label">Trip Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tripDescription"
                      value={tripDescription}
                      onChange={(e) => setTripDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="itinerarySelect" className="form-label">Select Itineraries</label>
                    <select
                      multiple
                      className="form-control"
                      id="itinerarySelect"
                      value={selectedItineraries}
                      onChange={(e) => setSelectedItineraries([...e.target.selectedOptions].map(option => option.value))}
                    >
                      {itineraries.map(itinerary => (
                        <option key={itinerary.id} value={itinerary.id}>
                          {itinerary.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Create Trip</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3>Your trips:</h3>

          <ul>
          {trips.map(trip => (
              <div className="card" key={trip.id}>
                <div className="card-body">
                <h5 className="card-title">{trip.name}</h5>
                <p className="card-text">{trip.description}</p>
                <ul className="card-text">
                  {trip.itineraries && trip.itineraries.map(itinerary => (
                    <li key={itinerary.id}>
                      {itinerary.name}: {itinerary.description}
                    </li>
                  ))}
                </ul>

                </div>
              </div>
            ))}

          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
