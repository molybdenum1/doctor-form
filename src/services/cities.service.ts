import axios from "axios";

const CITIES_API = "https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4";

class CitiesService {
  constructor() {};
  async getCities(){
    return await axios.get(CITIES_API);
  }
}
const citiesService = new CitiesService();
export default citiesService;