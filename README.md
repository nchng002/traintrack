# Train Track
*A visualisation of train station crowdedness in Singapore*

## Introduction
This project makes use of LTA's [Platform Crowd Density Real Time](https://datamall.lta.gov.sg/content/datamall/en/dynamic-data.html) dataset to display crowded MRT/LRT stations in Singapore.

The technologies used are Node, Express, D3, and is hosted on Glitch.

## The Map
Personally, one of the most exciting parts of this project was displaying the map of train lines and stations. 

The map is a D3 geoJSON visualisation, with [google maps data](https://www.google.com/maps/d/viewer?hl=en&mid=1YMHbvKhRjFUyYUZ7VpOiQSUZLmGb3xWe&ll=1.3432682458997904%2C103.81804908822264&z=12) used for plotting.

## API Calls
API calls are made to retrieve the data from LTA at an hourly interval. I felt this was a practical way to space out the API calls. 

All data is then stored in a JSON file on the server, with client accessing this file.

## Data Limitations
- Not all stations have crowdedness levels
- Crowdedness levels are limited to low, medium and high indicators only
