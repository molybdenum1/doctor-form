import { useEffect, useState } from "react";
import "./App.css";
import doctorService from "./services/doctor.service";
import specialitiesService from "./services/specialities.service";
import citiesService from "./services/cities.service";
import { ICity, IDoctor, ISpecialty, IValues } from "./types";
import validateForm from "./validation";

function MyForm() {
  const [cities, setCities] = useState<ICity[]>();
  const [specialties, setSpecialties] = useState<ISpecialty[]>();
  const [doctors, setDoctors] = useState<IDoctor[]>();

  useEffect(() => {
    doctorService.getDoctors().then((response) => setDoctors(response.data));
    specialitiesService
      .getSpecialities()
      .then((response) => setSpecialties(response.data));
    citiesService.getCities().then((response) => setCities(response.data));
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

  const [errors, setErrors] = useState<IValues>();

  useEffect(() => {
    let docs = doctors;

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

    if (gender) {
      if (gender === "Male") {
        setFilteredSpec(
          filteredSpec?.filter(
            (spec) => !spec.params || spec.params.gender === gender
          ) ||
            specialties?.filter(
              (spec) => !spec.params || spec.params.gender === gender
            )
        );
        docs = docs?.filter((doc) =>
          filteredSpec?.some((spec) => doc.specialityId === spec.id)
        );
        setFilteredCities(
          cities?.filter((c) => docs?.some((doc) => doc.cityId === c.id))
        );
        // console.log(filteredSpec);
      }
      if (gender === "Female") {
        setFilteredSpec(
          filteredSpec?.filter(
            (spec) => !spec.params || spec.params.gender === gender
          ) ||
            specialties?.filter(
              (spec) => !spec.params || spec.params.gender === gender
            )
        );
        docs = docs?.filter((doc) =>
          filteredSpec?.some((spec) => doc.specialityId === spec.id)
        );
        setFilteredCities(
          cities?.filter((c) => docs?.some((doc) => doc.cityId === c.id))
        );
        // console.log(filteredSpec);
      }
    }

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
          (c) => c.id === doctors?.filter((doc) => doc.id === doctor)[0].cityId
        )
      );
      setFilteredSpec(
        specialties?.filter(
          (spec) =>
            spec.id ===
            doctors?.filter((doc) => doc.id === doctor)[0].specialityId
        )
      );
    }
    setFilteredDoctors(docs);
  }, [city, speciality, birthDate, doctor, gender]);

  const isAdult = (birthDate: string): boolean => {
    const today = new Date();
    let birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    birth.setFullYear(today.getFullYear());
    return age > 17;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setErrors({
      name: "",
      birthDate: "",
      gender: "",
      city: "",
      speciality: "",
      doctor: "",
      contact: "",
    });
    let data = { name, birthDate, gender, city, speciality, doctor, contact };

    setErrors(validateForm(data));
    if (!errors) {
      setErrors({
        name: "",
        birthDate: "",
        gender: "",
        city: "",
        speciality: "",
        doctor: "",
        contact: "",
      });
      console.log("Форма надіслана");
      setName("");
      setBirthDate("");
      setGender("");
      setCity("");
      setSpeciality("");
      setDoctor("");
      setContact("");
      setFilteredDoctors([]);
      setFilteredCities([]);
      setFilteredSpec([]);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          Ім'я:
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span>{errors?.name}</span>
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
        <span>{errors?.birthDate}</span>
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
        <span>{errors?.gender}</span>
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
        <span>{errors?.city}</span>
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
        <span>{errors?.speciality}</span>
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
        <span>{errors?.doctor}</span>
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
        <span>{errors?.contact}</span>
        <br />
        <button type="submit">Записатись на прийом</button>
      </form>
    </div>
  );
}

export default MyForm;
