// https://github.com/tractian/challenges/blob/main/front-end/README.md

import { Asset, Location } from "@/types/returnApiTypes";

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

export const returnLocations = async (id: string): Promise<Location[]> => {
  const response = await fetch(
    `https://fake-api.tractian.com/companies/${id}/locations`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};

export const returnAssets = async (id: string): Promise<Asset[]> => {
  const response = await fetch(
    `https://fake-api.tractian.com/companies/${id}/assets`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};
