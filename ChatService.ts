import { WeatherData } from '../types/Weather';

export class ChatService {
  private readonly API_KEY = 'your_gemini_api_key';
  private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  async sendMessage(message: string, weatherData: WeatherData | null): Promise<string> {
    try {
      const systemPrompt = this.createSystemPrompt(weatherData);
      
      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response generated');
      }
    } catch (error) {
      console.error('Chat service error:', error);
      return this.getFallbackResponse(message, weatherData);
    }
  }

  private createSystemPrompt(weatherData: WeatherData | null): string {
    let prompt = `You are a friendly and knowledgeable weather assistant. You help users understand weather conditions, provide weather-related advice, and engage in pleasant conversation.

Your personality:
- Friendly, helpful, and enthusiastic about weather
- Use weather emojis appropriately
- Provide practical advice about weather conditions
- Keep responses concise but informative
- Be conversational and engaging

Guidelines:
- If asked about current weather, use the provided weather data
- Provide weather-related tips and advice when relevant
- If the user asks non-weather questions, still be helpful but gently guide back to weather topics
- Use emojis to make responses more engaging
- Keep responses under 150 words typically`;

    if (weatherData) {
      const condition = weatherData.weather[0].main;
      const temp = Math.round(weatherData.main.temp);
      const location = `${weatherData.name}, ${weatherData.sys.country}`;
      const description = weatherData.weather[0].description;
      
      prompt += `\n\nCurrent weather context:
- Location: ${location}
- Temperature: ${temp}°C
- Condition: ${condition}
- Description: ${description}
- Humidity: ${weatherData.main.humidity}%
- Wind Speed: ${weatherData.wind.speed} m/s
- Feels like: ${Math.round(weatherData.main.feels_like)}°C`;
    }

    return prompt;
  }

  private getFallbackResponse(message: string, weatherData: WeatherData | null): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('weather') && weatherData) {
      const temp = Math.round(weatherData.main.temp);
      const condition = weatherData.weather[0].description;
      const location = `${weatherData.name}, ${weatherData.sys.country}`;
      
      return `The current weather in ${location} is ${temp}°C with ${condition}. ${this.getWeatherAdvice(weatherData.weather[0].main)} 🌤️`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! 👋 I'm your weather assistant. I can help you with weather information and provide weather-related advice. What would you like to know? ☀️`;
    }
    
    if (lowerMessage.includes('temperature') && weatherData) {
      const temp = Math.round(weatherData.main.temp);
      const feelsLike = Math.round(weatherData.main.feels_like);
      return `It's currently ${temp}°C, but it feels like ${feelsLike}°C. ${this.getTemperatureAdvice(temp)} 🌡️`;
    }
    
    return `I'm here to help with weather information! 🌈 Ask me about the current weather, temperature, or any weather-related questions you might have.`;
  }

  private getWeatherAdvice(condition: string): string {
    switch (condition.toLowerCase()) {
      case 'rain':
        return "Don't forget your umbrella! ☔";
      case 'snow':
        return "Bundle up and watch your step on icy surfaces! ❄️";
      case 'clear':
        return "Perfect weather for outdoor activities! ☀️";
      case 'clouds':
        return "Great weather for a walk, no harsh sun! ☁️";
      case 'thunderstorm':
        return "Stay indoors and stay safe! ⛈️";
      default:
        return "Have a great day! 🌤️";
    }
  }

  private getTemperatureAdvice(temp: number): string {
    if (temp < 0) return "It's freezing! Layer up and stay warm! 🥶";
    if (temp < 10) return "It's quite cold, wear a jacket! 🧥";
    if (temp < 20) return "Cool weather, perfect for a light sweater! 😊";
    if (temp < 30) return "Pleasant temperature, perfect for most activities! 👌";
    return "It's quite warm, stay hydrated and find some shade! 🌡️";
  }
}
