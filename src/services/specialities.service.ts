import axios from "axios";

const SPECIALITIES_API = "https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca";

class SpecialitiesService {
  constructor() {};
  async getSpecialities(){
    return await axios.get(SPECIALITIES_API);
  }
}
const specialitiesService = new SpecialitiesService();
export default specialitiesService;