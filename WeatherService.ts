import { WeatherData } from '../types/Weather';

export class WeatherService {
  private apiKey = '01e1cc551a48c3db018cf881b9db4c5b';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      throw new Error(`Failed to fetch weather for ${city}`);
    }
  }

  async searchCities(query: string): Promise<string[]> {
    // Popular cities for autocomplete suggestions
    const popularCities = [
      'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Moscow', 'Dubai',
      'Singapore', 'Hong Kong', 'Los Angeles', 'Chicago', 'Toronto', 'Mumbai', 'Delhi',
      'Shanghai', 'Beijing', 'Seoul', 'Bangkok', 'Istanbul', 'Rome', 'Madrid', 'Barcelona',
      'Amsterdam', 'Vienna', 'Prague', 'Budapest', 'Warsaw', 'Stockholm', 'Copenhagen',
      'Oslo', 'Helsinki', 'Zurich', 'Geneva', 'Brussels', 'Lisbon', 'Athens', 'Cairo',
      'Cape Town', 'Johannesburg', 'Lagos', 'Nairobi', 'Casablanca', 'Tel Aviv', 'Riyadh',
      'Doha', 'Kuwait City', 'Abu Dhabi', 'Muscat', 'Karachi', 'Lahore', 'Dhaka',
      'Colombo', 'Kathmandu', 'Yangon', 'Phnom Penh', 'Ho Chi Minh City', 'Hanoi',
      'Jakarta', 'Kuala Lumpur', 'Manila', 'Taipei', 'Osaka', 'Kyoto', 'Busan',
      'Melbourne', 'Brisbane', 'Perth', 'Auckland', 'Wellington', 'Fiji', 'Honolulu'
    ];

    return popularCities
      .filter(city => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }
}