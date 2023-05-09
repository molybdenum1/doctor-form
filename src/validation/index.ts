import { IValues } from "../types";

function validateForm(values: IValues) {
  let errors = {
    name: "",
    birthDate: "",
    gender: "",
    city: "",
    speciality: "",
    doctor: "",
    contact: "",
  };

  // Проверка имени (обязательное поле)
  if (!values.name.trim()) {
    errors.name = "Ім'я обовязкове для заповнення ";
  } else if (/\d/.test(values.name)) {
    errors.name = "Имя не должно содержать цифр";
  }

  // Проверка даты рождения (обязательное поле)
  if (!values.birthDate) {
    errors.birthDate = "Дата народження обовязкова для заповнення";
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(values.birthDate.split('.').join('/'))) {
    errors.birthDate = "Дата рождения должна быть в формате ДД/ММ/ГГГГ";
  }

  // Проверка пола (обязательное поле)
  if (!values.gender) {
    errors.gender = "Оберіть стать";
  }

  // Проверка города (обязательное поле)
  if (!values.city) {
    errors.city = "Оберіть місто";
  }

  // Проверка ФИО доктора (обязательное поле)
  if (!values.doctor) {
    errors.doctor = "Оберіть доктора";
  }

  // Проверка email или мобильного номера (хотя бы одно поле обязательно)
  if (!values.contact) {
    errors.contact = "Введіть номер телефону чи імейл";
  } else if (
    values.contact &&
    (!/^\+[1-9]\d{1,14}$/.test(values.contact) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact))
  ) {
    errors.contact = "Некоректний імейл або номер телефону";
  }

  return errors;
}
export default validateForm;
