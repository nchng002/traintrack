let canvas = d3.select('#canvasitems')
let tooltip = d3.select('#tooltip')

let drawMap = async () => {
    const crowdResponse = await fetch('sampledata.json')
    //const crowdResponse = await fetch('/database')
    const crowdData = await crowdResponse.json()
    console.log(crowdData)

    const trainlineResponse = await fetch('trainlines.json')
    const trainlineData = await trainlineResponse.json()

    const mrtResponse = await fetch('currentnetwork.json')
    const mrtData = await mrtResponse.json()

    const lrtResponse = await fetch('lightrail.json')
    const lrtData = await lrtResponse.json()

    let width = 450
    let height = 300

    let trainlineProjection = d3.geoMercator()
        .fitSize([width, height], { type: "FeatureCollection", features: trainlineData.features })

    let mrtProjection = d3.geoMercator()
        .fitSize([width, height], { type: "FeatureCollection", features: mrtData.features })

    let scale = 1.4
    let lrtProjection = d3.geoMercator()
        .fitSize([width / scale, height / scale], { type: "FeatureCollection", features: lrtData.features })

    canvas
        .attr('transform', 'translate(25,0)')

    canvas
        .append('g')
        .attr('id', 'trainlines')
        .selectAll('path')
        .data(trainlineData.features)
        .enter()
        .append('path')
        .attr('d', d3.geoPath().projection(trainlineProjection))
        .attr('id', (trainline) => {
            return trainline.properties.name
        })
        .attr('stroke', 'white')
        .attr('fill', 'transparent')

    canvas
        .append('g')
        .attr('id', 'currentnetwork')
        .selectAll('circle')
        .data(mrtData.features)
        .enter()
        .append('circle')
        .attr('cx', (mrt) => {
            let x = mrt.geometry.coordinates[0]
            let y = mrt.geometry.coordinates[1]
            return mrtProjection([x, y])[0]
        })
        .attr('cy', (mrt) => {
            let x = mrt.geometry.coordinates[0]
            let y = mrt.geometry.coordinates[1]
            return mrtProjection([x, y])[1]
        })
        .attr('name', (mrt) => {
            let splitArray = mrt.properties.name.split(" ")
            return splitArray.slice(1).join(' ')
        })
        .attr('id', (mrt) => {
            let splitArray = mrt.properties.name.split(" ")
            return splitArray[0]
        })
        .attr('fill', 'transparent')
        .attr('r', '3px')
        .on('mouseover', (mrt) => {
            tooltip.text(mrt.properties.name)
        })
        .on('mouseout', () => {
            tooltip.text("")
        })

    canvas
        .append('g')
        .attr('id', 'lightrail')
        .attr('transform', 'translate(135,75)')
        .selectAll('circle')
        .data(lrtData.features)
        .enter()
        .append('circle')
        .attr('cx', (station) => {
            let x = station.geometry.coordinates[0]
            let y = station.geometry.coordinates[1]
            return lrtProjection([x, y])[0]
        })
        .attr('cy', (station) => {
            let x = station.geometry.coordinates[0]
            let y = station.geometry.coordinates[1]
            return lrtProjection([x, y])[1]
        })
        .attr('name', (station) => {
            let splitArray = station.properties.name.split(" ")
            return splitArray.slice(1).join(' ')
        })
        .attr('id', (station) => {
            let splitArray = station.properties.name.split(" ")
            return splitArray[0]
        })
        .attr('fill', 'transparent')
        .attr('r', '2px')
        .on('mouseover', (station) => {
            tooltip.text(station.properties.name)
        })
        .on('mouseout', (station) => {
            tooltip.text("")
        })

    let problemStations = []

    let crowdedStationsDiv = document.getElementById("crowdedstations")
    let crowdedP = document.getElementById("crowded")

    let mildStationsDiv = document.getElementById("mildstations")
    let mildP = document.getElementById("mild")

    let lowP = document.getElementById("low")
    crowdData.forEach((trainline) => {
        trainline.stations.forEach((station) => {
            let selectedStation = document.getElementById(station.Station)
            if (station.CrowdLevel == 'h') {

                crowdedP.textContent = 'There are very crowded stations'

                lowP.textContent = ""

                selectedStation.setAttribute('fill', 'red')
                selectedStation.setAttribute('r', '6px')

                let crowdedStation = document.createElement('p')
                if (!problemStations.includes(selectedStation.getAttribute('name'))) {
                    problemStations.push(selectedStation.getAttribute('name'))
                    crowdedStation.textContent = selectedStation.getAttribute('name')
                    crowdedStationsDiv.appendChild(crowdedStation)
                }

            } else if (station.CrowdLevel == 'm') {

                mildP.textContent = 'There are mildly crowded stations'

                lowP.textContent = ""

                selectedStation.setAttribute('fill', 'yellow')
                selectedStation.setAttribute('r', '6px')

                let mildStation = document.createElement('p')
                if (!problemStations.includes(selectedStation.getAttribute('name'))) {
                    problemStations.push(selectedStation.getAttribute('name'))
                    mildStation.textContent = selectedStation.getAttribute('name')
                    mildStationsDiv.appendChild(mildStation)
                }
            } else {
                selectedStation.setAttribute('fill', 'green')
                selectedStation.setAttribute('opacity', '0.5')
            }

        })
    })
}

let refreshTime = () => {
    let refreshTime = document.getElementById('refreshtime')
    let date = new Date()
    let hours = date.getHours()
    let minutes = date.getMinutes()

    // Check whether AM or PM
    let newformat = hours >= 12 ? 'PM' : 'AM'

    // Find current hour in AM-PM Format
    hours = hours % 12

    // To display "0" as "12"
    hours = hours ? hours : 12
    minutes = minutes < 10 ? '0' + minutes : minutes

    refreshTime.textContent = `${hours}:${minutes} ${newformat}`
}

let clickedRefresh = () => {
    location.reload()
}

refreshTime()
drawMap()









