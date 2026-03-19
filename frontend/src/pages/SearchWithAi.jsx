import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate, useSearchParams } from 'react-router-dom';
import start from "../assets/start.mp3"
import { FaArrowLeftLong } from "react-icons/fa6";
function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [listening,setListening] = useState(false)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startSound = new Audio(start)
  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  if (!recognition) {
    console.log("Speech recognition not supported");
  }

  const handleRecommendation = async (query) => {
    try {
      const result = await axios.post(`${serverUrl}/api/ai/search`, { input: query }, { withCredentials: true });
      setRecommendations(result.data);
      if(result.data.length>0){
        speak("These are the top courses I found for you")
      }else{
        speak("No courses found")
      }
      setListening(false)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setInput(query);
      handleRecommendation(query);
    }
  }, [searchParams]);

  const handleSearch = async () => {
    if (!recognition) return;
    setListening(true)
    startSound.play()
    recognition.start();
    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript);
    };
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col items-center px-4 py-16 relative overflow-hidden">
      <Nav />
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px] opacity-10"></div>
      </div>

      {/* Search Container */}
      <div className="mt-[72px] bg-[var(--bg-surface)] shadow-2xl rounded-[40px] p-8 sm:p-12 w-full max-w-3xl text-center relative border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-10 group cursor-pointer w-fit" onClick={()=>navigate("/")}>
          <FaArrowLeftLong className='text-[var(--text-main)] group-hover:-translate-x-1 transition-transform' />
          <span className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Home</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-main)] mb-10 flex items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shadow-lg">
            <img src={ai} className='w-8 h-8 sm:w-[35px] sm:h-[35px]' alt="AI" />
          </div>
          Search with <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'>AI</span>
        </h1>

        <div className="flex items-center bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl relative w-full p-1.5 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <input
            type="text"
            className="flex-grow px-6 py-4 bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none text-lg font-medium"
            placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <div className="flex gap-2">
            {input && (
              <button
                onClick={() => handleRecommendation(input)}
                className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all rotate-0 hover:rotate-6 active:scale-95"
              >
                <img src={ai} className='w-6 h-6 invert brightness-0' alt="Search" />
              </button>
            )}

            <button
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-blue-600 hover:bg-blue-50'}`}
              onClick={handleSearch}
            >
              <RiMicAiFill className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="w-full max-w-6xl mt-20 px-4 relative z-10">
          <div className="flex flex-col items-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100/20 text-blue-600 text-sm font-bold uppercase tracking-widest mb-4">
              <img src={ai1} className="w-6 h-6 rounded-full" alt="AI Results" />
              AI Recommendations
            </div>
            <h2 className="text-3xl font-black text-[var(--text-main)]">Suggested Courses</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {recommendations.map((course, index) => (
              <div
                key={index}
                className="bg-[var(--bg-surface)] p-8 rounded-[32px] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-[var(--border-color)] cursor-pointer group"
                onClick={() => navigate(`/viewcourse/${course._id}`)}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-blue-600 font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">{course.category}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center">
            {listening ? (
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-8 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: `${i * 0.1}s`}}></div>
                  ))}
                </div>
                <p className='text-[var(--text-muted)] text-xl font-medium tracking-widest uppercase'>Listening for keywords...</p>
              </div>
            ) : (
              <p className='text-[var(--text-muted)] text-lg font-medium opacity-50 italic'>Start a search to see AI recommendations</p>
            )}
        </div>
      )}
    </div>
  );
}

export default SearchWithAi;
