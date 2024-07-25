import React, { useState, useEffect, useRef } from 'react';
import './clickedAd.css';
import { EnvelopeSimpleOpen } from 'phosphor-react';
import axios from 'axios';
import Chat from "../Chat/Chat.js";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

function ClickedAd(props) {
  const { post, userData } = props;

  console.log(post);
  const locations = {
    "DCC": { lat: 43.657481588962106, lng: -79.37724224296616, adr: "288 Church St, Toronto, ON M5B 1Z5"},
    "SLC": { lat: 43.657917230684504, lng: -79.38112413557556, adr: "341 Yonge St, Toronto, ON M5B 1S1"},
    "TRSM": { lat: 43.65580029711594, lng: -79.38282622023037, adr: "55 Dundas St W, Toronto, ON M5G 2C3"},
    "ENG": { lat: 43.657893989264586, lng: -79.37721949442836, adr: "245 Church St, Toronto, ON M5B 1Z4" }
  };
  const postLocation = post.location;
  const currentLocation = locations[postLocation];
  

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(currentLocation.lng);
  const [lat, setLat] = useState(currentLocation.lat);
  const [zoom, setZoom] = useState(14);

  useEffect(() => {
    if (!map.current) {
      mapboxgl.accessToken = 'pk.eyJ1IjoidG11bWFya2V0IiwiYSI6ImNsdWtuMmV4dTBuYWoya3FwMmE3bW1hdHgifQ.XLz4FPeHhysE0f2SCyHC0g';
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
      });
    } else {
      map.current.setCenter([lng, lat]);
      map.current.setZoom(zoom);
    }

    // Add marker
    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current);

      // Add popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    })
      .setLngLat([lng, lat])
      .setHTML(`<div class = "mapText"><h3>${postLocation}</h3><p>${currentLocation.adr}</p></div>`)
      .addTo(map.current);

    // Show popup 
    marker.getElement().addEventListener('mouseenter', () => {
      popup.addTo(map.current);
    });

    // Hide popup 
    marker.getElement().addEventListener('mouseleave', () => {
      popup.remove();
    });


  }, []);

  const handleNew = async () => {
    try {
      await axios.post('http://localhost:3001/api/chat', {
        senderId: userData._id,
        receiverId: post.createdBy._id
      });
      setChatCreated(true);
      alert(`Send ${post.createdBy.fname} ${post.createdBy.lname} A Message!`);
    } catch (error) {
      console.log(error);
    }
  };

  
  const isCurrentUserCreator = userData._id === post.createdBy._id;

  const [triviaQuestion, setTriviaQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [chatCreated, setChatCreated] = useState(false);

  useEffect(() => {
    fetchTriviaQuestion();
  }, []);

  const fetchTriviaQuestion = async () => {
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=1&type=boolean"
      );
      const data = await response.json();
      setTriviaQuestion(data.results[0]);
    } catch (error) {
      console.error("Error fetching trivia questions:", error);
    }
  };

  const handleAnswerSubmit = () => {
    setShowAnswerResult(true);
  };

  function removeCharacters(question) {
    return question
      .replace(/(&quot;)/g, '"')
      .replace(/(&rsquo;)/g, '"')
      .replace(/(&#039;)/g, "'")
      .replace(/(&amp;)/g, '"');
  }

  return (
    <div>
      {!chatCreated ? (
        <div className="product-display flex flex-col lg:flex-row mx-auto h-screen">
          <div className="product-image lg:w-1/2 md:w-full">
            <img
              src={`http://localhost:3001/${post.images}`}
              className="w-full h-auto object-cover"
              alt="Product"
            />
          </div>
          <div className="product-details md:flex-1 p-6">
            <div className="product-name-container relative">
              <h2 className="text-4xl font-bold mb-4">{post.title}</h2>
              <p className="text-md mb-4">
                <strong>Sold by:</strong> {post.createdBy.fname} {post.createdBy.lname}
              </p>
              <div className="underline"></div>
            </div>
            <p className="text-lg mb-4">
              <strong>Category:</strong> {post.category}
            </p>
            <p className="text-lg mb-4">
              <strong>Tags:</strong> {post.tags.join(", ")}
            </p>
            <p className="text-lg mb-4">
              <strong>Price: </strong>${post.price}
            </p>
            <p className="text-lg mb-4">
              <strong>Description:</strong> {post.description}</p>
            <div ref={mapContainer} className="map-container" />

            <br />
            <div className="mb-4">
              {!isCurrentUserCreator && (
                <button
                  type="button"
                  className="button1 w-full font-medium rounded-lg text-base px-5 py-2.5 flex items-center mb-2"
                  onClick={handleNew}
                >
                  <EnvelopeSimpleOpen title="Send Message" size={30} />
                  <span className="ml-2">Send Message</span>
                </button>
              )}
              {triviaQuestion && (
                <div className="trivia-questions">
                  <h3>Trivia Question:</h3>
                  <p>{removeCharacters(triviaQuestion.question)}</p>
                  <div className="answer-options">
                    <button onClick={() => setUserAnswer("True")}>True</button>
                    <button onClick={() => setUserAnswer("False")}>False</button>
                  </div>
                  <button className="submit-button" onClick={handleAnswerSubmit}>Submit Answer</button>
                  {showAnswerResult && (
                    <p className="answer-result">
                      {userAnswer.toLowerCase() ===
                        triviaQuestion.correct_answer.toLowerCase()
                        ? "Correct!"
                        : "Incorrect!"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Chat currentChatUserId={post.createdBy._id} />
      )}
    </div>
  );
}

export default ClickedAd;