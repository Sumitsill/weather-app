import React, { useState, useEffect } from 'react';
import { MessageCircle, MapPin, Search, Sun, Cloud, CloudRain, Snowflake, Zap, Eye, Wind, Droplets } from 'lucide-react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import ChatBot from './components/ChatBot';
import { WeatherService } from './services/WeatherService';
import { WeatherData } from './types/Weather';


function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const weatherService = new WeatherService();

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const data = await weatherService.getWeatherByCoords(latitude, longitude);
            setWeatherData(data);
            setLoading(false);
          },
          async (error) => {
            console.warn('Geolocation denied:', error);
            // Fallback to a default city
            const data = await weatherService.getWeatherByCity('London');
            setWeatherData(data);
            setLoading(false);
          }
        );
      } else {
        // Fallback for browsers without geolocation
        const data = await weatherService.getWeatherByCity('London');
        setWeatherData(data);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
      setLoading(false);
    }
  };

  const handleCitySearch = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getWeatherByCity(city);
      setWeatherData(data);
    } catch (err) {
      setError(`Failed to fetch weather for ${city}`);
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundGradient = () => {
    if (!weatherData) return 'from-blue-400 to-blue-600';
    
    const condition = weatherData.weather[0].main.toLowerCase();
    const isDay = weatherData.weather[0].icon.includes('d');
    
    if (condition.includes('clear')) {
      return isDay ? 'from-amber-300 via-orange-400 to-red-500' : 'from-indigo-900 via-purple-900 to-pink-900';
    } else if (condition.includes('cloud')) {
      return isDay ? 'from-slate-400 via-gray-500 to-slate-600' : 'from-slate-700 via-gray-800 to-slate-900';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'from-blue-600 via-indigo-700 to-slate-800';
    } else if (condition.includes('snow')) {
      return 'from-blue-100 via-cyan-200 to-blue-300';
    } else if (condition.includes('thunderstorm')) {
      return 'from-slate-800 via-gray-900 to-black';
    }
    
    return 'from-blue-400 to-blue-600';
  };

  const getBackgroundImage = () => {
    if (!weatherData) return '';
    
    const condition = weatherData.weather[0].main.toLowerCase();
    const isDay = weatherData.weather[0].icon.includes('d');
    
    if (condition.includes('clear')) {
      return isDay 
        ? 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
        : 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
    } else if (condition.includes('cloud')) {
      return isDay
        ? 'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
        : 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
    } else if (condition.includes('snow')) {
      return 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
    } else if (condition.includes('thunderstorm')) {
      return 'https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
    }
    
    return 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000 relative overflow-hidden`}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${getBackgroundImage()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            Weather App
          </h1>
          <p className="text-white/80 text-lg">
            Real-time weather with AI assistant
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleCitySearch} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          {loading ? (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-xl">Loading weather data...</p>
            </div>
          ) : error ? (
            <div className="text-center text-white">
              <p className="text-xl mb-4">⚠️ {error}</p>
              <button 
                onClick={getCurrentLocationWeather}
                className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg text-white hover:bg-white/30 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : weatherData ? (
            <WeatherCard 
              weatherData={weatherData} 
              onLocationClick={getCurrentLocationWeather}
            />
          ) : null}
        </div>

        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-20"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>

        {/* ChatBot */}
        <ChatBot 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)}
          weatherData={weatherData}
        />
      </div>
    </div>
  );
}

export default App;