"use strict";

// helpers/countriesAPI.js

// Handles all API requests to the Rest Countries API.

const axios = require("axios");

const BASE_URL = "https://restcountries.com/v3.1";

/**
 * Fetches country details by name.
 * 
 * @param {string} countryName - The name of the country (e.g., "Canada").
 * @returns {Promise<object>} - The country's data.
 * @throws {Error} - If the country is not found or an error occurs.
 */
async function getCountry(countryName) {
  if (!countryName?.trim()) {
    throw new Error("Country name is required.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/name/${encodeURIComponent(countryName.trim())}`);
    return response.data.find((country) => country.name.common.toLowerCase() === countryName.toLowerCase())
      || new Error(`No exact match found for "${countryName}".`);
  } catch (err) {
    throw new Error(`Failed to fetch country "${countryName}": ${err.message}`);
  }
}

/**
 * Fetches a list of all countries.
 * 
 * @returns {Promise<Array<object>>} - An array of country data.
 */
async function getAllCountries() {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data || [];
  } catch (err) {
    throw new Error(`Failed to fetch all countries: ${err.message}`);
  }
}

/**
 * Searches for countries by partial name (for autocomplete).
 * 
 * @param {string} partialName - The beginning of a country’s name (e.g., "Can").
 * @returns {Promise<Array<object>>} - A list of matching countries.
 */
async function searchCountries(partialName) {
  if (!partialName?.trim()) {
    throw new Error("Partial country name is required.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/name/${encodeURIComponent(partialName.trim())}`);
    return response.data || [];
  } catch (err) {
    throw new Error(`Failed to fetch countries matching "${partialName}": ${err.message}`);
  }
}

/**
 * Formats country data for database insertion.
 * 
 * @param {object} country - Country data from the API.
 * @returns {object} - A structured country details object.
 */
function prepareCountryDetails(country) {
  return {
    common_name: country.name?.common || null,
    official_name: country.name?.official || null,
    capital_city: country.capital?.[0] || null,
    independent: country.independent || false,
    un_member: country.unMember || false,
    currencies: Object.entries(country.currencies || {})
      .map(([code, { name, symbol }]) => `${name} (${symbol || code})`)
      .join(", "),
    alt_spellings: country.altSpellings || [],
    region: country.region || null,
    subregion: country.subregion || null,
    languages: Object.values(country.languages || []),
    borders: country.borders || [],
    population: country.population || 0,
    car_signs: country.car?.signs || [],
    car_side: country.car?.side || null,
    google_maps: country.maps?.googleMaps || null,
    flag: country.flags?.svg || null,
  };
}

module.exports = { getCountry, getAllCountries, searchCountries, prepareCountryDetails };
