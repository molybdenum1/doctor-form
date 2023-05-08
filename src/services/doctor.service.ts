import axios from "axios";

const DOCTRO_API = "https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21";

class DoctorService {
    constructor(){}

    async getDoctors(){
        return await axios.get(DOCTRO_API)
    }
}
const doctorService = new DoctorService();
export default doctorService;