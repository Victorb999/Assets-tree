// https://github.com/tractian/challenges/blob/main/front-end/README.md
export const returnCompanies = async () => {
  const response = await fetch("https://fake-api.tractian.com/companies", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
