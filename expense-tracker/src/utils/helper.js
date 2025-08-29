import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  // 1) Group all expenses by day (YYYY-MM-DD), summing amounts
  const grouped = data.reduce((acc, { date, amount }) => {
    const dayKey = moment(date).format("YYYY-MM-DD");
    acc[dayKey] = (acc[dayKey] || 0) + amount;
    return acc;
  }, {});

  // 2) Sorted array with formatted labels
  return Object.entries(grouped)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      date: moment(item.date).format("Do MMM"),
      amount: item.amount,
    }));
};

export const prepareIncomeBarChartData = (data = []) => {
  // 1) Group by YYYY-MM-DD, summing amounts
  const grouped = data.reduce((acc, { date, amount }) => {
    const dayKey = moment(date).format("YYYY-MM-DD");
    acc[dayKey] = (acc[dayKey] || 0) + amount;
    return acc;
  }, {});

  // 2) Sort and re‐format to “Do MMM”
  return Object.entries(grouped)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((item) => ({
      date: moment(item.date).format("Do MMM"),
      amount: item.amount,
    }));
};


export const prepareExpenseLineChartData = (data = []) => {
  // 1) Group all expenses by the raw date (YYYY-MM-DD)
  const groupedByDate = data.reduce((acc, { date, amount }) => {
    const key = moment(date).format("YYYY-MM-DD");
    acc[key] = (acc[key] || 0) + amount;
    return acc;
  }, {});

  // 2) Turn the grouped object into a sorted array with display labels
  const chartData = Object.entries(groupedByDate)
    .map(([date, amount]) => ({
      month: moment(date).format("Do MMM"), // e.g. "10th May"
      amount,
    }))
    // sort by the actual date so the line chart flows correctly
    .sort((a, b) => 
      moment(a.month, "Do MMM").toDate() - moment(b.month, "Do MMM").toDate()
    );

  return chartData;
};
