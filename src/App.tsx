import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";

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
  parms? : IParams;           
}
interface IParams {
  gender? : string;
  maxAge?: string;
  minAge?: string;
} 

function App() {
  const [cities, setCities] = useState<ICity[]>();
  const [specialties, setSpecialties] = useState<ISpecialty[]>();
  const [doctors, setDoctors] = useState<IDoctor[]>();

  // console.log(cities);

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

  const initialValues = {
    name: "",
    birthDate: "",
    gender: "",
    city: "",
    speciality: "",
    doctor: "",
    contact: "",
  };

  console.log(
    doctors?.filter((doc) => {
      // let city = ;
      return (
        doc.cityId === cities?.filter((city) => city.name === "Vinnitsa")[0].id
      );
    })
  );

  const onSubmit = (values: IValues) => {
    console.log(values);
  };

  const validate = (values: IValues) => {
    const errors: IValues = {
      name: "",
      birthDate: "",
      gender: "",
      city: "",
      speciality: "",
      doctor: "",
      contact: "",
    };
    if (!values.name) {
      errors.name = "Поле обов'язкове для заповнення";
    }
    if (!values.birthDate) {
      errors.birthDate = "Поле обов'язкове для заповнення";
    }
    if (!values.gender) {
      errors.gender = "Поле обов'язкове для заповнення";
    }
    if (!values.city) {
      errors.city = "Поле обов'язкове для заповнення";
    }
    if (!values.speciality) {
      errors.speciality = "Поле обов'язкове для заповнення";
    }
    if (!values.doctor) {
      errors.doctor = "Поле обов'язкове для заповнення";
    }
    if (!values.contact) {
      errors.contact = "Поле обов'язкове для заповнення";
    }
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {({ errors, touched, values }) => (
        <Form>
          <label>
            Ім'я:
            <Field name="name" type="text" />
            {errors.name && touched.name && <div>{errors.name}</div>}
          </label>
          <br />
          <label>
            Дата народження:
            <Field name="birthDate" type="date" />
            {errors.birthDate && touched.birthDate && (
              <div>{errors.birthDate}</div>
            )}
          </label>
          <br />
          <label>
            Стать:
            <Field name="gender" as="select">
              <option value="">Оберіть стать</option>
              <option value="male">Чоловіча</option>
              <option value="female">Жіноча</option>
            </Field>
            {errors.gender && touched.gender && <div>{errors.gender}</div>}
          </label>
          <br />
          <label>
            Місто:
            <Field name="city" as="select">
              <option value="">Оберіть місто</option>
              {cities &&
                cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
            </Field>
            {errors.city && touched.city && <div>{errors.city}</div>}
          </label>
          <br />
          <label>
            Спеціальність:
            <Field name="speciality" as="select">
              <option value="">Оберіть спеціальність</option>
              {specialties &&
                specialties.map((speciality) => (
                  <option key={speciality.id} value={speciality.name}>
                    {speciality.name}
                  </option>
                ))}
            </Field>
            {errors.speciality && touched.speciality && (
              <div>{errors.speciality}</div>
            )}
          </label>
          <br />
          <label>
            Лікар:
            <Field name="doctor" as="select">
              <option value="">Оберіть лікаря</option>
              {doctors &&
                doctors
                  .filter(
                    (doctor) =>
                      doctor &&
                      doctor.cityId ===
                        cities?.filter((city) => city.name === values.city)[0]?.id
                  )
                  .filter(
                    (doctor) =>
                      doctor &&
                      doctor.specialityId ===
                        specialties?.filter(
                          (specialty) => specialty.name === values.speciality
                        )[0]?.id
                  )
                  .map((doctor) => (
                    <option key={doctor.id} value={doctor.name}>
                      {doctor.name}
                    </option>
                  ))}
            </Field>
            {errors.doctor && touched.doctor && <div>{errors.doctor}</div>}
          </label>
          <br />
          <label>
            Електронна пошта або номер телефону:
            <Field name="contact" type="text" />
            {errors.contact && touched.contact && <div>{errors.contact}</div>}
          </label>
          <br />
          <button type="submit">Записатись на прийом</button>
        </Form>
      )}
    </Formik>
  );
}

export default App;
