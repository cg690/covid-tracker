import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css'

//card displays for info regarding cases, recovered, and deaths

const InfoBox = ({ neg, title, cases, active, total, ...props }) => {
  return (
    <Card 
      className={`infoBox ${active && 'infoBox--selected'} ${neg && 'infoBox--neg'}`}
      onClick={props.onClick}
      >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        <h2 className={`infoBox__cases ${!neg && 'infoBox__cases--green'}`}>{cases}</h2>
        
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
        
      </CardContent>
    </Card>
  )
}

export default InfoBox;