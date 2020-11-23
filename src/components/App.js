import { sortData, printStat } from '../util'

import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, CardContent, Card } from '@material-ui/core';

import '../App.css';
import 'leaflet/dist/leaflet.css';

import InfoBox from './InfoBox';
import Table from './Table';
import Map from './Map';
import LineGraph from './LineGraph';


const App = () => {

  const [caseType, setCaseType] = useState('cases')
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.90746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])

  useEffect(() => {
    const getWorldwideData = async() => {
      await fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      });
    }
    getWorldwideData();
  },[])

  //sending a request to disease.sh and grabbing list of countries/country codes

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map(country => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
          ));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    
    const url = countryCode === 'worldwide' ? 
    "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  }


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
            <MenuItem value="worldwide" >Worldwide</MenuItem>
            {countries.map( country => 
              <MenuItem
                value={country.value}
                key={country.name}
                >
                {country.name}
                </MenuItem>)}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox 
            neg
            active={caseType === "cases"}
            onClick={() => setCaseType("cases")}
            title="Covid-19 Cases" 
            cases={printStat(countryInfo.todayCases)} 
            total={printStat(countryInfo.cases)}
          />
          <InfoBox 
            active={caseType === "recovered"}
            onClick={() => setCaseType("recovered")}
            title="Recovered" 
            cases={printStat(countryInfo.todayRecovered)} 
            total={printStat(countryInfo.recovered)}
          />
          <InfoBox 
            neg
            active={caseType === "deaths"}
            onClick={() => setCaseType("deaths")}
            title="Deaths" 
            cases={printStat(countryInfo.todayDeaths)} 
            total={printStat(countryInfo.deaths)}
          />
        </div>
        <Map
          caseType={caseType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}></Table>
            <LineGraph caseType={caseType}/>
          </CardContent>
        </Card>
      </div>

      

    </div>
  )
}

export default App;