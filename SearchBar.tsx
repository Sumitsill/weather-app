import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const popularCities = [
    'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore',
    'Los Angeles', 'Mumbai', 'Berlin', 'Toronto', 'Barcelona', 'Rome',
    'Amsterdam', 'Bangkok', 'Seoul', 'Mexico City', 'Cairo', 'Istanbul'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city: string) => {
    onSearch(city);
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <div className="max-w-md mx-auto relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for any city..."
            className="w-full bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
          />
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl z-10 overflow-hidden">
          {suggestions.map((city, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(city)}
              className="w-full text-left px-4 py-3 text-gray-800 hover:bg-white/60 transition-colors duration-200 flex items-center space-x-3 first:rounded-t-2xl last:rounded-b-2xl"
            >
              <MapPin size={16} className="text-gray-600" />
              <span>{city}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;