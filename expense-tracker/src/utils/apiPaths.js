export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getUser",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password"
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },
  INCOME: {
    ADD_INCOME: "/api/v1/income/add",
    GET_ALL_INCOME: "/api/v1/income/get",
    DELETE_INCOME: (id) => `/api/v1/income/${id}`,
    DOWNLOAD_INCOME: "/api/v1/income/downloadexcel",
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_ALL_EXPENSE: "/api/v1/expense/get",
    FORECAST: "/api/v1/expense/forecast",    // ← new
    DELETE_EXPENSE: (id) => `/api/v1/expense/${id}`,
    DOWNLOAD_EXPENSE: "/api/v1/expense/downloadexcel",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },

  SUBSCRIPTIONS: {
        GET_ALL:  "/api/v1/subscriptions",
        ADD:      "/api/v1/subscriptions",
        DELETE:   (id) => `/api/v1/subscriptions/${id}`,
        PAY:      (id) => `/api/v1/subscriptions/${id}/pay`,
      },

        STOCKS: {
            GET_QUOTES:  (symbols) => `/api/v1/stocks/quotes?symbols=${symbols.join(",")}`,
            GET_HISTORY: (symbol)  => `/api/v1/stocks/history/${symbol}`,
          },

          BUDGETS: {
            GET_ALL: "/api/v1/budgets",
            ADD: "/api/v1/budgets",
            GET_ONE: (id) => `/api/v1/budgets/${id}`, // Added GET_ONE
            UPDATE: (id) => `/api/v1/budgets/${id}`,
            DELETE: (id) => `/api/v1/budgets/${id}`,
            GET_CATEGORY_SPENDING_LAST_30_DAYS: "/api/v1/budgets/category-spending-last-30-days", // New path
          },               
};

