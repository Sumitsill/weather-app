import React from 'react';
import { MapPin, Thermometer, Eye, Wind, Droplets, Sunrise, Sunset } from 'lucide-react';
import { WeatherData } from '../types/Weather';
import { InteractiveCard } from '@/components/ui/InteractiveCard';

interface WeatherCardProps {
  weatherData: WeatherData;
  onLocationClick: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, onLocationClick }) => {
  const getWeatherEmoji = (condition: string, icon: string) => {
    const isDay = icon.includes('d');
    
    switch (condition.toLowerCase()) {
      case 'clear':
        return isDay ? '☀️' : '🌙';
      case 'clouds':
        return isDay ? '⛅' : '☁️';
      case 'rain':
        return '🌧️';
      case 'drizzle':
        return '🌦️';
      case 'thunderstorm':
        return '⛈️';
      case 'snow':
        return '❄️';
      case 'mist':
      case 'fog':
        return '🌫️';
      case 'haze':
        return '🌤️';
      default:
        return '🌤️';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Main Weather Card */}
      <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 mb-6 transform hover:scale-105 transition-all duration-300">
        {/* Location */}
        <div className="flex items-center justify-center mb-6">
          <button 
            onClick={onLocationClick}
            className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors duration-300"
          >
            <MapPin size={20} />
            <span className="text-lg font-medium">
              {weatherData.name}, {weatherData.sys.country}
            </span>
          </button>
        </div>

        {/* Main Weather Info */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce">
            {getWeatherEmoji(weatherData.weather[0].main, weatherData.weather[0].icon)}
          </div>
          <div className="text-6xl font-bold text-white mb-2">
            {Math.round(weatherData.main.temp)}°
          </div>
          <div className="text-xl text-white/90 capitalize mb-2">
            {weatherData.weather[0].description}
          </div>
          <div className="text-white/70">
            Feels like {Math.round(weatherData.main.feels_like)}°
          </div>
        </div>

        {/* Temperature Range */}
        <div className="flex justify-between items-center mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-center">
            <div className="text-white/70 text-sm">Low</div>
            <div className="text-white font-semibold text-lg">
              {Math.round(weatherData.main.temp_min)}°
            </div>
          </div>
          <div className="text-center">
            <div className="text-white/70 text-sm">High</div>
            <div className="text-white font-semibold text-lg">
              {Math.round(weatherData.main.temp_max)}°
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <Eye className="text-white/80" size={20} />
            <div>
              <div className="text-white/70 text-sm">Visibility</div>
              <div className="text-white font-semibold">
                {(weatherData.visibility / 1000).toFixed(1)} km
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <Wind className="text-white/80" size={20} />
            <div>
              <div className="text-white/70 text-sm">Wind</div>
              <div className="text-white font-semibold">
                {weatherData.wind.speed} m/s
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <Droplets className="text-white/80" size={20} />
            <div>
              <div className="text-white/70 text-sm">Humidity</div>
              <div className="text-white font-semibold">
                {weatherData.main.humidity}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <Thermometer className="text-white/80" size={20} />
            <div>
              <div className="text-white/70 text-sm">Pressure</div>
              <div className="text-white font-semibold">
                {weatherData.main.pressure} hPa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sunrise/Sunset */}
      <div className="mt-4 bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Sunrise className="text-yellow-300" size={20} />
            <div>
              <div className="text-white/70 text-sm">Sunrise</div>
              <div className="text-white font-semibold">
                {formatTime(weatherData.sys.sunrise)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Sunset className="text-orange-300" size={20} />
            <div>
              <div className="text-white/70 text-sm">Sunset</div>
              <div className="text-white font-semibold">
                {formatTime(weatherData.sys.sunset)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;