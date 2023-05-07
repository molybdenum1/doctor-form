import { useEffect, useState } from "react";
import "./App.css";

interface IValues {
  name: string;
  birthDate: string;
  gender: string;
  city: string;
  speciality: string;
  doctor: string;
  contact: string;
}

interface IDoctor {
  id: string;
  name: string;
  surname: string;
  specialityId: string;
  isPediatrician: boolean;
  cityId: string;
}
interface ICity {
  id: string;
  name: string;
}
interface ISpecialty {
  id: string;
  name: string;
  parms?: IParams;
}
interface IParams {
  gender?: string;
  maxAge?: string;
  minAge?: string;
}

function MyForm() {
  const [cities, setCities] = useState<ICity[]>();
  const [specialties, setSpecialties] = useState<ISpecialty[]>();
  const [doctors, setDoctors] = useState<IDoctor[]>();

  useEffect(() => {
    fetch("https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21")
      .then((response) => response.json())
      .then((data) => setDoctors(data));

    fetch("https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca")
      .then((response) => response.json())
      .then((data) => setSpecialties(data));

    fetch("https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4")
      .then((response) => response.json())
      .then((data) => setCities(data));
  }, []);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [doctor, setDoctor] = useState("");
  const [contact, setContact] = useState("");

  const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>();
  const [filteredSpec, setFilteredSpec] = useState<ISpecialty[]>();
  const [filteredCities, setFilteredCities] = useState<ICity[]>();

  useEffect(() => {
    let docs = doctors;
    let species = specialties;

    if (birthDate && !isAdult(birthDate)) {
      docs = docs?.filter((doctor) => doctor.isPediatrician);
      setFilteredCities(
        cities?.filter((c) => docs?.some((doc) => doc.cityId === c.id))
      );
      setFilteredSpec(
        specialties?.filter((spec) =>
          docs?.some((doc) => doc.specialityId === spec.id)
        )
      );
    } else {
      docs = docs?.filter((doctor) => doctor);
    }
    // console.log(docs);
    console.log(gender);
    
    if(gender){
       if(gender === 'Male'){
        // console.log(gender === 'Male');
        console.log(species?.filter(spec => spec.parms && spec.parms.gender === gender));
        
        // setFilteredSpec(specc)    
       }
       if(gender === 'Female'){
        console.log(specialties?.filter(spec => spec.parms && spec.parms.gender === gender));
       }
    }
    console.log(filteredSpec);
    

    if (city) {
      docs = docs?.filter(
        (doctor) =>
          doctor.cityId === cities?.filter((c) => c.name === city)[0].id
      );
      setFilteredSpec(
        specialties?.filter((spec) =>
          docs?.some((doc) => doc.specialityId === spec.id)
        )
      );
    }
    if (speciality) {
      docs = docs?.filter(
        (doctor) =>
          doctor.specialityId ===
          specialties?.filter((spec) => spec.name === speciality)[0].id
      );
      setFilteredCities(
        cities?.filter((c) => docs?.some((doc) => doc.cityId === c.id))
      );
    }
    if (doctor) {
      setFilteredCities(
        cities?.filter(
          (c) =>
            c.id === doctors?.filter((doc) => doc.id === doctor)[0].cityId
        )
      );
      setFilteredSpec(
        specialties?.filter(
          (spec) =>
            spec.id === doctors?.filter((doc) => doc.id === doctor)[0].specialityId
        )
      );
    }
    setFilteredDoctors(docs);
  }, [city, speciality, birthDate, doctor, gender]);

  const isAdult = (birthDate: string): boolean => {
    const today = new Date();
    let birth = new Date(birthDate);
    // console.log(birth);
    let age = today.getFullYear() - birth.getFullYear();
    birth.setFullYear(today.getFullYear());
    // if (today < birth) {
    //   age--;
    // }
    // console.log(age);
    return age > 17;
  };

  return (
    <div className="App">
      <form>
        <label>
          Ім'я:
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Дата народження:
          <input
            name="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Стать:
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Оберіть стать</option>
            <option value="Male">Чоловіча</option>
            <option value="Female">Жіноча</option>
          </select>
        </label>
        <br />
        <label>
          Місто:
          <select
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Оберіть місто</option>
            {(filteredCities &&
              filteredCities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))) ||
              (cities &&
                cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                )))}
          </select>
        </label>
        <br />
        <label>
          Спеціальність:
          <select
            name="speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
          >
            <option value="">Оберіть спеціальність</option>
            {(filteredSpec &&
              filteredSpec.map((speciality) => (
                <option key={speciality.id} value={speciality.name}>
                  {speciality.name}
                </option>
              ))) ||
              (specialties &&
                specialties.map((speciality) => (
                  <option key={speciality.id} value={speciality.name}>
                    {speciality.name}
                  </option>
                )))}
          </select>
        </label>
        <br />
        <label>
          Лікар:
          <select
            name="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          >
            <option value="">Оберіть лікаря</option>
            {(filteredDoctors &&
              filteredDoctors.map((doc) => (
                <option
                  key={doc.id}
                  value={doc.id}
                >{`${doc.name}  ${doc.surname}`}</option>
              ))) ||
              (doctors &&
                doctors.map((doc) => (
                  <option
                    key={doc.id}
                    value={doc.id}
                  >{`${doc.name}  ${doc.surname}`}</option>
                )))}
          </select>
        </label>
        <br />
        <label>
          Електронна пошта або номер телефону:
          <input
            name="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Записатись на прийом</button>
      </form>
    </div>
  );
}

export default MyForm;
