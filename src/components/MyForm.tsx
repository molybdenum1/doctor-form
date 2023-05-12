import { useEffect, useState } from "react";
import "../App.css";
import doctorService from "../services/doctor.service";
import specialitiesService from "../services/specialities.service";
import citiesService from "../services/cities.service";
import { ICity, IDoctor, ISpecialty, IValues } from "../types";
import validateForm from "../validation";
import Error from "./ui/Error";

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

  const [formData, setFormData] = useState<IValues>({
    name: "",
    birthDate: "",
    gender: "",
    city: "",
    speciality: "",
    doctor: "",
    contact: "",
  });
  const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>();
  const [filteredSpec, setFilteredSpec] = useState<ISpecialty[]>();
  const [filteredCities, setFilteredCities] = useState<ICity[]>();

  const [errors, setErrors] = useState<IValues>();

  useEffect(() => {
    let docs = doctors;

    if (formData.birthDate && !isAdult(formData.birthDate)) {
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

    if (formData.gender) {
      if (formData.gender === "Male") {
        setFilteredSpec(
          filteredSpec?.filter(
            (spec) => !spec.params || spec.params.gender === formData.gender
          ) ||
            specialties?.filter(
              (spec) => !spec.params || spec.params.gender === formData.gender
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
      if (formData.gender === "Female") {
        setFilteredSpec(
          filteredSpec?.filter(
            (spec) => !spec.params || spec.params.gender === formData.gender
          ) ||
            specialties?.filter(
              (spec) => !spec.params || spec.params.gender === formData.gender
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

    if (formData.city) {
      docs = docs?.filter(
        (doctor) =>
          doctor.cityId ===
          cities?.filter((c) => c.name === formData.city)[0].id
      );
      setFilteredSpec(
        specialties?.filter((spec) =>
          docs?.some((doc) => doc.specialityId === spec.id)
        )
      );
    }
    if (formData.speciality) {
      docs = docs?.filter(
        (doctor) =>
          doctor.specialityId ===
          specialties?.filter((spec) => spec.name === formData.speciality)[0].id
      );
      setFilteredCities(
        cities?.filter((c) => docs?.some((doc) => doc.cityId === c.id))
      );
    }
    if (formData.doctor) {
      setFilteredCities(
        cities?.filter(
          (c) =>
            c.id ===
            doctors?.filter((doc) => doc.id === formData.doctor)[0].cityId
        )
      );
      setFilteredSpec(
        specialties?.filter(
          (spec) =>
            spec.id ===
            doctors?.filter((doc) => doc.id === formData.doctor)[0].specialityId
        )
      );
    }
    setFilteredDoctors(docs);
  }, [
    cities,
    doctors,
    filteredSpec,
    specialties,
    formData.city,
    formData.speciality,
    formData.birthDate,
    formData.doctor,
    formData.gender,
  ]);

  const isAdult = (birthDate: string): boolean => {
    const today = new Date();
    let birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    birth.setFullYear(today.getFullYear());
    return age > 17;
  };

  const initialState = {
    name: "",
    birthDate: "",
    gender: "",
    city: "",
    speciality: "",
    doctor: "",
    contact: "",
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

    setErrors(validateForm(formData));
    if (!errors) {
      setErrors(initialState);
      console.log("Форма надіслана");
      setFormData(initialState);
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Error>{errors?.name  || ''}</Error>
        </label>
        <br />
        <label>
          Дата народження:
          <input
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
          />
        </label>
        <Error>{errors?.birthDate  || ''}</Error>
        <br />
        <label>
          Стать:
          <select
            name="gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="">Оберіть стать</option>
            <option value="Male">Чоловіча</option>
            <option value="Female">Жіноча</option>
          </select>
        </label>
        <Error>{errors?.gender  || ''}</Error>
        <br />
        <label>
          Місто:
          <select
            name="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
        <Error>{errors?.city || ''}</Error>
        <br />
        <label>
          Спеціальність:
          <select
            name="speciality"
            value={formData.speciality}
            onChange={(e) =>
              setFormData({ ...formData, speciality: e.target.value })
            }
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
        <Error>{errors?.speciality  || ''}</Error>
        <br />
        <label>
          Лікар:
          <select
            name="doctor"
            value={formData.doctor}
            onChange={(e) =>
              setFormData({ ...formData, doctor: e.target.value })
            }
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
        <Error>{errors?.doctor  || ''}</Error>
        <br />
        <label>
          Електронна пошта або номер телефону:
          <input
            name="contact"
            type="text"
            value={formData.contact}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
          />
        </label>
        <Error>{errors?.contact  || ''}</Error>
        <br />
        <button type="submit">Записатись на прийом</button>
      </form>
    </div>
  );
}

export default MyForm;
