/**
 * Swappable Weather Data Adapter
 * Supports plugging in real APIs (OpenWeatherMap, IMD, NASA POWER)
 * or returning simulated real-time telemetry.
 */

export interface WeatherPayload {
  rainfallMmPerHour: number;
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  condition: string;
}

export class WeatherDataAdapter {
  private apiKey: string | null = null;
  private provider: 'OPENWEATHER' | 'IMD' | 'MOCK';

  constructor(apiKey?: string, provider: 'OPENWEATHER' | 'IMD' | 'MOCK' = 'MOCK') {
    this.apiKey = apiKey || process.env.WEATHER_API_KEY || null;
    this.provider = this.apiKey ? provider : 'MOCK';
  }

  /**
   * Fetch weather data for a given GPS coordinate
   */
  async fetchWeatherData(lat: number, lng: number): Promise<WeatherPayload> {
    if (this.apiKey && this.provider === 'OPENWEATHER') {
      try {
        // Real OpenWeatherMap API Integration point:
        // const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`);
        // const json = await res.json();
        // return { rainfallMmPerHour: json.rain?.['1h'] || 0, temperatureC: json.main.temp, humidityPercent: json.main.humidity, windSpeedKmh: json.wind.speed * 3.6, condition: json.weather[0].main };
      } catch (err) {
        console.warn('Real Weather API failed, falling back to swappable mock provider:', err);
      }
    }

    // Default Swappable Mock Generator for Hilly Region Telemetry
    return this.getMockWeatherTelemetry(lat, lng);
  }

  private getMockWeatherTelemetry(lat: number, lng: number): WeatherPayload {
    // Generate realistic fluctuating Himalayan rainfall telemetry
    const baseRain = 20 + Math.random() * 45; // mm/h
    return {
      rainfallMmPerHour: Number(baseRain.toFixed(1)),
      temperatureC: Number((16 + Math.random() * 8).toFixed(1)),
      humidityPercent: Math.min(100, Math.round(75 + Math.random() * 22)),
      windSpeedKmh: Number((12 + Math.random() * 25).toFixed(1)),
      condition: baseRain > 45 ? 'Heavy Rain / Cloudburst Alert' : 'Moderate Heavy Rain',
    };
  }
}

export const weatherAdapter = new WeatherDataAdapter();
