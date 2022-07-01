/*
import fetch from "node-fetch"
import express, { request, response } from "express"
import dotenv from "dotenv"
dotenv.config()

import fs from "fs"
*/
const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config;

let database;
let hasError = { haserror: false };
fs.readFile("database.json", (err, data) => {
    if (err) throw err;
    database = JSON.parse(data);
});

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening at ${port}`);
});

let call_api = async () => {
    const trainline_response = [];
    const api_options = {
        method: "GET",
        headers: {
            AccountKey: process.env.API_KEY,
            "Content-Type": "application/json",
        },
    };
    const trainlines = [
        "CCL",
        "CEL",
        "CGL",
        "DTL",
        "EWL",
        "NEL",
        "NSL",
        "BPL",
        "SLRT",
        "PLRT",
    ];

    for (let i = 0; i < trainlines.length; i++) {
        let trainline = {
            trainline: trainlines[i],
            stations: [],
        };
        let api_url = `http://datamall2.mytransport.sg/ltaodataservice/PCDRealTime?TrainLine=${trainlines[i]}`;
        let api_response = await fetch(api_url, api_options);
        let api_json = await api_response.json();

        if (api_json["fault"]) {
            hasError.haserror = true;
            console.log(hasError);
        } else {
            trainline["stations"].push(...api_json["value"]);
            trainline_response.push(trainline);
            console.log(`Added ${trainlines[i]}`);
        }
    }

    fs.writeFile("database.json", JSON.stringify(trainline_response), (err) => {
        if (err) throw err;
        console.log("Done writing database.json");
    });

};

app.use(express.static("public"));

/*
setInterval(async () => {
    const trainline_response = []
    const api_options = {
        method: 'GET',
        headers: {
            'AccountKey': process.env.API_KEY,
            'Content-Type': 'application/json'
        }
    }
    const trainlines = ['CCL', 'CEL', 'CGL', 'DTL', 'EWL', 'NEL', 'NSL', 'BPL', 'SLRT', 'PLRT']

    for (let i = 0; i < trainlines.length; i++) {
        let trainline = {
            'trainline': trainlines[i],
            'stations': []
        }
        let api_url = `http://datamall2.mytransport.sg/ltaodataservice/PCDRealTime?TrainLine=${trainlines[i]}`
        let api_response = await fetch(api_url, api_options)
        let api_json = await api_response.json()
        trainline['stations'].push(...api_json['value'])
        trainline_response.push(trainline)
        console.log(`Added ${trainlines[i]}`)
    }
    fs.writeFile('database.json', JSON.stringify(trainline_response), err => {
        if (err) throw err
        console.log("Done writing")
    })
}, 15 * 60 * 1000)
*/

call_api();

setInterval(call_api, 20 * 60 * 1000);

/*
let timeRefreshed = new Date()
    fs.writeFile('lastrefresh.json', JSON.stringify([{unix: timeRefreshed.getTime()}]), err => {
          if (err) throw err
          console.log("Done writing")
      })
*/

app.get("/database", async (request, response) => {
    response.json(database);
});

app.get("/haserror", async (request, response) => {
    response.json(hasError);
});
