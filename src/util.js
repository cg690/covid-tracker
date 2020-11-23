import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const caseTypeColor = {
  cases:{
    hex: "#CC1034",
    multiplier: 400
  },
  recovered:{
    hex: "#7dd71d",
    multiplier: 600
  },
  deaths:{
    hex: "#fb4443",
    multiplier: 2000
  },
}


export const sortData = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) =>  b.cases - a.cases )
}

export const printStat = stat => stat ? `+${numeral(stat).format("0.0a")}` : "+0";

//showing circles on map based on data
export const showDataOnMap = (data, caseType='cases') => (
  data.map(country => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={caseTypeColor[caseType].hex}
      fillColor={caseTypeColor[caseType].hex}
      radius={
        Math.sqrt(country[caseType]) * caseTypeColor[caseType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div style={{ backgroundImage: `url(${country.countryInfo.flag})`}} className="info-flag"/>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
          <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
          <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
        </div>
      </Popup>
    </Circle>
  ))
)