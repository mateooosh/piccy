const monthNames = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  pl: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]
};
const minute = 1000 * 60;
const hour = 1000 * 60 * 60;
const day = 1000 * 60 * 60 * 24;

export const validation = {
  min6Chars: (string) => {
    return string.length > 5;
  },

  min3Chars: (string) => {
    return string.length > 2;
  },

  email: (string) => {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(string);
  }
}

export const displayTime = (date, lang, t) => {
  let now = new Date();
  let diff = now - new Date(date);

  if (diff < minute)
    return t.now[lang];

  else if (diff >= minute && diff < hour) {
    return (Math.floor(diff / minute) === 1) ? Math.floor(diff / minute) + t.minuteAgo[lang] : Math.floor(diff / minute) + t.minutesAgo[lang];
  } else if (diff >= hour && diff < day) {
    return (Math.floor(diff / hour) === 1) ? Math.floor(diff / hour) + t.hourAgo[lang] : Math.floor(diff / hour) + t.hoursAgo[lang];
  } else if (diff >= day && diff < 7 * day) {
    return (Math.floor(diff / day) === 1) ? Math.floor(diff / day) + t.dayAgo[lang] : Math.floor(diff / day) + t.daysAgo[lang];
  } else if (diff >= 7 * day && diff < 365.25 * day) {
    return new Date(date).getDate() + ' ' + monthNames[lang][new Date(date).getMonth()];
  } else if (diff >= day * 365.25) {
    return new Date(date).getDate() + ' ' + monthNames[lang][new Date(date).getMonth()] + ' ' + new Date(date).getFullYear();
  }
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export const displayTimeV2 = date => {
  let now = new Date();
  date = new Date(date);


  if (isSameDay(now, date)) {
    return `${date.getHours()}:${prefixTime(date.getMinutes())}`
  }

  return displayTimeV3(date);
}

export const displayTimeV3 = date => {
  date = new Date(date);

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let hours = date.getHours() + 1;
  let minutes = date.getMinutes() + 1;

  day = (day < 10) ? `0${day}` : day;
  month = (month < 10) ? `0${month}` : month;
  hours = (hours < 10) ? `0${hours}` : hours;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const prefixTime = value => {
  if (value < 10) {
    return `0${value}`;
  }
  return value;
}

export const checkStatus = res => {
  if(res.ok)
    return res.json()
  else
    return Promise.reject(res)
}
