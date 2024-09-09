import dayjs from "dayjs";

export const convertArrayOfObjectToDropDownArray = ({
  list = [],
  valueField = "id",
  labelField = "title",
  prefixLabel = "",
}) => {
  return list?.map((u) => {
    return {
      value: u[valueField] ? u[valueField] : undefined,
      label: `${prefixLabel}${u[labelField] ? u[labelField] : "Error"}`,
    };
  });
};

export const navigate = (url, { forceReload = false, replace = false }) => {
  if (url === "back") {
    window.history.go(-1);
    return;
  }
  if (forceReload) {
    window.location.href = url;
  } else {
    replace
      ? window.history.replaceState({}, "", url)
      : window.history.pushState({}, "", url);
  }
};

export const createSlug = (str) => {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
};

export const convertUrlSearchParamsToObject = (params) => {
  const obj = {};
  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }
  return obj;
};

// Update mobile number format
export const formatMobileNumber = (e) => {
  const inputValue = e.target.value;
  const formattedValue = inputValue.replace(/\D/g, "")?.slice(0, 11);
  let formattedNumber = "";
  for (let i = 0; i < formattedValue.length; i++) {
    if (i === 3) formattedNumber += "-";
    else if (i === 6) formattedNumber += "-";
    formattedNumber += formattedValue[i];
  }
  return formattedNumber;
};

export const UtilFunctions = {
  deleteKeys: (object = {}, keys = []) => {
    if (keys.length < 1) {
      return object;
    }
    const allKeys = Object.keys(object);
    const newObj = { ...object };
    keys.forEach((key) => {
      if (allKeys.includes(key)) {
        delete newObj[key];
      }
    });
    return newObj;
  },
  safeParseInt: (val, defaultVal = 0) => {
    val = parseInt(val);
    return !isNaN(val) ? val : defaultVal;
  },
  safeParseFloat: (val, defaultVal = 0) => {
    val = parseFloat(val);
    return !isNaN(val) ? val : defaultVal;
  },
  formatCurrency: (val, defaultVal = 0) => {
    return this.CommonUtil.safeParseFloat(val, defaultVal).toFixed(2);
  },
  formatPercent: (val, defaultVal = 0) => {
    return this.CommonUtil.safeParseFloat(val, defaultVal).toFixed(2);
  },
  convertToDayjsYMDFormat: (object = {}, keys = []) => {
    const newObj = { ...object };
    keys.forEach((key) => {
      if (
        newObj.hasOwnProperty(key) &&
        newObj[key] !== null &&
        dayjs(newObj[key]).isValid()
      ) {
        newObj[key] = dayjs(newObj[key]).format("YYYY-MM-DD");
      }
    });
    return newObj;
  },
};

export const formattedMDYDate = (date) => {
  return dayjs(date ?? new Date()).format("MM/DD/YYYY");
};

export const formatDateToShortMonthString = (date) => {
  return dayjs(date).format("MMM D, YYYY");
};

export const isErrorOpenAccordion = () => {
  setTimeout(() => {
    const getFirstError = document.querySelectorAll(
      `[aria-describedby^="error-"]`
    )[0];
    if (getFirstError) {
      const getAccordionHeader = getFirstError
        .closest(".MuiAccordion-root")
        .querySelector(".MuiAccordionSummary-root");
      if (!getAccordionHeader.classList.contains("Mui-expanded")) {
        getAccordionHeader.click();
      }
    }
  }, 200);
};

export const isObjectFilled = (obj) => {
  return Object.keys(obj).every((key) => obj[key] !== "");
};

export const trimMiddleSpace = (str) => {
  return str?.replace?.(/^ /, "")?.replace(/ +/g, " ");
};

export const constructStateList = (stateList = []) => {
  return stateList
    ?.map?.((country) => ({
      label: country?.state,
      value: country?.state_code,
    }))
    ?.sort((a, b) => a?.label?.localeCompare?.(b?.label));
};

export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

export const convertUTCtoIST = (utcDateStr) => {
  if (!utcDateStr) {
    return "-";
  }

  const utcTime = utcDateStr;
  const utcDate = new Date(utcTime);
  utcDate.setTime(utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000);
  const utcTimeInMs = utcDate.getTime();
  // Add the IST offset (5 hours 30 minutes) to the UTC time
  const istOffsetInMs = 5.5 * 60 * 60 * 1000;
  const istTimeInMs = utcTimeInMs + istOffsetInMs;
  const istDate = new Date(istTimeInMs);
  // Extract the time string in the format HH:mm:ss
  const istTime = `${padZero(istDate.getHours())} : ${padZero(
    istDate.getMinutes()
  )}`;

  return istTime;
};

// Helper function to pad zeros to the time components
const padZero = (value) => {
  return (value < 10 ? "0" : "") + value;
};

// Format each date in the newDateRange array
export const convertDateRangeToString = (newDateRange) => {
  const formattedDates = newDateRange?.map((date) => {
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    return `${year}-${month}-${day}`;
  });

  // Join the formatted dates with a comma separator
  const formattedDateRange = formattedDates.join(",");
  return formattedDateRange;
};

export const oneMonthDateRangeText = () => {
  const curDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return convertDateRangeToString([oneMonthAgo, curDate]);
};

export const oneMonthDateRangeString = () => {
  const curDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const initalAdvSearch = {
    ["created_at"]: convertDateRangeToString([oneMonthAgo, curDate]),
  };

  return initalAdvSearch;
};

// Helper function to get the formatted name
export const getFormattedName = (displayName, firstName, lastName) => {
  if (displayName && displayName.includes(" ")) {
    // If display_name contains a space, assume it's a combination of first and last name
    return `${displayName.charAt(0).toUpperCase()}${displayName
      .split(" ")[1]
      .charAt(0)
      .toUpperCase()}`;
  } else if (displayName) {
    // If display_name is present but doesn't contain a space, display it as-is
    return displayName.charAt(0).toUpperCase();
  } else {
    // Fallback to displaying capitalized initials of first_name and last_name
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  }
};

export const convertToBlob = (binary) => {
  return URL.createObjectURL(binary);
};

export const downloadBlobAsFile = (urlString, filename) => {
  const url = window.URL.createObjectURL(new Blob([urlString]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

// Check non-letter (a-z/A-Z) values
export const testNonLetter = (str) => {
  return /[^a-zA-Z]/.test(str);
};

// Copy to clipboard
export const copyToClipboard = (text) => {
  return navigator.clipboard.writeText(text);
};

// Truncate string to any length
export const truncateString = (link, maxLength = 45) => {
  if (link?.length <= maxLength) {
    return link;
  }
  const truncatedLink = link?.substring?.(0, maxLength - 3) + "...";
  return truncatedLink;
};

// remove the underscore from string replaced with space
export const formatString = (str) => {
  return str.replace(/_/g, " ");
};

export const focusFirstErrorField = (formik = "") => {
  if (
    formik &&
    formik.errors &&
    typeof formik.errors === "object" &&
    Object.keys(formik.errors).length > 0
  ) {
    const firstErrorField = Object.keys(formik.errors)[0];
    const inputElement = document.querySelector(`[id="${firstErrorField}"]`);
    if (inputElement) {
      inputElement.focus();
    }
  } else {
    setTimeout(() => {
      const getFirstError = document.querySelectorAll(
        `[aria-describedby^="error-"]`
      )[0];
      if (getFirstError) {
        getFirstError.focus();
      }
    }, 300);
  }
};

export const comma_separated = (val) => {
  return new Intl.NumberFormat("en-US").format(val);
};
